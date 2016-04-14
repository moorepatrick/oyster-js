var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Heavily focused on matching node-feedparser output
// https://github.com/danmactough/node-feedparser

var ArticleSchema = new Schema({
  title: String,                                          // Title
  parentId: {type: Schema.Types.ObjectId, ref: 'SourceFeed'}, // ID of Parent Feed
  description: String,                                    // Possibly full article
  summary: String,                                    // Excerpt of article
  origlink: String,                                   // Tracking Link
  permalink: String,                                  // guid when isPermalink attribute is not false
  date: Date,                                         // Date
  pubdate: Date,                                      // Date
  author: String,                                     // Item Author
  guid: String,                                       // Unique ID
  categories: [String],                               // Categories
  source: {                                           // Item source URL
    url: String,
    title: String
  },
  enclosures: [],                                         // Enclosures. eg. mp3 files
  meta: {}                                                // Meta data
});

// Used to attach filtered and included values to source feed items
var OutputArticleSchema = new Schema({
  article: {type: Schema.Types.ObjectId, ref: 'Article'}, // Article ID
  filtered: {type: Boolean, default: false},              // Removed by filter rule
  included: {type: Boolean, default: false}               // Explicitly included by user, overrides "filtered"
});

// Source Feeds from publishers
var SourceSchema = new Schema({
  type: String,                                             // RSS or Atom
  title: {type: String, required: true},                    // Title
  lastRetrieved: Date,                                      // Date last retrieved from source server
  description: String,                                      // Description
  link: String,                                             // Website link
  altUrls: [String],                                        // Alterative URLs that resolve to the same feed
  xmlUrl: String,                                           // Feed link
  date: Date,                                               // Feed date
  author: String,                                           // Feed author
  language: String,                                         // Language eg. en-US
  image: {                                                  // Source feed image
    url: String,
    title: String
  },
  localImage: String,                                       // Cached image location
  copyright: String,                                        // Copyright
  generator: String,                                        // Feed generator
  categories: [String],                                     // List of Categories
  articles: [{type: Schema.Types.ObjectId, ref: 'Article'}] // List of feed items
});

// Collected and filtered feeds
var OutputSchema = new Schema({
  type: String,                                             // RSS or Atom
  filters: [],                                              // List of applied filters
  title: {type: String, required: true},                    // Title
  description: String,                                      // Description
  link: String,                                             // Website link
  xmlUrl: String,                                           // Feed link
  date: Date,                                               // Feed date
  lastBuildDate: Date,                                      // Date feed was last checked for updates
  author: String,                                           // Feed author
  language: String,                                         // Language eg. en-US
  image: {                                                  // Feed image
    location: String,
    title: String
  },
  copyright: String,                                        // Copyright
  generator: String,                                        // Feed generator
  categories: [String],                                     // List of categories
  articles: [OutputArticleSchema]                           // List of feed items with filtered and included values
});

module.exports.sourceFeed = mongoose.model('SourceFeed', SourceSchema);
module.exports.outputFeed = mongoose.model('OutputFeed', OutputSchema);
module.exports.article = mongoose.model('Article', ArticleSchema);
//module.exports = mongoose.model('sourceFeed', FeedSchema);
