const express = require("express");
require("dotenv").config();
const taskRoute = require("./routes/task.route");
const db = require("./db/db");
const app = express();
app.use(express.json());
app.use(taskRoute);

db.run().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`server running on port ${process.env.PORT}`);
  });
});
