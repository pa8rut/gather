const Item = require('../../models/item');
const {assert} = require('chai');
const {mongoose, databaseUrl, options} = require('../../database');

describe('Model: Item', () => {
  beforeEach(async () => {
    await mongoose.connect(databaseUrl, options);
    await mongoose.connection.db.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.disconnect();
  });

  // Write your tests below:
  describe('#title', () => {
    it('is a string', () => {
      const titleNotString = 4;
      const item = new Item({
        title: titleNotString
      })

      assert.strictEqual(item.title, titleNotString.toString());

    });

    it('is required', () => {
      const item = new Item({});

      item.validateSync();

      assert.equal(item.errors.title.message, 'Path `title` is required.');
    });
  });

  describe('#describe', () => {
    it('is a string', () => {
      const descriptionNotString = 500;
      const item = new Item({
        description: descriptionNotString
      });

      assert.strictEqual(item.description, descriptionNotString.toString());
    });

    it('is required', () => {
      const item = new Item({});

      item.validateSync();

      assert.equal(item.errors.description.message, 'Path `description` is required.');
    });
  });

  describe('#imageUrl', () => {
    it('is a string', () => {
      const imageUrlNotString = 500;
      const item = new Item({
        imageUrl: imageUrlNotString
      });

      assert.strictEqual(item.imageUrl, imageUrlNotString.toString());
    });

    it('is required', () => {
      const item = new Item({});

      item.validateSync();

      assert.equal(item.errors.imageUrl.message, 'Path `imageUrl` is required.');
    });
  });
});
