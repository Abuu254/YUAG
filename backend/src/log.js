const fs = require('fs');

function logToFile(message, error = null) {
    let logMessage = `${new Date().toISOString()} - ${message}\n`;

    if (error) {
        logMessage += `Error: ${error.message}\n`;
        logMessage += `Stack Trace: ${error.stack}\n`;
    }

    // Write the log message to the debug.log file
    fs.appendFile('debug.log', logMessage, (err) => {
        if (err) {
            console.error('Failed to write to log file:', err);
        }
    });
}

module.exports = {
    logToFile
};
