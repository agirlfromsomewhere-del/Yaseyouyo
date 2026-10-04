import { openDB } from 'idb';

const DB_NAME = 'diet-coach';
const DB_VERSION = 3;

// The user's usual foods, preloaded the first time the customFoods store is
// created. basis 'serving': kcal is per one serving. basis 'per100g': kcal
// is per 100 g and the user enters grams eaten. estimate:true marks values
// that are rough guesses, shown in the UI so they get edited to match the
// real recipe/label.
const SEED_FOODS = [
  {
    name: 'MyProtein chocolate pancake mix',
    basis: 'serving',
    kcal: 184,
    servingDesc: '1 serving (50 g dry mix)',
    estimate: false,
    note: 'From published nutrition data; check the label on your tub.',
  },
  {
    name: 'Milk tea with sugar',
    basis: 'serving',
    kcal: 90,
    servingDesc: '240 ml',
    estimate: true,
    note: 'Rough guess; depends on how much milk and sugar you use.',
  },
  {
    name: 'White rice, cooked',
    basis: 'per100g',
    kcal: 130,
    defaultGrams: 130,
    estimate: false,
    note: 'Typical value for cooked white rice.',
  },
  {
    name: 'Homemade kufta',
    basis: 'per100g',
    kcal: 250,
    defaultGrams: 120,
    estimate: true,
    note: 'Rough guess; depends on the meat and fat in your recipe.',
  },
  {
    name: 'Canned fish',
    basis: 'per100g',
    kcal: 150,
    defaultGrams: 100,
    estimate: true,
    note: 'Rough guess; tuna in water is about 116, in oil or sardines nearer 200.',
  },
];

let dbPromise;

export function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db, oldVersion) {
        if (oldVersion < 1) {
          db.createObjectStore('profile', { keyPath: 'id' });
          db.createObjectStore('goal', { keyPath: 'id' });

          const weightLog = db.createObjectStore('weightLog', { keyPath: 'id' });
          weightLog.createIndex('byDate', 'dateISO');

          const foodLog = db.createObjectStore('foodLog', { keyPath: 'id' });
          foodLog.createIndex('byDate', 'dateISO');
        }
        if (oldVersion < 2) {
          const supportLog = db.createObjectStore('supportLog', { keyPath: 'id' });
          supportLog.createIndex('byDate', 'dateISO');
        }
        if (oldVersion < 3) {
          const customFoods = db.createObjectStore('customFoods', { keyPath: 'id' });
          SEED_FOODS.forEach((food, i) => {
            customFoods.put({ ...food, id: crypto.randomUUID(), createdAt: Date.now() + i });
          });
        }
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

// --- Custom (saved) foods ---

export async function getCustomFoods() {
  const db = await initDB();
  const all = await db.getAll('customFoods');
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function saveCustomFood(fields) {
  const db = await initDB();
  const { id, ...rest } = fields;
  const existing = id ? await db.get('customFoods', id) : null;
  const food = { ...(existing || { id: uid(), createdAt: Date.now() }), ...rest };
  await db.put('customFoods', food);
  return food;
}

export async function deleteCustomFood(id) {
  const db = await initDB();
  await db.delete('customFoods', id);
}

// --- Support check-ins (the "having a moment" flow) ---

export async function addSupportCheckIn({ feeling, tookAction }) {
  const db = await initDB();
  const entry = { id: uid(), dateISO: todayISO(), feeling, tookAction, createdAt: Date.now() };
  await db.put('supportLog', entry);
  return entry;
}

export async function getSupportLog() {
  const db = await initDB();
  const all = await db.getAll('supportLog');
  return all.sort((a, b) => a.createdAt - b.createdAt);
}

export async function getSupportCheckInsThisWeek() {
  const all = await getSupportLog();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 7);
  return all.filter((e) => new Date(e.createdAt) >= cutoff);
}
