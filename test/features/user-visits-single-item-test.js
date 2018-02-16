const {assert} = require('chai');
const {buildItemObject} = require('../test-utils');

describe('user visits an item', () => {
    describe('fills out the form', () => {
        it('can see the item on the home page', () => {
            const itemToCreate = buildItemObject();

            browser.url('/items/create');
            browser.setValue('#title-input', itemToCreate.title);
            browser.setValue('#description-input', itemToCreate.description);
            browser.setValue('#imageUrl-input', itemToCreate.imageUrl);
            browser.click('#submit-button');
            browser.click('.item-card a');

            assert.include(browser.getText('body'), itemToCreate.description);
        });
    });
});