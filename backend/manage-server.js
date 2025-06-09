#!/usr/bin/env node

import { exec } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Constants
const PID_FILE = path.join(__dirname, ".pid");
const LOG_FILE = path.join(__dirname, "server.log");
const COMMAND = {
  development: "npm run dev",
  production: "npm start",
};

// Check if we're in a production environment
const isProduction = process.env.NODE_ENV === "production";

// Helper functions
const log = (message) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} - ${message}`);
};

const getPid = () => {
  try {
    return fs.existsSync(PID_FILE)
      ? parseInt(fs.readFileSync(PID_FILE, "utf8").trim(), 10)
      : null;
  } catch (error) {
    return null;
  }
};

const savePid = (pid) => {
  fs.writeFileSync(PID_FILE, pid.toString());
};

const isProcessRunning = (pid) => {
  try {
    return process.kill(pid, 0);
  } catch (error) {
    return error.code === "EPERM";
  }
};

const killProcess = (pid) => {
  return new Promise((resolve, reject) => {
    try {
      process.kill(pid, "SIGTERM");
      // Check if process is still running
      const checkInterval = setInterval(() => {
        try {
          process.kill(pid, 0);
          // Process still running, try SIGKILL after 5 seconds
          setTimeout(() => {
            try {
              process.kill(pid, "SIGKILL");
            } catch (e) {
              // Process may already be gone
            }
          }, 5000);
        } catch (error) {
          // Process not running anymore
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 100);
    } catch (error) {
      if (error.code === "ESRCH") {
        // Process doesn't exist
        resolve(false);
      } else {
        reject(error);
      }
    }
  });
};

// Command handlers
const start = () => {
  const existingPid = getPid();

  if (existingPid && isProcessRunning(existingPid)) {
    log(`Server already running with PID ${existingPid}`);
    return;
  }

  log("Starting server...");

  // Create log file if it doesn't exist
  if (!fs.existsSync(path.dirname(LOG_FILE))) {
    fs.mkdirSync(path.dirname(LOG_FILE), { recursive: true });
  }

  // Start the server
  const out = fs.openSync(LOG_FILE, "a");
  const err = fs.openSync(LOG_FILE, "a");

  const child = exec(
    COMMAND[isProduction ? "production" : "development"],
    {
      detached: true,
      stdio: ["ignore", out, err],
    }
  );

  // Save the process ID
  savePid(child.pid);

  log(`Server started with PID ${child.pid}`);

  // Detach the process
  child.unref();
};

const stop = async () => {
  const pid = getPid();

  if (!pid) {
    log("No server running");
    return;
  }

  log(`Stopping server with PID ${pid}...`);

  try {
    await killProcess(pid);
    fs.unlinkSync(PID_FILE);
    log("Server stopped");
  } catch (error) {
    log(`Error stopping server: ${error.message}`);
    process.exit(1);
  }
};

const restart = async () => {
  await stop();
  // Wait a bit to ensure all resources are freed
  setTimeout(() => {
    start();
  }, 1000);
};

const status = () => {
  const pid = getPid();

  if (!pid) {
    log("Server is not running");
    return;
  }

  const running = isProcessRunning(pid);
  log(`Server ${running ? "is" : "is not"} running with PID ${pid}`);
};

const displayLogs = (lines = 10) => {
  if (!fs.existsSync(LOG_FILE)) {
    log("No log file found");
    return;
  }

  const command =
    process.platform === "win32"
      ? `type ${LOG_FILE} | tail -n ${lines}`
      : `tail -n ${lines} ${LOG_FILE}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      log(`Error reading logs: ${error.message}`);
      return;
    }

    console.log(stdout);
  });
};

// Main execution
const command = process.argv[2];

switch (command) {
  case "start":
    start();
    break;
  case "stop":
    stop();
    break;
  case "restart":
    restart();
    break;
  case "status":
    status();
    break;
  case "logs":
    const lines = process.argv[3]
      ? parseInt(process.argv[3], 10)
      : 10;
    displayLogs(lines);
    break;
  default:
    log(`
Usage: node manage-server.js [command]

Commands:
  start    Start the server
  stop     Stop the server
  restart  Restart the server
  status   Check server status
  logs [n] Display the last n lines of logs (default: 10)
`);
}
