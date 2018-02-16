const {assert} = require('chai');
const request = require('supertest');
const {jsdom} = require('jsdom');

const app = require('../../app');
const Item = require('../../models/item');

const {parseTextFromHTML, buildItemObject} = require('../test-utils');
const {connectDatabaseAndDropData, diconnectDatabase} = require('../setup-teardown-utils');

const findImageElementBySource = (htmlAsString, src) => {
  const image = jsdom(htmlAsString).querySelector(`img[src="${src}"]`);
  if (image !== null) {
    return image;
  } else {
    throw new Error(`Image with src "${src}" not found in HTML string`);
  }
};

describe('Server path: /items/create', () => {
  const itemToCreate = buildItemObject();

  beforeEach(connectDatabaseAndDropData);

  afterEach(diconnectDatabase);

  // Write your describe blocks below:
  describe('GET', () => {
    it('renders empty input fields', async () => {
      const response = await request(app)
        .get('/items/create');

        assert.equal(parseTextFromHTML(response.text, 'input#title-input'), '');
        assert.equal(parseTextFromHTML(response.text, 'input#imageUrl-input'), '');
        assert.equal(parseTextFromHTML(response.text, 'textarea#description-input'), '');

    });
  });

  describe('POST', () => {
      it('creates a new item in the database', async () => {
        const itemToCreate = buildItemObject();
        const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

        const createdItem = await Item.findOne(itemToCreate);

        assert.isOk(createdItem, 'Item was not successfully created');
      });

      it('redirects home', async () => {
        const itemToCreate = buildItemObject();
        const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

        assert.equal(response.status, 302);
        assert.equal(response.headers.location, '/');
      });

      it('a /items/create request with no title should throw an error', async () => {
        const itemToCreate = {
          description: 'test',
          imageUrl: 'https://www.placebear.com/200/300'
        };
        const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

        assert.deepEqual(await Item.find({}), []);
        assert.equal(response.status, 400);
        assert.include(parseTextFromHTML(response.text, 'form'), 'required');
      });

      it('a /items/create request with no description should throw an error', async () => {
        const itemToCreate = {
          title: 'name',
          imageUrl: 'https://www.placebear.com/200/300'
        };
        const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

        assert.deepEqual(await Item.find({}), []);
        assert.equal(response.status, 400);
        assert.include(parseTextFromHTML(response.text, 'form'), 'required');
      });

      it('a /items/create request with no imageUrl should throw an error', async () => {
        const itemToCreate = {
          title: 'name',
          description: 'test'
        };
        const response = await request(app)
          .post('/items/create')
          .type('form')
          .send(itemToCreate);

        assert.deepEqual(await Item.find({}), []);
        assert.equal(response.status, 400);
        assert.include(parseTextFromHTML(response.text, 'form'), 'required');
      });
  });

});
