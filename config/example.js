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
  site: {
    feed_base: "http://www.example.com/feeds",
    site_base: "http://www.example.com"
  }
};
