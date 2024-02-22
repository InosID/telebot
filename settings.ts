import chalk from 'chalk';
import dotenv from 'dotenv';

dotenv.config();

interface Logger {
  connection: {
    start: string;
    error: {
      invalid_token: string;
      conflict: string;
    };
  };
  command: {
    receive: {
      private: string;
      group: string;
    };
  };
}

const LOGGER: Logger = {
  connection: {
    start: chalk.greenBright('Connected as %botname'),
    error: {
      invalid_token: chalk.red('[ERROR]') + ' Your token is not valid.',
      conflict: ""
    }
  },
  command: {
    receive: {
      private: `${chalk.cyan('[PRIVATE]')} ${chalk.green(' %username')} - %cmd`,
      group: `${chalk.cyan('[GROUP]')} ${chalk.blue(' %gcname')}: ${chalk.green(' %username')} - %cmd`
    }
  }
};

export { LOGGER };
