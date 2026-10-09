// sample data for the dashboard and board until work items exist in the backend
export type Dept = 'AI' | 'Development' | 'Operations';

export type Item = {
  id: string;
  title: string;
  owner: string;
  dept: Dept;
  weight: number; // % of the whole project
  progress: number; // 0 to 100
  level: 1 | 2 | 3;
  idleDays: number;
  blockedBy?: string;
};

export const STUCK_AFTER_DAYS = 7;

export const sampleItems: Item[] = [
  { id: 'a1', title: 'Telugu voice model', owner: 'Aryan', dept: 'AI', weight: 10, progress: 80, level: 1, idleDays: 1 },
  { id: 'a2', title: 'Intent routing', owner: 'Srihari', dept: 'Development', weight: 8, progress: 40, level: 2, idleDays: 5, blockedBy: 'Aryan' },
  { id: 'a3', title: 'Retrieval tuning', owner: 'Paul', dept: 'AI', weight: 12, progress: 65, level: 2, idleDays: 2 },
  { id: 'd1', title: 'IVR call flow', owner: 'Srihari', dept: 'Development', weight: 12, progress: 70, level: 2, idleDays: 1 },
  { id: 'd2', title: 'Query schema', owner: 'Ganesh', dept: 'Development', weight: 6, progress: 100, level: 3, idleDays: 0 },
  { id: 'd3', title: 'Server setup (6 servers)', owner: 'Ganesh', dept: 'Development', weight: 9, progress: 55, level: 1, idleDays: 3 },
  { id: 'o1', title: 'BSNL line setup', owner: 'Rajan', dept: 'Operations', weight: 10, progress: 10, level: 1, idleDays: 9, blockedBy: 'BSNL' },
  { id: 'o2', title: 'Field officer training', owner: 'Sudarshan', dept: 'Operations', weight: 7, progress: 0, level: 1, idleDays: 8 },
  { id: 'o3', title: 'Field testing', owner: 'QA team', dept: 'Operations', weight: 8, progress: 0, level: 3, idleDays: 2, blockedBy: 'Ganesh' },
  { id: 'a4', title: 'Answer quality checks', owner: 'Aryan', dept: 'AI', weight: 18, progress: 50, level: 3, idleDays: 4 },
];

export function overallProgress(items: Item[]) {
  const total = items.reduce((s, i) => s + i.weight, 0);
  const done = items.reduce((s, i) => s + i.weight * (i.progress / 100), 0);
  return total ? Math.round((done / total) * 100) : 0;
}

export function byDepartment(items: Item[]) {
  const depts: Dept[] = ['AI', 'Development', 'Operations'];
  return depts.map((d) => {
    const list = items.filter((i) => i.dept === d);
    return { dept: d, weight: list.reduce((s, i) => s + i.weight, 0), progress: overallProgress(list) };
  });
}

export const isStuck = (i: Item) => i.idleDays >= STUCK_AFTER_DAYS;
