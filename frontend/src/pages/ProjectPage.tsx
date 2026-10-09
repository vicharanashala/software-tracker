import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api, type HistoryItem, type Project } from '@/lib/api';

export function ProjectPage() {
  const { id } = useParams();
  const [data, setData] = useState<{ project: Project; history: HistoryItem[] } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.project(id!).then(setData).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Loading...</p>;

  const { project: p, history } = data;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{p.title}</h1>
          <p className="text-sm text-muted-foreground">
            Started {new Date(p.startedAt).toLocaleString()} by {p.createdBy}
          </p>
        </div>
        <Badge variant="secondary">{p.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Goal</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{p.goal}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Expected product and features</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">{p.features}</CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Departments</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {p.departments.map((d) => (
              <Badge key={d} variant="outline">{d}</Badge>
            ))}
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Owners</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-1.5">
            {p.owners.map((o) => (
              <Badge key={o} variant="outline">{o}</Badge>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 text-sm">
            {history.map((h) => (
              <li key={h._id}>
                {h.action} by {h.by} <span className="text-muted-foreground">({new Date(h.createdAt).toLocaleString()})</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
