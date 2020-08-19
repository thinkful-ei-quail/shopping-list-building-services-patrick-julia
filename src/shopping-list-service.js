const ShoppingListService = {
  getAllItems(db) {
    return db.select('*').from('shopping_list');
  },

  insertItem(db, item) {
    return db
      .insert(item)
      .into('shopping_list')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },

  getById(db, id) {
    return db.select('*').from('shopping_list').where({id}).first();
  },

  deleteItem(db, id) {
    return db.delete().from('shopping_list').where({id});
  },
  
  updateItem(db, id, newItem) {
    return db.update(newItem).from('shopping_list').where({id});
  }
};

module.exports = ShoppingListService;
