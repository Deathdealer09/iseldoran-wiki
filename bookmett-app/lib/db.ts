import { promises as fs } from "fs";
import path from "path";
import os from "os";
import type { Store, Booking, Customer } from "./types";
import { seedStore } from "./seed";

/*
 * Lightweight JSON-file datastore — no native deps, no migration step.
 * - Locally it persists to ./data/store.json (survives restarts).
 * - On a read-only serverless FS (e.g. Vercel) it falls back to the OS tmp dir,
 *   which is per-instance and ephemeral — fine for a demo/prototype.
 *
 * Swap this module for Prisma + Postgres for real multi-tenant production use;
 * every call site goes through the async helpers below.
 */

const PRIMARY = path.join(process.cwd(), "data", "store.json");
const FALLBACK = path.join(os.tmpdir(), "bookmett-store.json");

// In-memory cache so concurrent requests in one instance stay consistent.
let cache: Store | null = null;
let filePath: string | null = null;

async function resolvePath(): Promise<string> {
  if (filePath) return filePath;
  // Prefer the project data dir; if it isn't writable, use tmp.
  try {
    await fs.mkdir(path.dirname(PRIMARY), { recursive: true });
    await fs.access(path.dirname(PRIMARY));
    filePath = PRIMARY;
  } catch {
    filePath = FALLBACK;
  }
  return filePath;
}

export async function getStore(): Promise<Store> {
  if (cache) return cache;
  const p = await resolvePath();
  try {
    const raw = await fs.readFile(p, "utf8");
    cache = JSON.parse(raw) as Store;
  } catch {
    cache = seedStore();
    await persist(cache);
  }
  return cache;
}

async function persist(store: Store): Promise<void> {
  const p = await resolvePath();
  try {
    await fs.writeFile(p, JSON.stringify(store, null, 2), "utf8");
  } catch {
    // Read-only FS in prod — the in-memory cache still serves this instance.
  }
}

/** Run a mutation against the store and persist the result. */
export async function mutate<T>(fn: (store: Store) => T): Promise<T> {
  const store = await getStore();
  const result = fn(store);
  cache = store;
  await persist(store);
  return result;
}

export function newId(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

/** Upsert a customer when a booking is made (feeds the built-in CRM). */
export function upsertCustomer(store: Store, name: string, phone: string): Customer {
  const existing = store.customers.find(
    (c) => c.name.toLowerCase() === name.toLowerCase() || (phone && c.phone === phone),
  );
  if (existing) {
    existing.visits += 1;
    existing.lastVisit = "Just now";
    if (existing.visits >= 10) existing.tag = "VIP";
    else if (existing.visits >= 4) existing.tag = "Regular";
    return existing;
  }
  const c: Customer = {
    id: newId("c"),
    name,
    phone: phone || "—",
    visits: 1,
    lastVisit: "Just now",
    tag: "New",
  };
  store.customers.unshift(c);
  return c;
}
