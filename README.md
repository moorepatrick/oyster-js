# Oyster
Oyster is an app for filtering RSS feeds.

## How does (will) it work?
A user will be able to save feeds to be checked on a regular basis. Feeds can then be filtered for content and either served individually, or as a group. These can then be used in any RSS reader or podcast player.

The goal is to only change which items appear in the feed and not necessarily the content of each item, with the possible exception of adding a title indicator to show it is an altered feed.

## When can I use it?
Oyster is still in very early development and will have a lot of bugs and inefficiencies. The primary goal is to provide a stable self-hosted solution meant for a small number of users and feeds.

## Example Site
Coming Soon...

## Getting Started

### Development Mode
Copy and edit the `example.js` config file in `/config`. Save it as `dev.js`. Next run the following commands from the root directory of the project.

    npm install  # install node dependencies
    gulp develop # build project into the _public folder

## Schema
Much of the feed schema is based on the output from [node-feedparser](https://github.com/danmactough/node-feedparser#what-is-the-parsed-output-produced-by-feedparser)

### UserSchema
- name
- username
- password
- admin - admin status
- sourceFeeds - list of subscribed feeds
- outputFeeds - list of created filter feeds

### SourceSchema
- type - Atom or RSS (Not Implemented)
- title
- lastRetrieved
- description
- link
- altUrls - List of alternative urls, eg. redirects
- xmlUrl - feed link
- date
- author
- language
- image
  - url
  - title
- localImage
- copyright
- generator
- categories
- articles - Array of ArticleSchema objects

### OutputSchema
- type - Atom or RSS (Not Implemented)
- filters
- owner
- title
- normTitle
- description
- link
- xmlUrl - feed link
- date
- lastBuildDate
- author
- language
- image
  - url
  - title
- copyright
- generator
- categories
- articles - Array of OutputArticleSchema objects

### ArticleSchema
- title
- parentId
- description - Possibly full article
- summary - Excerpt of article
- origlink - Tracking Link
- permalink - guid when isPermalink attribute is not false
- date
- pubdate
- author
- guid
- categories - array of categories
- source
  - url
  - title
- enclosures - list of enclosed files
  - url
  - type
  - length
- meta - metadata from feed

### OutputArticleSchema
- article - ArticleSchema
- filtered - Removed by filter rule
- included - Explicitly included by user, overrides filtered

## API
All paths are prefixed by /api/v1 where v1 represents the API version 1.

### authenticate (/authenticate)
#### POST
retrieve token for future api calls
- parameters
  - username
  - password
- return
  - success: (boolean)
  - message
  - token

### users (/users)
All calls the the api require a token received from the server

#### GET
Get user inform
- return
  - all known users

#### POST
Create new user
- parameters
  - name
  - username
  - password
- return
  - success: (boolean)
  - message

### user (/users/:user_id)
#### GET
Get user information
- return
  - user information

#### PUT
Update user
- parameters
  - whatever fields needing to be updated
- return
  - message

#### DELETE
Delete user
- return
  - message

### feeds (/output_feeds/:username)
#### GET
Get all feeds user has created
- return
  - user id
  - username
  - array of feeds

#### POST - Not Implemented
Create new user feed

### feed (/output_feeds/:username/:feed_id)
#### GET
Get single user feed
- return
  - xml file or error

#### PUT - Not Implemented
Update user feed

#### DELETE - Not Implemented
Remove user feed

### subscriptions (/source_feeds)
#### GET
Get all feeds a user subscribes to
- return
    - username
    - array of subscription feeds

#### POST
Add feed to users list of subscribed feeds
- parameters
  - url
- return
  - success message

### subscriptions (/source_feeds/:feed_id)
#### GET
Get feed information
- return
  - feed

#### DELETE
Delete feed
- return
  - success message

## Contributions
If you are interested in helping out, please let me know.
[@moorepatrick](https://twitter.com/moorepatrick/)

## Acknowledgements
This project was jump-started with techniques and code from [Scotch.io](https://scotch.io) and [MEAN Machine](https://leanpub.com/mean-machine) by Chris Sevilleja and Holly Lloyd.
