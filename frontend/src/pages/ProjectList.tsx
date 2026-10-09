import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { api, type Project } from '@/lib/api';

export function ProjectList() {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.projects().then(setProjects).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!projects) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Projects</h1>
      {projects.length === 0 && <p className="text-sm text-muted-foreground">No projects yet.</p>}
      <div className="grid gap-2">
        {projects.map((p) => (
          <Link key={p._id} to={'/projects/' + p._id}>
            <Card size="sm" className="transition-colors hover:bg-muted/50">
              <CardContent className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p.departments.join(', ')} &middot; owners: {p.owners.join(', ')}
                  </div>
                </div>
                <Badge variant="secondary">{p.status}</Badge>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
