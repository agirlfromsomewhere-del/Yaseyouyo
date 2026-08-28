import { openDB } from 'idb';

const DB_NAME = 'diet-coach';
const DB_VERSION = 1;

let dbPromise;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('profile', { keyPath: 'id' });
        db.createObjectStore('goal', { keyPath: 'id' });

        const weightLog = db.createObjectStore('weightLog', { keyPath: 'id' });
        weightLog.createIndex('byDate', 'dateISO');

        const foodLog = db.createObjectStore('foodLog', { keyPath: 'id' });
        foodLog.createIndex('byDate', 'dateISO');
      },
    });
  }
  return dbPromise;
}

function uid() {
  return crypto.randomUUID();
}

export function todayISO(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// --- Profile (singleton) ---

export async function getProfile() {
  const db = await initDB();
  return db.get('profile', 'profile');
}

export async function saveProfile(fields) {
  const db = await initDB();
  const existing = (await db.get('profile', 'profile')) || { id: 'profile', createdAt: Date.now() };
  const profile = { ...existing, ...fields, id: 'profile', updatedAt: Date.now() };
  await db.put('profile', profile);
  return profile;
}

// --- Goal (singleton) ---

export async function getGoal() {
  const db = await initDB();
  return db.get('goal', 'goal');
}

export async function saveGoal(fields) {
  const db = await initDB();
  const goal = { id: 'goal', ...fields, updatedAt: Date.now() };
  await db.put('goal', goal);
  return goal;
}

// --- Weight log ---

// bodyFatPct and muscleMassKg are optional — most entries will just be a
// weight, with fat%/muscle logged whenever a body-comp scale reading is
// available.
export async function addWeightEntry(weightKg, dateISO = todayISO(), { bodyFatPct, muscleMassKg } = {}) {
  const db = await initDB();
  const entry = { id: uid(), dateISO, weightKg, bodyFatPct, muscleMassKg, createdAt: Date.now() };
  await db.put('weightLog', entry);
  return entry;
}

export async function getWeightLog() {
  const db = await initDB();
  const all = await db.getAll('weightLog');
  return all.sort((a, b) => a.dateISO.localeCompare(b.dateISO) || a.createdAt - b.createdAt);
}

export async function getLatestWeight() {
  const log = await getWeightLog();
  return log.length ? log[log.length - 1] : null;
}

export async function deleteWeightEntry(id) {
  const db = await initDB();
  await db.delete('weightLog', id);
}

// --- Food log ---

export async function addFoodEntry({ name, kcal }, dateISO = todayISO()) {
  const db = await initDB();
  const entry = { id: uid(), dateISO, name, kcal, createdAt: Date.now() };
  await db.put('foodLog', entry);
  return entry;
}

export async function getFoodLogForDate(dateISO = todayISO()) {
  const db = await initDB();
  const entries = await db.getAllFromIndex('foodLog', 'byDate', dateISO);
  return entries.sort((a, b) => a.createdAt - b.createdAt);
}

export async function getAllFoodLog() {
  const db = await initDB();
  const all = await db.getAll('foodLog');
  return all.sort((a, b) => a.dateISO.localeCompare(b.dateISO) || a.createdAt - b.createdAt);
}

export async function deleteFoodEntry(id) {
  const db = await initDB();
  await db.delete('foodLog', id);
}

export async function totalKcalForDate(dateISO = todayISO()) {
  const entries = await getFoodLogForDate(dateISO);
  return entries.reduce((sum, e) => sum + e.kcal, 0);
}
