import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';
import type { UserJSON, WebhookEvent } from '@clerk/backend';

const http = httpRouter();

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const { data, type } = await request.json();

  switch (type) {
    case 'user.created':
      await ctx.runMutation(internal.users.upsertFromClerk, {
        data: data as UserJSON,
      });
      break;
    case 'user.deleted':
      await ctx.runMutation(internal.users.deleteFromClerk, {
        clerkUserId: data.id,
      });
      break;
    default:
      console.log('Ignored Clerk webhook event', type);
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
  const payloadString = await req.text();
  const svixHeaders = {
    'svix-id': req.headers.get('svix-id')!,
    'svix-timestamp': req.headers.get('svix-timestamp')!,
    'svix-signature': req.headers.get('svix-signature')!,
  };
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error('Error verifying webhook event', error);
    return null;
  }
}

export default http;
