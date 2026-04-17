import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { AST_NODE_TYPES } from '@typescript-eslint/utils';
import { defineCommand } from 'eslint-plugin-command/commands';

export const barrelFile = defineCommand({
  commentType: 'both',
  name: 'barrel-file',
  match: (comment) => /^@\s*barrel-file$/.exec(comment.value.trim()),
  action(ctx) {
    const filename = ctx.context.filename;
    const dir = path.dirname(filename);

    const stat = statSync(dir);

    if (!stat.isDirectory()) return;

    const entries = readdirSync(dir, { withFileTypes: true });
    const expected = entries
      .filter((e) => {
        if (e.isDirectory()) return true;
        if (!e.isFile()) return false;
        const { ext, name } = path.parse(e.name);
        if (!['.ts', '.tsx'].includes(ext)) return false;
        if (name === 'index') return false;
        if (/\.\w*\.(?:j|t)sx?$/.test(e.name)) return false;
        return true;
      })
      .map((e) => (e.isDirectory() ? `./${e.name}` : `./${path.parse(e.name).name}`));

    const exportedPaths = new Set<string>();

    for (const node of ctx.source.ast.body) {
      if (node.type === AST_NODE_TYPES.ExportNamedDeclaration || node.type === AST_NODE_TYPES.ExportAllDeclaration) {
        const src = node.source;
        if (src?.type === AST_NODE_TYPES.Literal && typeof src.value === 'string') {
          const raw = src.value.replace(/\.(?:ts|tsx)$/, '');
          exportedPaths.add(raw);
        }
      }
    }

    const missing = expected.filter((e) => !exportedPaths.has(e)).toSorted();
    if (missing.length === 0) return false;

    const displayNames = missing.map((m) => m.replace(/^\.\//, '')).toSorted();

    ctx.report({
      fix(fixer) {
        const lines = missing.map((m) => `export * from '${m}';`).join('\n');
        return fixer.insertTextAfter(ctx.comment, `\n${lines}`);
      },
      message: `Barrel file is missing export for '${displayNames.join(', ')}'`,
      node: ctx.source.ast,
      removeComment: false,
    });
  },
});
