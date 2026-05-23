# GigFlow — Demo Guide

Use this for your **2-minute screen recording** or when your friend browses the repo.

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `demo.admin@gigflow.com` | `Demo123!` |
| **Sales** | `demo.sales@gigflow.com` | `Demo123!` |

- **Admin** sees all 20 leads, can delete, and export CSV.
- **Sales** sees only their 8 leads (no delete, no export).

## Datasets

Sample data lives in the [`datasets/`](./datasets/) folder:

| File | Contents |
|------|----------|
| [`demo-users.json`](./datasets/demo-users.json) | Admin + sales accounts |
| [`leads.json`](./datasets/leads.json) | 20 sample leads (12 admin-owned, 8 sales-owned) |

## Load / refresh demo data

From the project root:

```bash
cd backend
npm run seed
```

Then start the app (`npm run dev` in `backend` and `frontend`) and open http://localhost:5173.

## Quick recording flow (~2 min)

1. Log in as **Admin** → show full table, filters, pagination (2 pages).
2. Search **rahul**, filter by status/source, add a lead, open detail modal.
3. Click **Export** (CSV).
4. Log out → log in as **Sales** → show fewer leads, no export/delete.
