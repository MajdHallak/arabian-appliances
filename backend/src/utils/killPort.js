import { exec } from "child_process";
import logger from "../config/logger.js";

/**
 * Find and kill the process that is using a specific port
 * @param {number} port - The port to free up
 * @returns {Promise<boolean>} - Whether the operation was successful
 */
const killProcessAtPort = (port) => {
  return new Promise((resolve) => {
    // Command to find process ID using the port
    const findCommand =
      process.platform === "win32"
        ? `netstat -ano | findstr :${port}`
        : `lsof -i :${port} | grep LISTEN`;

    exec(findCommand, (error, stdout, stderr) => {
      if (error || stderr || !stdout) {
        logger.info(`No process found using port ${port}`);
        resolve(false);
        return;
      }

      try {
        // Extract process ID based on platform
        let pid;
        if (process.platform === "win32") {
          // Windows: Get the last column which has the PID
          pid = stdout.split("\n")[0].trim().split(/\s+/).pop();
        } else {
          // Unix/Mac: Get the second column which has the PID
          pid = stdout.split("\n")[0].trim().split(/\s+/)[1];
        }

        if (!pid) {
          logger.info(`No process found using port ${port}`);
          resolve(false);
          return;
        }

        // Command to kill the process
        const killCommand =
          process.platform === "win32"
            ? `taskkill /F /PID ${pid}`
            : `kill -9 ${pid}`;

        exec(killCommand, (killError) => {
          if (killError) {
            logger.error(
              `Failed to kill process ${pid}: ${killError.message}`
            );
            resolve(false);
            return;
          }

          logger.info(
            `Successfully killed process ${pid} using port ${port}`
          );
          resolve(true);
        });
      } catch (err) {
        logger.error(
          `Error processing port kill command: ${err.message}`
        );
        resolve(false);
      }
    });
  });
};

export default killProcessAtPort;
