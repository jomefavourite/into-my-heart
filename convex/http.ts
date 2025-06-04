import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/backend';

const http = httpRouter();

const handleClerkWebhook = httpAction(async (ctx, request) => {
  // const event = await validateRequest(request);

  // if (!event) {
  //   return new Response('Error occurred', { status: 400 });
  // }
  // const { data, type } = event;

  const { data, type } = await request.json();

  switch (type) {
    case 'user.created':
      await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        first_name: data.first_name ? (data.first_name as string) : undefined,
        last_name: data.last_name ? (data.last_name as string) : undefined,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });
      break;
    case 'user.deleted':
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
