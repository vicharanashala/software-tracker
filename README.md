# software-tracker

Internal tool for ANNAM.AI to track a project from the leadership idea to delivery. Leader creates a project, tags owners and departments, the leads agree it is doable, then the backlog, estimates and dependencies get filled in and a dashboard shows what is stuck.

Early stage. Only the first step (create project and tag people) exists so far.

## Stack
Node + TypeScript, Express, MongoDB, React for the frontend (not started).

## Running it
```bash
cp .env.example .env
docker compose up -d
cd backend
npm install
npm run dev
```

In a second terminal, for the web page:
```bash
cd frontend
npm install
npm run dev
```
Then open http://localhost:5173 and sign in with any email, picking the role "leader" if you want to create projects.

Login is fake for now, you just pass your email in a header:
```bash
curl -X POST localhost:4000/projects \
  -H "content-type: application/json" \
  -H "x-user-email: leader@annam.ai" -H "x-user-roles: leader" \
  -d '{"title":"Voice agent","goal":"Farmers get answers over a phone call","features":"IVR, Hindi and Telugu voice","owners":["bhavna@annam.ai","aryan@annam.ai"],"departments":["AI","Operations"]}'

curl localhost:4000/notifications -H "x-user-email: bhavna@annam.ai"
```

## Notes
- Mongo runs as a replica set because we use transactions.
- Don't commit .env or any real data.
- Meeting notes go in docs/, but not raw transcripts.
