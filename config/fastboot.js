/* eslint-disable n/no-unsupported-features/node-builtins */
'use strict';

function getStreamGlobals() {
  if (
    typeof globalThis.ReadableStream !== 'undefined' &&
    typeof globalThis.WritableStream !== 'undefined' &&
    typeof globalThis.TransformStream !== 'undefined'
  ) {
    return {
      ReadableStream: globalThis.ReadableStream,
      WritableStream: globalThis.WritableStream,
      TransformStream: globalThis.TransformStream,
    };
  }

  const streamWeb = require('node:stream/web');

  return {
    ReadableStream: streamWeb.ReadableStream,
    WritableStream: streamWeb.WritableStream,
    TransformStream: streamWeb.TransformStream,
  };
}

module.exports = function getFastbootConfig() {
  return {
    buildSandboxGlobals(defaultGlobals) {
      return {
        ...defaultGlobals,
        fetch: globalThis.fetch,
        Headers: globalThis.Headers,
        Request: globalThis.Request,
        Response: globalThis.Response,
        AbortController: globalThis.AbortController,
        ...getStreamGlobals(),
      };
    },
  };
};
