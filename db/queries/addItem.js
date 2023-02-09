const db = require('../connection');

const addItem = (userID, item, category) => {
  console.log('Item = ' + item + ' User ID = ' + userID + ' Category = ' + category);
  //write query to add item to database
  const query = `INSERT INTO items (user_id, category_id, item_name)

  VALUES ($1, (SELECT id FROM categories WHERE category_name = $2), $3) RETURNING *`;

  const values = [userID, category, item];

  return db.query(query, values)
    .then(res => {
      return res.rows[0].id;
    })
    .catch(err => {
      console.error(err);
      return err;
    });
};

module.exports = { addItem };
