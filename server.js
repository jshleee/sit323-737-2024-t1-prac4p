const express = require('express');
const app = express();
const port = 3001;
app.use(express.json());

const winston = require('winston');

  // Create a logger instance
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
      // Console transport for logging to the console
      new winston.transports.Console({
      format: winston.format.simple(),
      }),
      // File transport for logging errors to 'error.log' file
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      // File transport for logging combined logs to 'combined.log' file
      new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// If we're not in production then log to the `console` as well
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
      format: winston.format.simple(),
    }));
  }
  
// Function to check if a value is a valid number
function isValidNumber(value) {
    return !isNaN(value) && isFinite(value);
}

// Define the calculator API endpoints with logging
app.get('/add', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValidNumber(num1) || !isValidNumber(num2)) {
        logger.error('Inputs must be numbers');
        return res.status(400).send({ error: 'Inputs must be numbers' });
    }

    const result = parseFloat(num1) + parseFloat(num2);
    logger.info('add : ${num1} + ${num2} = ${result}');
    res.send({ result: result.toString() });
});

app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValidNumber(num1) || !isValidNumber(num2)) {
        logger.error('Inputs must be numbers');
        return res.status(400).send({ error: 'Inputs must be numbers' });
    }

    const result = parseFloat(num1) - parseFloat(num2);
    logger.info('subtract : ${num1} - ${num2} = ${result}');
    res.send({ result: result.toString() });
});

app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValidNumber(num1) || !isValidNumber(num2)) {
        logger.error('Inputs must be numbers');
        return res.status(400).send({ error: 'Inputs must be numbers' });
    }

    const result = parseFloat(num1) * parseFloat(num2);
    logger.info('multiply : ${num1} * ${num2} = ${result}');
    res.send({ result: result.toString() });
});

app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;
    if (!isValidNumber(num1) || !isValidNumber(num2) || parseFloat(num2) === 0) {
        logger.error('Inputs must be numbers and divide by zero');
        return res.status(400).send({ error: 'Inputs must be numbers and divide by zero'});
    }
    
    const result = parseFloat(num1) / parseFloat(num2);
    logger.info('divide : ${num1} / ${num2} = ${result}');
    res.send({ result: result.toString() });
});

//start server
app.listen(port, () => {
    console.log(`listening : http://localhost:${port}`);
});
