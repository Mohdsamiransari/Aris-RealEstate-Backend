const mongoose = require("mongoose");

const connectDatabase = () => {
  mongoose.connect(process.env.DB_LOCAL_URI, {}).then((connect) => {
    console.log(`Connect to database ${connect.connection.host}`);
  });
};

module.exports = connectDatabase;
