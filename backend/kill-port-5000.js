#!/usr/bin/env node

import { exec } from "child_process";

const PORT = 5000;

console.log(`Attempting to kill process on port ${PORT}...`);

// Command to check for process on this port
const findCommand =
  process.platform === "win32"
    ? `netstat -ano | findstr :${PORT}`
    : `lsof -i :${PORT}`;

exec(findCommand, (error, stdout, stderr) => {
  if (error || stderr || !stdout.trim()) {
    console.log(`No process found using port ${PORT}`);
    return;
  }

  console.log(`Found process using port ${PORT}:`);
  console.log(stdout);

  // For macOS/Linux
  if (process.platform !== "win32") {
    const killCommand = `kill -9 $(lsof -ti:${PORT})`;
    exec(killCommand, (killError, killStdout, killStderr) => {
      if (killError) {
        console.error(`Failed to kill process: ${killError.message}`);
        console.error(killStderr);
        return;
      }
      console.log(`Successfully killed process using port ${PORT}`);
    });
  }
  // For Windows
  else {
    // Extract PID from netstat output
    const pidMatch = stdout.match(/\s+(\d+)$/m);
    if (pidMatch && pidMatch[1]) {
      const pid = pidMatch[1];
      const killCommand = `taskkill /F /PID ${pid}`;

      exec(killCommand, (killError, killStdout, killStderr) => {
        if (killError) {
          console.error(
            `Failed to kill process with PID ${pid}: ${killError.message}`
          );
          return;
        }
        console.log(
          `Successfully killed process with PID ${pid} using port ${PORT}`
        );
      });
    } else {
      console.error("Could not determine PID from netstat output");
    }
  }
});
