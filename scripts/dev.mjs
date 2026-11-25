import { spawn, spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const server = path.join(root, 'trakky-server');
const client = path.join(root, 'trakky-client');
const dbPath = path.join(root, '.db/trakky.db');
const databaseUrl = `file:${dbPath}`;
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';

function run(args, cwd, env = {}) {
  const result = spawnSync(npm, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

async function seed() {
  const { PrismaClient } = createRequire(path.join(server, 'package.json'))('@prisma/client');
  const prisma = new PrismaClient({ datasources: { db: { url: databaseUrl } } });
  const fixture = (name) => JSON.parse(readFileSync(path.join(client, `src/lib/${name}.json`), 'utf8'));

  try {
    await prisma.icon.createMany({
      data: [
        { id: 1, name: 'Utensils' },
        { id: 3, name: 'HandCoins' },
        { id: 4, name: 'HomeIcon' },
        { id: 5, name: 'Gift' },
        { id: 6, name: 'Fuel' },
        { id: 7, name: 'BabyIcon' },
        { id: 8, name: 'Plane' },
        { id: 9, name: 'HeartIcon' },
      ],
    });
    await prisma.type.createMany({
      data: ['Food', 'General', 'Personal', 'Travel', 'House'].map((name) => ({ name })),
    });
    await prisma.owner.createMany({
      data: ['Donald', 'Goofy', 'Mickey'].map((name) => ({ name })),
    });
    await prisma.category.createMany({
      data: [
        { id: 1, name: 'Food', iconId: 1 },
        { id: 2, name: 'Travel', iconId: 8 },
        { id: 3, name: 'General', iconId: 3 },
        { id: 4, name: 'Personal', iconId: 5 },
        { id: 5, name: 'House', iconId: 4 },
      ],
    });
    await prisma.payment.createMany({
      data: fixture('mockPayments').map((p) => ({
        id: Number(p.id),
        amount: p.amount,
        description: p.description,
        date: new Date(p.date),
        owner: p.owner,
        type: p.type,
      })),
    });
    await prisma.budget.createMany({
      data: fixture('mockBudgets').map((b) => ({
        id: Number(b.id),
        date: new Date(b.date),
        budget: b.budget,
        maxBudget: b.maxBudget,
      })),
    });
    console.log('Seeded local database with mock data.');
  } finally {
    await prisma.$disconnect();
  }
}

for (const dir of [server, client]) {
  if (!existsSync(path.join(dir, 'node_modules'))) {
    run(['install', '--no-audit', '--no-fund'], dir);
  }
}

mkdirSync(path.dirname(dbPath), { recursive: true });
const fresh = !existsSync(dbPath);

// Prisma has no env-based provider switch; derive the SQLite schema from the prod one.
const schema = readFileSync(path.join(server, 'prisma/schema.prisma'), 'utf8')
  .replace('provider = "mysql"', 'provider = "sqlite"')
  .replace(/@db\.Binary\(1\)/g, '')
  .replace(/, map: "(?:Category|SharedExpenses)_ibfk_\d+"/g, '');
const localSchema = path.join(server, 'prisma/schema.local.prisma');
writeFileSync(localSchema, schema);

const dbEnv = { DATABASE_URL: databaseUrl };
run(['run', 'prisma:local:push'], server, dbEnv);
run(['run', 'prisma:local:generate'], server, dbEnv);
if (fresh) await seed();

const children = [
  spawn(npm, ['run', 'dev'], {
    cwd: server,
    env: { ...process.env, ...dbEnv, SKIP_AUTH: 'true', ALLOWED_ORIGINS: 'http://localhost:8997' },
    stdio: 'inherit',
  }),
  spawn(npm, ['run', 'dev:local'], {
    cwd: client,
    env: {
      ...process.env,
      VITE_DEMO_MODE: 'false',
      VITE_SKIP_AUTH: 'true',
      VITE_SERVER_URL: '/api',
      VITE_API_BASE_URL: 'http://localhost:8999',
    },
    stdio: 'inherit',
  }),
];

let stopping = false;
function shutdown(code) {
  if (stopping) return;
  stopping = true;
  for (const child of children) child.kill();
  process.exit(code);
}
for (const child of children) child.on('exit', (code) => shutdown(code ?? 1));
process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));
