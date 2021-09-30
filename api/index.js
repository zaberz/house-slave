/**
 * vercel function entry
 * */
require("dotenv").config();

const express = require("express");
const db = require("./model/index");
const router = require("./router/index");
const wxapp = require('./router/wxapp')
let app = express();
app.get("/api", (req, res) => {
  res.json({
    a: 1
  });
});

app.use("/api/crawl", router);
app.use("/api/wxapp", wxapp);

app.listen(9000);
