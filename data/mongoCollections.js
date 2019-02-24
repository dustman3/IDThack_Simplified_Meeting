const dbConnection = require("./mongoConnections").db;

const getCollectionFnDB = collection => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection;
      _col = await db.collection(collection);
    }
    return _col;
  };
};


/* Now, you can list your collections here: */
module.exports = {
  voiceToText: getCollectionFnDB("voiceToText"),
};