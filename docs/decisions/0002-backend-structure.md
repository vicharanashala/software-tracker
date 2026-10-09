# 0002 - Backend structure: one app, split into modules

Date: 2026-10-08

## Background
About 100 people will use this, a small team is building it, and the process rules (who approves what, what counts as stuck, how weightage works) are still being worked out and will keep changing.

## Decision
One backend, one database, one thing to deploy. Inside the backend the code is split into folders by area, and each area owns its own data and routes:

- `identity` - users, roles
- `initiatives` - projects (and goals later)
- `audit` - the history log
- `notifications` - alerts to people

Still to come: work items, planning (estimates and weightage), dependencies, approvals, insights (dashboards).

We are not building separate services. They would add network calls, separate deployments and harder debugging, and none of the problems they solve exist at our size. If one area ever needs to scale or be owned by a separate team, the module boundaries make it easy to pull out later.

## Rules the code follows

1. **Status changes go through their own endpoint.** Nobody edits a status field directly. The endpoint checks that the person is allowed and that the conditions are met (for example, all three leads said yes) before it moves anything.

2. **Save everything about a decision together.** The decision, the new status, the history entry and the notifications to send are written in one transaction.

3. **Send notifications afterwards.** They are saved first and a worker delivers them. If Cliq is down, the approval still stands and the message goes out when it is back.

4. **An approval is tied to what was approved.** If the scope changes after leads said yes, the earlier yes no longer counts and they are asked again.

5. **Keep three things apart.** Where something sits (goal, project, backlog item, task), how far along it is (level), and its workflow status are different questions and get different fields.

6. **Dashboards are calculated from real records.** Nobody types in a percentage.

7. **Integrations stay thin.** Cliq, GitHub and Google Docs are small pieces of code at the edge. The core never depends on them being up.
