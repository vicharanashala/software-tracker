import { useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Bell, FolderKanban, KanbanSquare, LayoutDashboard, LogOut, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMe, setMe, type Me } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { Board } from '@/pages/Board';
import { ProjectList } from '@/pages/ProjectList';
import { NewProject } from '@/pages/NewProject';
import { ProjectPage } from '@/pages/ProjectPage';
import { Notifications } from '@/pages/Notifications';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/board', label: 'Board', icon: KanbanSquare },
  { to: '/projects', label: 'Projects', icon: FolderKanban },
  { to: '/notifications', label: 'Notifications', icon: Bell },
];

export function App() {
  const [me, setMeState] = useState<Me | null>(getMe());
  const nav = useNavigate();

  function login(m: Me) {
    setMe(m);
    setMeState(m);
    nav('/');
  }

  function logout() {
    setMe(null);
    setMeState(null);
    nav('/login');
  }

  if (!me) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  const canCreate = me.role === 'leader' || me.role === 'admin';

  return (
    <div className="flex min-h-screen">
      <aside className="flex w-56 shrink-0 flex-col border-r bg-sidebar p-3">
        <div className="px-2 py-3 text-sm font-semibold">Software Tracker</div>
        <nav className="mt-2 flex flex-col gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted',
                  isActive && 'bg-muted font-medium text-foreground',
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto space-y-2 border-t pt-3">
          <div className="px-2 text-xs text-muted-foreground">
            <div className="truncate">{me.email}</div>
            <div>{me.role}</div>
          </div>
          <Button variant="ghost" size="sm" className="w-full justify-start" onClick={logout}>
            <LogOut /> Log out
          </Button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex h-14 items-center justify-end border-b px-6">
          {canCreate && (
            <Button size="sm" onClick={() => nav('/new')}>
              <Plus /> New project
            </Button>
          )}
        </header>
        <main className="mx-auto max-w-5xl p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/board" element={<Board />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/new" element={canCreate ? <NewProject /> : <Navigate to="/projects" />} />
            <Route path="/projects/:id" element={<ProjectPage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
