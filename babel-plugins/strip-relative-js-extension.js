'use strict';

module.exports = function stripRelativeJsExtensionPlugin({ types: t }) {
  function stripExtension(value) {
    if ((value.startsWith('./') || value.startsWith('../')) && value.endsWith('.js')) {
      return value.slice(0, -3);
    }
    return value;
  }

  return {
    name: 'strip-relative-js-extension',
    visitor: {
      ImportDeclaration(path) {
        path.node.source.value = stripExtension(path.node.source.value);
      },
      ExportNamedDeclaration(path) {
        if (path.node.source) {
          path.node.source.value = stripExtension(path.node.source.value);
        }
      },
      ExportAllDeclaration(path) {
        if (path.node.source) {
          path.node.source.value = stripExtension(path.node.source.value);
        }
      },
      CallExpression(path) {
        if (
          t.isIdentifier(path.node.callee, { name: 'require' }) &&
          path.node.arguments.length === 1 &&
          t.isStringLiteral(path.node.arguments[0])
        ) {
          path.node.arguments[0].value = stripExtension(path.node.arguments[0].value);
        }
      },
    },
  };
};
