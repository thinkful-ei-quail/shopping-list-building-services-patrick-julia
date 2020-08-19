require('dotenv').config();
const { expect } = require('chai');
const supertest = require('supertest');
const knex = require('knex');
const ShoppingListService = require('../src/shopping-list-service');
const { getAllItems } = require('../src/shopping-list-service');

describe('Shopping List service object', () => {
  let db;
  let testItems = [
    {
      id: 1,
      name: 'Sushi',
      date_added: new Date('2029-01-22T16:28:32.615Z'),
      price: '7.33',
      checked: false,
      category: 'Main',
    },
    {
      id: 2,
      name: 'Stroganoff',
      date_added: new Date('2100-05-22T16:28:32.615Z'),
      price: '10.25',
      checked: false,
      category: 'Breakfast',
    },
    {
      id: 3,
      name: 'Nutella',
      date_added: new Date('1919-12-22T16:28:32.615Z'),
      price: '4.55',
      checked: true,
      category: 'Snack',
    },
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
  });

  before(() => db('shopping_list').truncate());
  afterEach(() => db('shopping_list').truncate());
  after(() => db.destroy());

  context('Given shopping_list has data', () => {

    beforeEach(() => {
      return db.into('shopping_list').insert(testItems);
    });
  
    it('getAllItems() gets all items from shopping_list', () => {
      return ShoppingListService.getAllItems(db)
        .then((actual) => {
          expect(actual).to.eql(testItems);
        });
    });

    it('getById() returns an item by id from shopping_list', () => {
      const id = 3;
      const item = testItems[id - 1];
      return ShoppingListService.getById(db, id)
        .then(actual => {
          expect(actual).to.eql(item);
        });
    });

    it('deleteItem() removes an item by id from shopping_list', () => {
      const id = 3;
      return ShoppingListService.deleteItem(db, id)
        .then(() => ShoppingListService.getAllItems(db))
        .then(allItems => {
          const expected = testItems.filter(item => item.id !== id);
          expect(allItems).to.eql(expected);
        });
    });

    it('updateItem() updates an item form shopping_list', () => {
      const id = 3;
      const newItem = {
        name: 'Figs',
        price: '6.10',
        checked: false,
        category: 'Main',
      };
      return ShoppingListService.updateItem(db, id, newItem)
        .then(() => ShoppingListService.getById(db, id))
        .then((item) => {
          expect(item).to.eql({
            id: id,
            date_added: testItems[id-1].date_added,
            ...newItem
          });
        });
    });
  });

  context('Given shopping_list has no data', () => {
    it('getAllItems() returns nothing', () => {
      return ShoppingListService.getAllItems(db)
        .then(actual => {
          expect(actual).to.eql([]);
        });
    });

    it('insertItem() inserts a new item and returns the item with an id', () => {
      const newItem = {
        name: 'Red Velvet Cheesecake',
        price: '35.00',
        checked: true,
        date_added: new Date('2020-03-22T16:28:32.615Z'),
        category: 'Lunch',
      };
      return ShoppingListService.insertItem(db, newItem)
        .then(actual => {
          expect(actual).to.eql({
            id: 1,
            name: newItem.name,
            price: newItem.price,
            checked: newItem.checked,
            date_added: newItem.date_added,
            category: newItem.category
          });
        });
    });
  });
});
