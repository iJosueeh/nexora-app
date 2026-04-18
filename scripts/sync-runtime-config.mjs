import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rootDir = process.cwd();
const envPath = resolve(rootDir, '.env');
const configPath = resolve(rootDir, 'public/config/app-config.json');
const templatePath = resolve(rootDir, 'public/config/app-config.template.json');

const hardcodedDefaults = {
  apiBaseUrl: 'http://localhost:8080/api',
  graphqlUrl: 'http://localhost:8080/graphql',
  supabaseUrl: '',
  supabaseAnonKey: '',
};

function readTemplateDefaults() {
  if (!existsSync(templatePath)) {
    return hardcodedDefaults;
  }

  try {
    const parsed = JSON.parse(readFileSync(templatePath, 'utf8'));
    return {
      apiBaseUrl: typeof parsed.apiBaseUrl === 'string' ? parsed.apiBaseUrl : hardcodedDefaults.apiBaseUrl,
      graphqlUrl: typeof parsed.graphqlUrl === 'string' ? parsed.graphqlUrl : hardcodedDefaults.graphqlUrl,
      supabaseUrl: typeof parsed.supabaseUrl === 'string' ? parsed.supabaseUrl : hardcodedDefaults.supabaseUrl,
      supabaseAnonKey: typeof parsed.supabaseAnonKey === 'string' ? parsed.supabaseAnonKey : hardcodedDefaults.supabaseAnonKey,
    };
  } catch {
    return hardcodedDefaults;
  }
}

function parseEnv(content) {
  const entries = {};

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const separator = line.indexOf('=');
    if (separator < 0) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"'))
      || (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    entries[key] = value;
  }

  return entries;
}

function buildConfig(envEntries, defaults) {
  const supabaseAnonKey = envEntries.SUPABASE_ANON_KEY || defaults.supabaseAnonKey;

  if (looksLikeSecretKey(supabaseAnonKey)) {
    throw new Error(
      'SUPABASE_ANON_KEY no puede ser una clave secreta. Usa la anon/public key de Supabase; nunca la service_role ni una key que empiece con sb_secret.'
    );
  }

  return {
    apiBaseUrl: envEntries.API_BASE_URL || defaults.apiBaseUrl,
    graphqlUrl: envEntries.GRAPHQL_URL || defaults.graphqlUrl,
    supabaseUrl: envEntries.SUPABASE_URL || defaults.supabaseUrl,
    supabaseAnonKey,
  };
}

function looksLikeSecretKey(value) {
  if (typeof value !== 'string') return false;

  const normalized = value.trim().toLowerCase();
  return normalized.startsWith('sb_secret_')
    || normalized.includes('service_role')
    || normalized.includes('secret');
}

const envEntries = existsSync(envPath)
  ? parseEnv(readFileSync(envPath, 'utf8'))
  : {};

const defaults = readTemplateDefaults();

if (!existsSync(envPath)) {
  console.warn('[sync-runtime-config] No se encontro .env; se usaran valores por defecto.');
}

const config = buildConfig(envEntries, defaults);
writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');

console.log('[sync-runtime-config] Archivo public/config/app-config.json actualizado.');
