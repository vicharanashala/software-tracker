import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { api, type Note } from '@/lib/api';

export function Notifications() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.notifications().then(setNotes).catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!notes) return <p className="text-sm text-muted-foreground">Loading...</p>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Notifications</h1>
      {notes.length === 0 && <p className="text-sm text-muted-foreground">Nothing yet.</p>}
      <div className="grid gap-2">
        {notes.map((n) => (
          <Card key={n._id} size="sm">
            <CardContent className="text-sm">
              {n.link ? <Link to={n.link} className="font-medium hover:underline">{n.text}</Link> : n.text}
              <div className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
