const express = require("express");
const { registerController, loginController } = require("../controllers");
const cektoken = require("../../app/middlewares/cektoken");

const app = express.Router();

app.post("/sendOTP", (req, res) => {
  registerController.sendOTP(req, res);
});
app.post("/verifyOTP", (req, res) => {
  registerController.verifyOTP(req, res);
});
app.post("/logout", cektoken, (req, res) => {
  loginController.logout(req, res);
});

module.exports = app;
