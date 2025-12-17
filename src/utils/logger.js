const chalk = require('chalk');

/**
 * Logger tiện ích với màu sắc đẹp
 */
class Logger {
    static info(message) {
        console.log(chalk.blue('[INFO]'), message);
    }

    static success(message) {
        console.log(chalk.green('[SUCCESS]'), message);
    }

    static warn(message) {
        console.log(chalk.yellow('[WARN]'), message);
    }

    static error(message, error = null) {
        console.log(chalk.red('[ERROR]'), message);
        if (error) console.error(error);
    }

    static debug(message) {
        if (process.env.DEBUG === 'true') {
            console.log(chalk.gray('[DEBUG]'), message);
        }
    }

    static command(commandName, user) {
        console.log(
            chalk.cyan('[COMMAND]'),
            `${commandName} được thực hiện bởi ${user}`
        );
    }

    static event(eventName) {
        console.log(chalk.magenta('[EVENT]'), eventName);
    }
}

module.exports = Logger;
