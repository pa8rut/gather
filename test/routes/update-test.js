const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, seedItemToDatabase} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

describe('Server path: /items/:itemId/update', () => {

    const updatedItem = {title: 'new title', description: 'new description', imageUrl: 'not a real url'};

    beforeEach(connectDatabaseAndDropData);

    afterEach(diconnectDatabase);

    describe('GET', () => {
        it('displays the update page', async () => {
            const item = await seedItemToDatabase();
            const itemId = item._id;
        
            const response = await request(app)
                .get(`/items/${itemId}/update`)
        
            assert.include(parseTextFromHTML(response.text, 'input#title-input'), '');
            assert.include(parseTextFromHTML(response.text, 'textarea#description-input'), '');
            assert.include(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');
        });
    });

    describe('POST', () => {
        it('redirects to item', async () => {
            const item = await seedItemToDatabase();
            const itemId = item._id;
            const itemToCreate = {title: 'title', description: 'description', imageUrl: 'https://placebear.com/900/400'};
            const response = await request(app)
              .post(`/items/${itemId}/update`)
              .type('form')
              .send(itemToCreate);
    
            assert.equal(response.status, 302);
            assert.equal(response.headers.location, `/items/${itemId}`);
          });
    });
});