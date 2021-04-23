import log4js from 'log4js';

function getConfigObject() {
  return {
    appenders: {
      output: {
        type: 'console',
      },
    },
    categories: {
      default: { appenders: ['output'], level: 'debug', enableCallStack: true },
    },
  };
}

function getLogger() {
  const configurationObject = getConfigObject();
  log4js.configure(configurationObject);
  const loggerObject = log4js.getLogger();
  return loggerObject;
}

export default getLogger;
