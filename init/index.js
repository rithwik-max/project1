const mongoose = require("mongoose");
const initData = require("./data.js"); // Ensure path is correct
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("connected to DB");
}).catch(err => {
    console.log(err);
});

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yourDatabaseName');
}

const initDB = async () => {
  await Listing.deleteMany({}); // This clears the broken data
  await Listing.insertMany(initData.data); // This inserts the clean data
  console.log("data was initialized");
};

initDB();