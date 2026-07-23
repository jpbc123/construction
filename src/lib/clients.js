import fs from 'node:fs';
import path from 'node:path';

const CLIENTS_DIR = path.join(process.cwd(), 'data', 'clients');

/**
 * Each client is one JSON file in data/clients/<slug>.json.
 * Adding a file and rebuilding publishes /<slug> and its sub-pages.
 * See data/clients/ns-contractor-jb.json for the full shape.
 */
export function getClientSlugs() {
  return fs
    .readdirSync(CLIENTS_DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));
}

export function getClient(slug) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const file = path.join(CLIENTS_DIR, `${slug}.json`);
  if (!fs.existsSync(file)) return null;
  return { ...JSON.parse(fs.readFileSync(file, 'utf8')), slug };
}

/** All clients, for the demo index at /. */
export function getAllClients() {
  return getClientSlugs().map(getClient);
}

/** Build a path within a client's site: url(client, 'services') -> /ns-contractor-jb/services */
export function url(client, page = '') {
  return page ? `/${client.slug}/${page}` : `/${client.slug}`;
}

/** WhatsApp deep link, when the client JSON supplies a `whatsapp` number. */
export function waLink(client, message) {
  if (!client.company.whatsapp) return null;
  const text = message ?? client.company.whatsappMessage;
  return `https://wa.me/${client.company.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
}
