# Oyster
Oyster is an app for filtering RSS feeds.

## How does (will) it work?
A user will be able to save feeds to be checked on a regular basis. Feeds can then be filtered for content and either served individually, or as a group. These can then be used in any RSS reader or podcast player.

The goal is to only change which items appear in the feed and not necessarily the content of each item, with the possible exception of adding a title indicator to show it is an altered feed.

## When can I use it?
Oyster is still in very early development and will have a lot of bugs and inefficiencies. The primary goal is to provide a stable self-hosted solution meant for a small number of users and feeds.

## Example Site
Coming Soon...

## Models
### User
- name
- username
- password

## API
### authenticate (/api/v1/authenticate)
#### POST
retrieve token for future api calls
- parameters
  - username
  - password
- return
  - success: (boolean)
  - message
  - token

### users (/api/v1/users)
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

### user (/api/v1/users/:user_id)
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

## Contributions
If you are interested in helping out, please let me know.
[@moorepatrick](https://twitter.com/moorepatrick/)

## Acknowledgements
This project was jump-started with techniques and code from [Scotch.io](https://scotch.io) and [MEAN Machine](https://leanpub.com/mean-machine) by Chris Sevilleja and Holly Lloyd.
