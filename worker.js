// Worker do site. O site continua 100% estático: o wrangler.jsonc só manda para
// cá as requisições de /rb/* (run_worker_first). Todo o resto vai direto para os
// assets, sem passar por este código.
//
// /rb/* é o proxy reverso do PostHog (analytics): os eventos saem pelo domínio do
// site em vez de *.posthog.com, o que evita bloqueio por ad blockers.
// Baseado no guia oficial "Cloudflare reverse proxy" do PostHog (região US).

const PREFIX = "/rb";
const API_HOST = "us.i.posthog.com";
const ASSET_HOST = "us-assets.i.posthog.com";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname === PREFIX || url.pathname.startsWith(PREFIX + "/")) {
      const path = url.pathname.slice(PREFIX.length) || "/";
      const pathWithParams = path + url.search;
      if (path.startsWith("/static/")) return retrieveStatic(request, pathWithParams, ctx);
      return forwardRequest(request, pathWithParams);
    }
    return env.ASSETS.fetch(request);
  },
};

// Script do SDK: busca no CDN do PostHog e guarda no cache da Cloudflare.
async function retrieveStatic(request, pathWithParams, ctx) {
  let response = await caches.default.match(request);
  if (!response) {
    response = await fetch(`https://${ASSET_HOST}${pathWithParams}`);
    if (response.ok) ctx.waitUntil(caches.default.put(request, response.clone()));
  }
  return response;
}

// Eventos, gravações e flags: repassa para a API do PostHog com o IP real do
// visitante (para a geolocalização) e sem os cookies do site.
async function forwardRequest(request, pathWithParams) {
  const originRequest = new Request(request);
  originRequest.headers.delete("cookie");
  const ip = request.headers.get("CF-Connecting-IP");
  if (ip) originRequest.headers.set("X-Forwarded-For", ip);
  return fetch(`https://${API_HOST}${pathWithParams}`, originRequest);
}
