var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Heavily focused on matching node-feedparser output
// https://github.com/danmactough/node-feedparser

var ArticleSchema = new Schema({
  title: String,
  filtered: {type: Boolean, default: false},           // Removed by filter rule
  include: {type: Boolean, default: false},           // Explicitly included by user, overrides filtered
  description: String,                                // Possibly full article
  summary: String,                                    // Excerpt of article
  origlink: String,                                   // Tracking Link
  permalink: String,                                  // guid when isPermalink attribute is not false
  date: Date,
  pubdate: Date,
  author: String,
  guid: String,
  categories: [String],
  source: {
    url: String,
    title: String
  },
  enclosures: [],
  meta: {}
});

var FeedSchema = new Schema({
  //feed_id: {type: Number, index: { unique: true }},   // Unique Feed ID
  type: String,                                       // Atom or RSS
  lastBuildDate: Date,
  filters: [],                                        // List of filters
  title: {type:String, required: true},
  description: String,
  link: String,                                       // Website link
  altUrls: [String],                                  // Alternative Urls
  xmlurl: String,                                     // Feed link
  date: Date,                                         // Most Recent Update
  // pubDate: Date,                                   // Original Publish Date
  author: String,
  language: String,                                   //eg. en-US
  image: {
    url: String,
    title: String,
  },
  copyright: String,
  generator: String,
  categories: [String],
  articles: [ArticleSchema]
});

module.exports.sourceFeed = mongoose.model('SourceFeed', FeedSchema);
module.exports.outputFeed = mongoose.model('OutputFeed', FeedSchema);
module.exports.articleSchema = ArticleSchema;
//module.exports = mongoose.model('sourceFeed', FeedSchema);
