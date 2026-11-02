const EM_DASH = '\u2014';
const HYPHEN = '-';

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Disallow em dashes (-); use a hyphen (-) instead',
    },
    fixable: 'code',
    schema: [],
    messages: {
      emDash: 'Replace em dash (-) with a hyphen (-).',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode ?? context.getSourceCode();

    return {
      Program(node) {
        const text = sourceCode.getText();
        let fromIndex = 0;

        while (fromIndex < text.length) {
          const index = text.indexOf(EM_DASH, fromIndex);
          if (index === -1) {
            break;
          }

          const start = sourceCode.getLocFromIndex(index);
          const end = sourceCode.getLocFromIndex(index + EM_DASH.length);

          context.report({
            node,
            loc: { start, end },
            messageId: 'emDash',
            fix(fixer) {
              return fixer.replaceTextRange(
                [index, index + EM_DASH.length],
                HYPHEN,
              );
            },
          });

          fromIndex = index + EM_DASH.length;
        }
      },
    };
  },
};
