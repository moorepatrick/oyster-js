module.exports = {
  port: 8080,
  dbConfig: {
    host: "127.0.0.1",
    port: 27017,
    dbName: "exampleDB"
  },
  session: {
    secret: "changeThisToSomethingUnique"
  },
  version: "0.1"
};
