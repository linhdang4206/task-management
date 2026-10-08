const express = require("express");
require("dotenv").config();

const cors = require('cors')
const cookieParser = require('cookie-parser');

const database = require("./config/database");
const routesApi = require("./router/index.route");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use(async (req, res, next) => {
  try {
    await database.connect();
    next();
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    res.status(503).json({
      code: 503,
      message: "Không thể kết nối cơ sở dữ liệu"
    });
  }
});

routesApi(app);

if (require.main === module) {
  database.connect()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
      });
    })
    .catch((error) => {
      console.error("Server startup failed:", error);
      process.exitCode = 1;
    });
}

module.exports = app;