import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';

const DEPARTMENTS = ['AI', 'Development', 'Operations'];

export function NewProject() {
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [goal, setGoal] = useState('');
  const [features, setFeatures] = useState('');
  const [owners, setOwners] = useState('');
  const [departments, setDepartments] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  function toggle(d: string, on: boolean) {
    setDepartments((cur) => (on ? [...cur, d] : cur.filter((x) => x !== d)));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const list = owners.split(/[,\s]+/).filter(Boolean);
    if (list.length === 0) return setError('Tag at least one owner');
    if (departments.length === 0) return setError('Pick at least one department');

    setBusy(true);
    try {
      const p = await api.createProject({ title, goal, features, owners: list, departments });
      nav('/projects/' + p._id);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>New project</CardTitle>
        <CardDescription>The start date and time are set automatically when you submit.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required minLength={3} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="goal">Goal (why are we doing this)</Label>
            <Textarea id="goal" value={goal} onChange={(e) => setGoal(e.target.value)} required minLength={10} rows={3} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="features">Expected product and features</Label>
            <Textarea id="features" value={features} onChange={(e) => setFeatures(e.target.value)} required minLength={10} rows={4} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="owners">Tag owners (emails, separated by commas)</Label>
            <Input id="owners" value={owners} onChange={(e) => setOwners(e.target.value)} placeholder="bhavna@annam.ai, aryan@annam.ai" />
          </div>
          <div className="grid gap-2">
            <Label>Department</Label>
            <div className="flex gap-5">
              {DEPARTMENTS.map((d) => (
                <label key={d} className="flex items-center gap-2 text-sm">
                  <Checkbox checked={departments.includes(d)} onCheckedChange={(v) => toggle(d, v === true)} />
                  {d}
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div>
            <Button type="submit" disabled={busy}>
              {busy ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
