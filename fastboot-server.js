'use strict';

const FastBootAppServer = require('fastboot-app-server');

const EMBER_TOP_LEVEL = new Set([
  '',
]);

const KNOWN_LEGACY_SLUGS = [
  /^\/what-is-commercial-rent-stabilization\/?$/,
];

const ASSET_PREFIXES = ['/assets/', '/images/', '/s/', '/.well-known/'];
const ASSET_EXACT = new Set([
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/manifest.webmanifest',
  '/manifest.json',
]);
const FILE_EXTENSION_RE = /\.(js|css|map|png|jpe?g|gif|svg|webp|ico|txt|xml|json|webmanifest|woff2?|ttf|eot|pdf)$/i;

function isAssetOrFileRequest(pathname) {
  if (ASSET_EXACT.has(pathname)) {
    return true;
  }

  if (ASSET_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return FILE_EXTENSION_RE.test(pathname);
}

function hasLegacySlugMatch(pathname) {
  return KNOWN_LEGACY_SLUGS.some((matcher) => matcher.test(pathname));
}

function looksLikeLegacyGhostPost(pathname) {
  const clean = pathname.replace(/^\/+|\/+$/g, '');

  if (!clean) {
    return false;
  }

  if (clean.includes('/')) {
    return false;
  }

  if (EMBER_TOP_LEVEL.has(clean)) {
    return false;
  }

  if (isAssetOrFileRequest(pathname)) {
    return false;
  }

  return true;
}

let server = new FastBootAppServer({
  distPath: 'dist',
  port: process.env.PORT || 3000,
  beforeMiddleware(app) {
    app.use((req, res, next) => {
      if (process.env.LOG_FASTBOOT_HOST === 'true') {
        console.info('[fastboot-host]', req.headers.host || '(missing host header)');
      }

      const method = req.method || '';
      const accept = req.headers.accept || '';
      const pathname = req.path || '/';
      const isGetLike = method === 'GET' || method === 'HEAD';
      const isHtml = accept.includes('text/html') || accept.includes('*/*') || accept === '';

      if (!isGetLike || !isHtml || pathname === '/') {
        return next();
      }

      if (isAssetOrFileRequest(pathname)) {
        return next();
      }

      if (hasLegacySlugMatch(pathname) || looksLikeLegacyGhostPost(pathname)) {
        console.info('[legacy-redirect] Redirecting legacy path:', pathname);
        return res.redirect(301, '/');
      }

      return next();
    });
  },
});

server.start();
