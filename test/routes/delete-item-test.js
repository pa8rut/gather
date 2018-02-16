const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:itemId/delete', () => {

    beforeEach(connectDatabaseAndDropData);

    afterEach(diconnectDatabase);

    describe('POST', () => {
        it('deletes item and redirects home', async () => {
            const item = await seedItemToDatabase();
            const itemId = item._id;
            const response = await request(app)
              .post(`/items/${itemId}/delete`)
              .type('form')
    
            assert.equal(response.status, 302);
            assert.equal(response.headers.location, `/`);
            assert.notInclude(parseTextFromHTML(response.text, 'body'), item.description);
          });
    });
});