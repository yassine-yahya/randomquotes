const { response } = require("express");
const lodash = require('lodash');
// server.js
// This is where your node app starts

//load the 'express' module which makes writing webservers easy
const express = require("express");
const app = express();
const fs = require('fs')

//load the quotes JSON
const quotes = require("./quotes.json");
const { isUtf8 } = require("buffer");

// Now register handlers for some routes:
//   /                  - Return some helpful welcome info (text)
//   /quotes            - Should return all quotes (json)
//   /quotes/random     - Should return ONE quote (json)
app.get("/", function (request, response) {
  response.send("Ali's Quote Server!  Ask me for /quotes/random, or /quotes");
});

//START OF YOUR CODE...
app.get('/quotes',(req, res)=>{
  fs.readFile('quotes.js', 'utf8',(err, data)=>{
    if(err){
      console.error('error to read data', err);
      return res.status(500).send('Error reading quotes file')
    } 
    res.send(data)
  })
})

app.get('/quotes/random', (req, res) =>{
  fs.readFile('quotes.json', 'utf8',(err, data)=>{
    if (err){
      console.error('error to get random quote', err);
      res.status(500).send('error to get random quotes')
    } 
    const quotesArray = JSON.parse(data)
    const randomQuote = lodash.sample(quotesArray)

    res.send(randomQuote) 

  })
})

app.get('/quotes/search', (req, res) => {
  const term = req.query.term;
  if (!term) {
    res.status(400).send('No data found for the term in search');
    return;
  }

    fs.readFile('quotes.json', 'utf8', (err, data)=>{
      if(err){
        console.error('Error reading JSON file:', err);
        res.status(500).send('error to find corresponsing data...')
        return;
      }

      try{
        const quotesArray = JSON.parse(data)
        const matchedQuotes = quotesArray.find(item => item.quote.toLowerCase().includes(term.toLowerCase()));

        if(matchedQuotes){
          res.send(matchedQuotes)
        }else {
          res.status(404).send('no match result')
        }
      } catch(error) {
          console.error('Error parsing JSON:', error);
          res.status(500).send('Error parsing JSON');
      }
    });
  });
  
  

  

//...END OF YOUR CODE

//You can use this function to pick one element at random from a given array
//example: pickFromArray([1,2,3,4]), or
//example: pickFromArray(myContactsArray)
//
function pickFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


module.exports = app;