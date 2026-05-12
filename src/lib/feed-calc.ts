// Standar % bobot tubuh untuk kebutuhan pakan harian (dry matter basis sederhana)
export type LivestockType = {
  id: string;
  name: string;
  emoji: string;
  // % berat badan (range, kita pakai mid)
  dailyFeedPct: number;
  // gram protein per kg pakan (info nutrisi)
  proteinPerKg: number;
  hijauanRatio: number; // 0-1
};

export const LIVESTOCK: LivestockType[] = [
  { id: "sapi-potong", name: "Sapi Potong", emoji: "🐄", dailyFeedPct: 0.03, proteinPerKg: 120, hijauanRatio: 0.7 },
  { id: "sapi-perah", name: "Sapi Perah", emoji: "🐮", dailyFeedPct: 0.035, proteinPerKg: 160, hijauanRatio: 0.6 },
  { id: "kambing", name: "Kambing", emoji: "🐐", dailyFeedPct: 0.04, proteinPerKg: 140, hijauanRatio: 0.75 },
  { id: "domba", name: "Domba", emoji: "🐑", dailyFeedPct: 0.04, proteinPerKg: 135, hijauanRatio: 0.75 },
  { id: "ayam-petelur", name: "Ayam Petelur", emoji: "🐔", dailyFeedPct: 0.06, proteinPerKg: 170, hijauanRatio: 0.1 },
  { id: "ayam-pedaging", name: "Ayam Pedaging", emoji: "🐓", dailyFeedPct: 0.08, proteinPerKg: 210, hijauanRatio: 0.05 },
  { id: "kerbau", name: "Kerbau", emoji: "🐃", dailyFeedPct: 0.028, proteinPerKg: 110, hijauanRatio: 0.8 },
  { id: "kelinci", name: "Kelinci", emoji: "🐇", dailyFeedPct: 0.05, proteinPerKg: 160, hijauanRatio: 0.5 },
];

export type HealthCondition = "sehat" | "bunting" | "menyusui" | "sakit" | "anakan";

export const HEALTH_OPTIONS: { id: HealthCondition; label: string; multiplier: number; note: string }[] = [
  { id: "sehat", label: "Sehat", multiplier: 1.0, note: "Pemberian pakan standar." },
  { id: "bunting", label: "Bunting", multiplier: 1.2, note: "Tambah 20% untuk perkembangan janin." },
  { id: "menyusui", label: "Menyusui", multiplier: 1.35, note: "Tambah 35% untuk produksi susu." },
  { id: "sakit", label: "Sakit / Pemulihan", multiplier: 0.85, note: "Kurangi 15%, perbanyak hijauan lembut." },
  { id: "anakan", label: "Anakan / Muda", multiplier: 0.7, note: "70% dari kebutuhan dewasa, tinggi protein." },
];

export type CalcInput = {
  livestockId: string;
  count: number;
  weightKg: number;
  health: HealthCondition;
};

export type CalcResult = {
  perAnimalKg: number;
  totalKg: number;
  hijauanKg: number;
  konsentratKg: number;
  proteinG: number;
  recommendation: string;
};

export function calculateFeed(input: CalcInput): CalcResult | null {
  const ls = LIVESTOCK.find((l) => l.id === input.livestockId);
  const hc = HEALTH_OPTIONS.find((h) => h.id === input.health);
  if (!ls || !hc || input.count <= 0 || input.weightKg <= 0) return null;

  const perAnimalKg = input.weightKg * ls.dailyFeedPct * hc.multiplier;
  const totalKg = perAnimalKg * input.count;
  const hijauanKg = totalKg * ls.hijauanRatio;
  const konsentratKg = totalKg - hijauanKg;
  const proteinG = totalKg * ls.proteinPerKg;

  return {
    perAnimalKg: round(perAnimalKg),
    totalKg: round(totalKg),
    hijauanKg: round(hijauanKg),
    konsentratKg: round(konsentratKg),
    proteinG: Math.round(proteinG),
    recommendation: `${ls.name} dengan kondisi ${hc.label.toLowerCase()}: ${hc.note} Berikan ${round(hijauanKg)} kg hijauan dan ${round(konsentratKg)} kg konsentrat per hari.`,
  };
}

function round(n: number) {
  return Math.round(n * 100) / 100;
}

export type HistoryEntry = {
  id: string;
  date: string;
  livestockName: string;
  count: number;
  weightKg: number;
  health: string;
  totalKg: number;
};

const KEY = "smartfeed-history-v1";

export function loadHistory(): HistoryEntry[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveHistory(entry: HistoryEntry) {
  const list = [entry, ...loadHistory()].slice(0, 20);
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
