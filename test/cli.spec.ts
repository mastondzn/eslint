import { dirname, join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { execa } from 'execa';
import fs from 'fs-extra';
import { afterAll, beforeEach, expect, it } from 'vitest';

const currentDirectory = dirname(fileURLToPath(import.meta.url));

const CLI_PATH = join(currentDirectory, '../bin/index.js');
const genPath = join(currentDirectory, '..', '.temp');

async function run(environment = {
  SKIP_PROMPT: '1',
  SKIP_GIT_CHECK: '1',
}) {
  return execa(`node`, [CLI_PATH, 'migrate'], {
    cwd: genPath,
    env: {
      ...process.env,
      NO_COLOR: '1',
      ...environment,
    },
  });
};

async function createMockDirectory() {
  await fs.rm(genPath, { recursive: true, force: true });
  await fs.ensureDir(genPath);

  await Promise.all([
    fs.writeFile(join(genPath, 'package.json'), JSON.stringify({}, null, 2)),
    fs.writeFile(join(genPath, '.eslintrc.yml'), ''),
    fs.writeFile(join(genPath, '.eslintignore'), 'some-path\nsome-file'),
    fs.writeFile(join(genPath, '.prettierc'), ''),
    fs.writeFile(join(genPath, '.prettierignore'), 'some-path\nsome-file'),
  ]);
};

beforeEach(async () => {
  await createMockDirectory();
});
afterAll(async () => {
  await fs.rm(genPath, { recursive: true, force: true });
});

it('package.json updated', async () => {
  const { stdout } = await run();

  const packageContent = await fs.readJSON(join(genPath, 'package.json')) as Record<string, unknown>;

  expect(JSON.stringify(packageContent.devDependencies)).toContain('@antfu/eslint-config');
  expect(stdout).toContain('changes wrote to package.json');
});

it('esm eslint.config.js', async () => {
  const packageContent = await fs.readFile('package.json', 'utf8');
  await fs.writeFile(join(genPath, 'package.json'), JSON.stringify({ ...JSON.parse(packageContent), type: 'module' }, null, 2));

  const { stdout } = await run();

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf8');
  expect(eslintConfigContent.includes('export default')).toBeTruthy();
  expect(stdout).toContain('created eslint.config.js');
});

it('cjs eslint.config.js', async () => {
  const { stdout } = await run();

  const eslintConfigContent = await fs.readFile(join(genPath, 'eslint.config.js'), 'utf8');
  expect(eslintConfigContent.includes('module.exports')).toBeTruthy();
  expect(stdout).toContain('created eslint.config.js');
});

it('ignores files added in eslint.config.js', async () => {
  const { stdout } = await run();

  const eslintConfigContent = (await fs.readFile(join(genPath, 'eslint.config.js'), 'utf8')).replaceAll('\\', '/');

  expect(stdout).toContain('created eslint.config.js');
  expect(eslintConfigContent)
    .toMatchInlineSnapshot(`
      "const antfu = require('@antfu/eslint-config').default

      module.exports = antfu({
      ignores: ["some-path","**/some-path/**","some-file","**/some-file/**"]
      })
      "
    `);
});

it('suggest remove unnecessary files', async () => {
  const { stdout } = await run();

  expect(stdout).toContain('you can now remove those files manually');
  expect(stdout).toContain('.eslintignore, .eslintrc.yml, .prettierc, .prettierignore, eslint.config.js');
});
