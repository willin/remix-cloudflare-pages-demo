import { logDevReady } from '@remix-run/cloudflare';
import { createPagesFunctionHandler } from '@remix-run/cloudflare-pages';
import * as build from '@remix-run/dev/server-build';
import { AuthService } from '~/server/services/auth';
import { EnvSchema } from './env';

if (process.env.NODE_ENV === 'development') {
  logDevReady(build);
}

export const onRequest = createPagesFunctionHandler({
  build,
  getLoadContext: (ctx) => {
    const env = EnvSchema.parse(ctx.env);
    const { hostname } = new URL(ctx.request.url);

    const auth = new AuthService(env, hostname);
    const services: RemixServer.Services = {
      auth
    };
    return { env, services };
  },
  mode: build.mode
});
