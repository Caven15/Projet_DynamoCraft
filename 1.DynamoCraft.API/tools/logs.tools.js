const COLOR_RESET = "\x1b[0m";
const COLOR_GREEN = "\x1b[32m";
const COLOR_RED = "\x1b[31m";
const COLOR_YELLOW = "\x1b[33m";

let length = 0;

const generateLine = (length) => "-".repeat(length);

const logMessage = (message, color = COLOR_RESET) => {
    const coloredMessage = `${color}${message}${COLOR_RESET}`;
    const line = generateLine(message.length);

    console.log(`${color}${line}${COLOR_RESET}`);
    console.log(coloredMessage);
    console.log(`${color}${line}${COLOR_RESET}`);
};

const logSQLQuery = (description, sql) => {
    console.log(
        `${COLOR_RESET}${description}${COLOR_GREEN}${sql}${COLOR_RESET}`
    );
};

module.exports = {
    logMessage,
    logSQLQuery,
    COLOR_GREEN,
    COLOR_RED,
    COLOR_YELLOW,
};
