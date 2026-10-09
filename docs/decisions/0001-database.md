# 0001 - Database: MongoDB

Date: 2026-10-08

## Background
The tracker has to store projects, backlog items, tasks, who is blocked on whom, approvals and a history of every change. The team already knows MongoDB and runs it elsewhere, so that is what we are going with.

## Why this needed a decision at all
Our data is more connected than a typical Mongo use case. A project has backlog items, items have tasks, tasks depend on other people's tasks, and the dashboard has to add all of that up (weightage, hours, what is stuck). A SQL database would handle that a bit more naturally. We are accepting that in exchange for using something the team can support without learning a new database.

## What we do about it

**Saving things together.** When a lead approves something, three things must happen at once: the approval is saved, the status changes, and a history entry is written. If one of them fails the other two must not stay behind. Mongo can do this with transactions, but only when it runs as a replica set. That is why docker-compose starts Mongo as a one-node replica set, and why production must be a replica set too (Atlas does this by default).

**Embed or reference.** Things that only make sense inside their parent (comments on a task, a checklist) go inside the parent document. Things that are shared or searched on their own (users, tasks, dependencies, approvals) get their own collection and point to each other by id. We are not nesting deeply, since a task buried three levels down is hard to query and update.

**Structure.** Mongo accepts anything, so the app does the checking with zod on the way in and mongoose schemas on the way out.

**History.** The audit log is write-once. The app never updates or deletes from it. When we set up production the database user the app connects with should not be allowed to either.

**Dashboard speed.** At around 100 users, plain queries are fine. We do not store precomputed totals up front. If a dashboard turns out slow once there is real data, then we add them.

## When to revisit
If the dashboard queries get painful to write or slow even after indexing, or if we keep working around the lack of joins, it is worth looking at Postgres again before the data grows.
