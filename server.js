const app = require('./app');
const lodash = require('lodash');

//Start our server so that it listens for HTTP requests!
let port = 5000;



app.listen( port, function () {
  console.log("Your app is listening on port " + port);
});
