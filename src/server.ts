import { Server } from "http";
import config from "./config";
import app from "./app";
import prisma from "./shared/prisma";

let server: Server;

async function startServer() {
  server = app.listen(config.port, () => {
    console.log("Server is running on port ", config.port);
  });
}

async function shutdownServer() {
  if (server) {
    console.info("Closing server gracefully...");

    // Close the server and Prisma connections before shutting down
    server.close(() => {
      console.info("Server closed!");

      prisma
        .$disconnect()
        .then(() => {
          console.info("Prisma disconnected");
          process.exit(0); // Gracefully exit
        })
        .catch((error) => {
          console.error("Error disconnecting Prisma: ", error);
          process.exit(1);
        });
    });
  } else {
    process.exit(1); // No server running, exit with an error
  }
}

const restartServer = async () => {
  console.info("Restarting server...");
  await shutdownServer(); // Close the current server first
  await main(); // Restart the main function to initialize the server again
};

async function main() {
  await startServer();

  const exitHandler = async () => {
    await shutdownServer();
  };

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception: ", error);
    exitHandler();
  });

  process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection: ", reason);
    exitHandler();
  });

  // Handling the server shutdown gracefully on SIGTERM and SIGINT
  process.on("SIGTERM", () => {
    console.log("SIGTERM signal received. Shutting down gracefully...");
    exitHandler();
  });

  process.on("SIGINT", () => {
    console.log("SIGINT signal received. Shutting down gracefully...");
    exitHandler();
  });
}

// Starting the server
main();
