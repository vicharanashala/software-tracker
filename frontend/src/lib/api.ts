export type Me = { email: string; role: string };

export type Project = {
  _id: string;
  title: string;
  goal: string;
  features: string;
  createdBy: string;
  owners: string[];
  departments: string[];
  status: string;
  startedAt: string;
};

export type HistoryItem = { _id: string; action: string; by: string; createdAt: string };
export type Note = { _id: string; text: string; link?: string; createdAt: string };

const KEY = 'tracker.me';

export function getMe(): Me | null {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null');
  } catch {
    return null;
  }
}

export function setMe(me: Me | null) {
  if (me) localStorage.setItem(KEY, JSON.stringify(me));
  else localStorage.removeItem(KEY);
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  const me = getMe();
  const res = await fetch('/api' + path, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-user-email': me?.email || '',
      'x-user-roles': me?.role || '',
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const e = body.error;
    throw new Error(typeof e === 'string' ? e : 'request failed (' + res.status + ')');
  }
  return body as T;
}

export const api = {
  projects: () => call<Project[]>('/projects'),
  project: (id: string) => call<{ project: Project; history: HistoryItem[] }>('/projects/' + id),
  createProject: (data: unknown) => call<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  notifications: () => call<Note[]>('/notifications'),
};
