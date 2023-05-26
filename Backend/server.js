const app = require("./app");
const connectDatabase = require("./config/database");
const dotenv = require("dotenv");

// Handle Uncaught Promise Rejection
process.on("uncaughtRejection", (err) => {
  console.log(`Error: ${err.stack}`);
  console.log("Shutting downt the server due to uncaught rejection");

  server.close(() => {
    process.exit(1);
  });
});

dotenv.config({ path: "Backend/config/config.env" });
connectDatabase();
const server = app.listen(process.env.PORT, () => {
  console.log(
    `Server is running at ${process.env.PORT} on ${process.env.NODE_ENV} mode.`
  );
});

// Handle unhandled promise rejection

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down the server");

  server.close(() => {
    process.exit(1);
  });
});
