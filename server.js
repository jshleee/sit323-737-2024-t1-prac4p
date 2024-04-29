const express = require('express');
const app = express();
const port = 3001;
app.use(express.json());

const winston = require('winston');

  // Create a logger instance
  //Configure logging levels, output formats, and destinations
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

// Additional console logging in non-production environments
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
//Each endpoint retrieves numbers from the query parameters, validates them, performs the arithmetic operation, logs the operation details, and returns the result. If the inputs are invalid, it logs an error and sends a corresponding response.


//performs the addition of two numbers provided as query parameters num1 and num2
  app.get('/add', (req, res) => {
    ////Extracts num1 and num2 from the query string.
    const { num1, num2 } = req.query; 
    //Validates that both parameters are valid numbers using the isValidNumber function.
    if (!isValidNumber(num1) || !isValidNumber(num2)) {
        logger.error('Inputs must be numbers');
        return res.status(400).send({ error: 'Inputs must be numbers' }); //If either parameter is not a valid number, logs an error and returns a 400 Bad Request response with an error message.
    } 
  //If valid, converts the strings to floats and adds them.
  //Logs the operation details using Winston.
    const result = parseFloat(num1) + parseFloat(num2);
    logger.info('add : ${num1} + ${num2} = ${result}');
    res.send({ result: result.toString() }); //Sends back the result of the addition.
});

//the subtraction of two numbers.
app.get('/subtract', (req, res) => {
    const { num1, num2 } = req.query; //Retrieves num1 and num2 from the query parameters.
    if (!isValidNumber(num1) || !isValidNumber(num2)) { //Validates both numbers.
        logger.error('Inputs must be numbers');
        return res.status(400).send({ error: 'Inputs must be numbers' }); //If any number is invalid, logs the error and sends a 400 Bad Request response.
    }

    const result = parseFloat(num1) - parseFloat(num2);
    logger.info('subtract : ${num1} - ${num2} = ${result}'); //If valid, performs the subtraction and logs the operation.
    res.send({ result: result.toString() }); //Returns the result as a string.
});

//multiplies two numbers.
app.get('/multiply', (req, res) => {
    const { num1, num2 } = req.query; //Parses and validates the input numbers.
    if (!isValidNumber(num1) || !isValidNumber(num2)) { 
        logger.error('Inputs must be numbers');
        return res.status(400).send({ error: 'Inputs must be numbers' });//If validation fails, returns an error response and logs the issue.
    }
    //If valid, multiplies the numbers, logs the transaction, and returns the product.
    const result = parseFloat(num1) * parseFloat(num2);
    logger.info('multiply : ${num1} * ${num2} = ${result}');
    res.send({ result: result.toString() });
});

// Performs division of num1 by num2
app.get('/divide', (req, res) => {
    const { num1, num2 } = req.query;//Retrieves and validates the input values.
    if (!isValidNumber(num1) || !isValidNumber(num2) || parseFloat(num2) === 0) { //Checks if num2 is zero (to avoid division by zero).
        logger.error('Inputs must be numbers and divide by zero'); //If any validation fails, logs the error and returns a relevant error response.
        return res.status(400).send({ error: 'Inputs must be numbers and divide by zero'});
    }

  //If valid, divides the numbers, logs the operation, and returns the quotient.
    const result = parseFloat(num1) / parseFloat(num2);
    logger.info('divide : ${num1} / ${num2} = ${result}');
    res.send({ result: result.toString() });
});

//start server
app.listen(port, () => {
    console.log(`listening : http://localhost:${port}`);
});
