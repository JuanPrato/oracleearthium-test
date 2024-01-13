## Work made with nodejs and mySql

### TECHNOLOGIES USED

- Express
- Discord.js
- MySql
- Drizzle

Secrets specify on .env.example, are required.

If you want to start on developer mode:

1. npm i
2. npm run db:push
3. npm run dev

Keep in mind that the database needs to be active and working

COMMANDS:

- config:
  It can only be used by the owner of the server, you can specify a role so that they are taken into account to track cryptocurrencies

- leaderboard:
  Shows the guild leaderboard and you can specify a cryto to see specifically that one.

- bet:
  You can bet on a price for the cryptocurrency for the next day at 00 hours.
  The closest receives 5 points, the 2nd 3 and the 3rd 1 point.
