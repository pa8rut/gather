const {assert} = require('chai');
const request = require('supertest');

const app = require('../../app');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:itemId', () => {
  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your test blocks below:
  it('displays the item selected', async () => {
    const item = await seedItemToDatabase();
    const itemId = item._id;

    const response = await request(app)
          .get(`/items/${itemId}`)  //:itemId
          .send(item);

          assert.include(parseTextFromHTML(response.text, '#item-title'), item.title);
          assert.include(parseTextFromHTML(response.text, '#item-description'), item.description);
  });
  
});
