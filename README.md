# Zootopia Zoo

COSC 3380 Section 17184, Team 1

Zoo database web app. Staff manage the animals, enclosures, employees, shops, etc. and make sales. Customers can sign up, buy tickets and order from the online shop.

Live site: https://zootopia-frontend-dvcmbzc2dhcgc5ht.westcentralus-01.azurewebsites.net

## Logins

Password for all of them is `pass123`. Everyone uses the same Log in page.

- Manager: `morgan`
- Zookeeper: `alex`
- Cashier: `quinn`
- Customer: `ava`

## Files

- `database/` - the SQL files (tables, triggers, views, sample data)
- `backend/` - Node API, each part of the app has its own file in `routes/`
- `frontend/` - React app, pages are in `src/pages/`
- `.env_example` - template for the database login info

## Running it locally

You need Node.js and MySQL installed.

1. Clone the repo

```
git clone https://github.com/RamRiv/cosc3380-team-project-zootopia.git
```

2. In MySQL Workbench, run these from the `database` folder in this order:
   `final_zoo_db.sql`, `triggers.sql`, `views.sql`, `seed_data.sql`

   (or import our SQL dump instead)

3. Copy `.env_example` into the `backend` folder, rename it to `.env` and put your MySQL password in it

4. Start the backend

```
cd backend
npm install
node server.js
```

5. In a second terminal, start the frontend

```
cd frontend
npm install
npm run dev
```

6. Go to http://localhost:5173

Both terminals need to stay open.
