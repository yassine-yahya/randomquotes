const request = require('supertest');
const app = require('./app');
const fs = require('fs');

describe('Test the / route', () => {
  test('It should return the status code 200', async () => {
    const response = await request(app).get('/quotes');
    expect(response.statusCode).toBe(200);
  });
});

describe('Test the /quotes route', () => {
  test('It should return the contents of the quotes.json file', async () => {
    const expectedResult = JSON.parse(fs.readFileSync(__dirname + '/quotes.json', 'utf8'));

    const response = await request(app).get('/quotes');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(expectedResult);
  });
});

describe('Test /quotes/random route', () => {
  test('It should return a random element from the quotes.json array', async () => {
    const response = await request(app).get('/quotes/random');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Object);

    // Load the quotes.json file
    const quotes = require('./quotes.json');
    // Check that the returned object is in the quotes array
    expect(quotes).toContainEqual(response.body);
    // Send other requests to the /quotes/random route
    const response2 = await request(app).get('/quotes/random');
    const response3 = await request(app).get('/quotes/random');
    const response4 = await request(app).get('/quotes/random');
    // Check that one of the returned objects is not the same as the first one
    expect(response.body).not.toEqual(response2.body || response3.body || response4.body);
  });
});

describe('Test /quotes/search route', () => {
  test('It should return all quotes containing the search term in the "quote" key', async () => {
    // Send a request to the /quotes/search route with the "term" query parameter set to "life"
    const response = await request(app).get('/quotes/search?term=life');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeDefined();
    expect(response.body).toBeInstanceOf(Array);

    // Check that all returned quotes contain the search term in the "quote" key
    response.body.forEach((quote) => {
      expect(quote.quote.toLowerCase()).toContain('life');
   	});     
	// Send a request to the /quotes/search route with a search term that does not exist in any quotes
    const response2 = await request(app).get('/quotes/search?term=xyz');
    expect(response2.statusCode).toBe(200);
    expect(response2.body).toBeDefined();
    expect(response2.body).toBeInstanceOf(Array);
    expect(response2.body).toHaveLength(0);
	});
});