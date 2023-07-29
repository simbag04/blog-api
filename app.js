const express = require('express');
const mongoose = require("mongoose");
require('dotenv').config();

// Set up mongoose connection
mongoose.set("strictQuery", false);

const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}