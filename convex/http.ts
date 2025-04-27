import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';
import { Webhook } from 'svix';
import type { WebhookEvent } from '@clerk/backend';

const http = httpRouter();

const handleClerkWebhook = httpAction(async (ctx, request) => {
  const payloadString = await request.text();
  const headerPayload = request.headers;

  try {
    const result = await ctx.runAction(internal.clerk.fulfill, {
      payload: payloadString,
      headers: {
        'svix-id': headerPayload.get('svix-id')!,
        'svix-signature': headerPayload.get('svix-signature')!,
        'svix-timestamp': headerPayload.get('svix-timestamp')!,
      },
    });

    switch (result.type) {
      case 'user.created':
        await ctx.runMutation(internal.users.createUser, {
          clerkId: result.data.id,
          first_name: result.data.first_name as string,
          last_name: result.data.last_name as string,
          email: result.data.email_addresses[0].email_address,
          imageUrl: result.data.image_url,
        });
        break;
      // case "user.updated":
      // 	await ctx.runMutation(internal.users.updateUser, {
      // 		tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.id}`,
      // 		image: result.data.image_url,
      // 	});
      // 	break;
      // case "session.created":
      // 	await ctx.runMutation(internal.users.setUserOnline, {
      // 		tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
      // 	});
      // 	break;
      // case "session.ended":
      // 	await ctx.runMutation(internal.users.setUserOffline, {
      // 		tokenIdentifier: `${process.env.CLERK_APP_DOMAIN}|${result.data.user_id}`,
      // 	});
      // 	break;
    }

    return new Response(null, {
      status: 200,
    });
  } catch (error) {
    console.log('Webhook Error🔥🔥', error);
    return new Response('Webhook Error', {
      status: 400,
    });
  }

  const event = await validateRequest(request);
  if (!event) {
    return new Response('Error occurred', { status: 400 });
  }
  const { data, type } = event;

  console.log(type, data);

  switch (type) {
    case 'user.created':
      await ctx.runMutation(internal.users.createUser, {
        clerkId: data.id,
        first_name: data.first_name as string,
        last_name: data.last_name as string,
        email: data.email_addresses[0].email_address,
        imageUrl: data.image_url,
      });

      break;
    case 'user.deleted':
      break;
    default:
      console.log('Ignored Clerk webhook event', event.type);
      break;
  }
  return new Response(null, {
    status: 200,
    // headers: new Headers({
    //   'Access-Control-Allow-Origin': 'http://localhost:8081',
    //   // 'Access-Control-Allow-Methods': 'POST',
    //   // 'Access-Control-Allow-Headers': 'Content-Type, Digest',
    //   // 'Access-Control-Max-Age': '86400',
    //   Vary: 'origin',
    // }),
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
