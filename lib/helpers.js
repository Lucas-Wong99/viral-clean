const retrieveUserFromDB = (db, id) => {
  const query = `
  SELECT name
  FROM users
  WHERE id = $1;
  `
  return db.query(query, [id])
    .then((data) => {
      return data.rows[0].name;
    });
};

module.exports = {
   retrieveUserFromDB
  };
