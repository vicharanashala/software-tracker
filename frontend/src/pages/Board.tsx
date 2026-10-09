import { useState } from 'react';
import { DragDropContext, Draggable, Droppable, type DropResult } from '@hello-pangea/dnd';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { isStuck, sampleItems, type Item } from '@/lib/mock';

const levels = [1, 2, 3] as const;

export function Board() {
  const [items, setItems] = useState<Item[]>(sampleItems);

  function onDragEnd(r: DropResult) {
    if (!r.destination) return;
    const level = Number(r.destination.droppableId) as Item['level'];
    setItems((cur) => cur.map((i) => (i.id === r.draggableId ? { ...i, level, idleDays: 0 } : i)));
  }

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-semibold">Board</h1>
          <p className="text-sm text-muted-foreground">Drag a card to the next level when it moves forward</p>
        </div>
        <Badge variant="outline">Sample data</Badge>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-3 gap-3">
          {levels.map((lvl) => {
            const col = items.filter((i) => i.level === lvl);
            return (
              <Droppable key={lvl} droppableId={String(lvl)}>
                {(prov, snap) => (
                  <div
                    ref={prov.innerRef}
                    {...prov.droppableProps}
                    className={cn('min-h-64 rounded-lg bg-muted/60 p-2', snap.isDraggingOver && 'bg-muted')}
                  >
                    <div className="mb-2 flex justify-between px-1 text-xs text-muted-foreground">
                      <span>Level {lvl}</span>
                      <span>{col.length}</span>
                    </div>
                    {col.map((i, idx) => (
                      <Draggable key={i.id} draggableId={i.id} index={idx}>
                        {(p) => (
                          <div
                            ref={p.innerRef}
                            {...p.draggableProps}
                            {...p.dragHandleProps}
                            className={cn(
                              'mb-2 rounded-lg border bg-card p-3 text-sm',
                              isStuck(i) && 'border-destructive/50',
                              !isStuck(i) && i.blockedBy && 'border-amber-400/60',
                            )}
                          >
                            <div className="font-medium">{i.title}</div>
                            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                              <span>
                                {i.owner} &middot; {i.dept}
                              </span>
                              <span>{i.weight}%</span>
                            </div>
                            {isStuck(i) && <div className="mt-1 text-xs text-destructive">Stuck {i.idleDays} days</div>}
                            {!isStuck(i) && i.blockedBy && (
                              <div className="mt-1 text-xs text-amber-600">Waiting on {i.blockedBy}</div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {prov.placeholder}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
