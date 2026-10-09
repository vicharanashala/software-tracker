import { AlertTriangle, CalendarClock, CheckCircle2, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { byDepartment, isStuck, overallProgress, sampleItems as items } from '@/lib/mock';

function Stat({ label, value, note, icon: Icon }: { label: string; value: string; note: string; icon: typeof TrendingUp }) {
  return (
    <Card size="sm">
      <CardContent>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {label}
          <Icon className="size-4" />
        </div>
        <div className="mt-1 text-2xl font-semibold">{value}</div>
        <div className="text-xs text-muted-foreground">{note}</div>
      </CardContent>
    </Card>
  );
}

export function Dashboard() {
  const stuck = items.filter(isStuck);
  const waiting = items.filter((i) => i.blockedBy || isStuck(i)).sort((a, b) => b.idleDays - a.idleDays);
  const onTrack = items.length - waiting.length;

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">Voice agent v1</h1>
          <p className="text-sm text-muted-foreground">Where we are against the goal</p>
        </div>
        <Badge variant="outline">Sample data</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Progress" value={overallProgress(items) + '%'} note="weighted by item weightage" icon={TrendingUp} />
        <Stat label="On track" value={String(onTrack)} note={'of ' + items.length + ' items'} icon={CheckCircle2} />
        <Stat label="Stuck" value={String(stuck.length)} note="no movement for 7+ days" icon={AlertTriangle} />
        <Stat label="Forecast end" value="12 Dec" note="4 days after target" icon={CalendarClock} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Needs attention</CardTitle>
          <CardDescription>Someone is waiting, or nothing has moved</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Waiting on</TableHead>
                <TableHead className="text-right">Idle</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {waiting.map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="font-medium">{i.title}</TableCell>
                  <TableCell>{i.owner}</TableCell>
                  <TableCell>{i.blockedBy ? <Badge variant="outline">{i.blockedBy}</Badge> : <span className="text-muted-foreground">-</span>}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={isStuck(i) ? 'destructive' : 'secondary'}>{i.idleDays} days</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Progress by department</CardTitle>
          <CardDescription>Each department's share of the project and how much of it is done</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          {byDepartment(items).map((d) => (
            <div key={d.dept} className="grid gap-1.5">
              <div className="flex justify-between text-sm">
                <span>{d.dept}</span>
                <span className="text-muted-foreground">
                  {d.progress}% done &middot; {d.weight}% of project
                </span>
              </div>
              <Progress value={d.progress} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
