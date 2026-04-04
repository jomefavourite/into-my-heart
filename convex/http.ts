import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';
import type { UserJSON, WebhookEvent } from '@clerk/backend';

const http = httpRouter();

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const event = await validateRequest(request);
  if (!event) {
    return new Response('Invalid webhook signature', {
      status: 401,
    });
  }

  switch (event.type) {
    case 'user.created':
      await ctx.runMutation(internal.users.upsertFromClerk, {
        data: event.data as UserJSON,
      });
      break;
    case 'user.deleted':
      if (!('id' in event.data) || typeof event.data.id !== 'string') {
        return new Response('Invalid user.deleted payload', {
          status: 400,
        });
      }
      await ctx.runMutation(internal.users.deleteFromClerk, {
        clerkUserId: event.data.id,
      });
      break;
    default:
      console.log('Ignored Clerk webhook event', event.type);
      break;
  }

  return new Response(null, {
    status: 200,
  });
});

http.route({
  path: '/clerk-users-webhook',
  method: 'POST',
  handler: handleClerkWebhook,
});

async function validateRequest(req: Request): Promise<WebhookEvent | null> {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET is not configured');
    return null;
  }

  const payloadString = await req.text();
  const svixId = req.headers.get('svix-id');
  const svixTimestamp = req.headers.get('svix-timestamp');
  const svixSignature = req.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Missing Svix headers on Clerk webhook request');
    return null;
  }

  const svixHeaders = {
    'svix-id': svixId,
    'svix-timestamp': svixTimestamp,
    'svix-signature': svixSignature,
  };
  const wh = new Webhook(webhookSecret);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook event', error);
    return null;
  }
}

export default http;
