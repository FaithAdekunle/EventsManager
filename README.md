[![Build Status](https://travis-ci.org/FaithAdekunle/EventsManager.svg?branch=develop)](https://travis-ci.org/FaithAdekunle/EventsManager)
[![Coverage Status](https://coveralls.io/repos/github/FaithAdekunle/EventsManager/badge.svg?branch=develop)](https://coveralls.io/github/FaithAdekunle/EventsManager?branch=develop)
[![codecov](https://codecov.io/gh/FaithAdekunle/EventsManager/branch/develop/graph/badge.svg)](https://codecov.io/gh/FaithAdekunle/EventsManager)
# EventsManager
[EventsManager](https://andela-events-manager.herokuapp.com) is a full-stack javascript application that allows users search and book centers to host their upcoming events.
## Installation Guide
STEP 1: Install [`node`](https://nodejs.org/en/) version 6 or above

STEP 2: Install [`posgresql`](https://www.postgresql.org/) database version 9.2 or above.
> Check option to install pgAdmin while installing or manually install [`pgAdmin`](https://www.pgadmin.org/) version 4 or above.

Step 3: Open a terminal window and clone this repository

```
git clone https://github.com/FaithAdekunle/EventsManager.git
```
STEP 4: cd into the cloned repository
```
$ cd eventsmanager
```
STEP 5: Install all dependencies
```
$ npm install
```
STEP 6: Create database for the application
> PgAdmin is recommended for this. See [`how`](https://www.enterprisedb.com/resources/webinars/how-create-postgres-database-using-pgadmin).

STEP 7: Create a `.env` file in the project root directory and add variables and keys as described in [`.env.example`](https://github.com/FaithAdekunle/EventsManager/blob/c43b2854c4342f88fe445e6bc18395bf1b0a051e/.env.example)

STEP 8: Start the application
```
npm run start:dev
```
STEP 9: In a browser, navigate to `localhost:7777`
## Key Features
Users can:
+ Create new user account
+ Log in using existing account details
+ Search for centers based on name, location, facilities of interest and capacity.
+ Book a center for an event
+ Edit and delete event bookings.

Admin can
+ Search for centers based on name, location, facilities of interest and capacity.
+ Create new center
+ Edit existing center
+ Decline user bookings

## Testing
This application uses various toolsets for various tests.

+ `mocha` and `chai` for server side tests
+ `jest` and `enzyme` for client side tests and
+ `nightwatch` for end-to-end tests

> - `npm run testServer` - to run server side tests
> - `npm run testClient` - to run client side tests
> - `npm run e2e` - to run end-to-end tests

Note that for e2e tests, you will need to have the [`Java Development Kit (JDK)`](http://www.oracle.com/technetwork/java/javase/downloads/index.html) installed, minimum required version is 7.

## Api Documentation
See API documentation [`here`](https://andela-events-manager.herokuapp.com/docs)



## Limitations
+ There is no password recovery provision in place
+ Centers cannot be deleted

## Built With
+ [`Node`](https://www.nodejs.org) - A JavaScript runtime built on Chrome's V8 JavaScript engine. Node.js uses an event-driven, non-blocking I/O model that makes it lightweight and efficient.

+ [`Express`](https://www.expressjs.com) - A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.

+ [`Sequelize`](http://www.docs.sequelizejs.com) - Sequelize is a promise-based ORM for Node.js v4 and above.

+ [`PosgreSQL`](https://www.postgresql.org/) - A powerful, open source object-relational database system.

+ [`React`](https://www.reactjs.com) - A JavaScript library for building user interfaces

+ [`Redux`](https://redux.js.org/) - Redux is a predictable state container for JavaScript applications.
+ [`Bootstrap`](https://getbootstrap.com/) - Bootstrap is an open source toolkit for developing with HTML, CSS, and JS.

## Author
+ [`Faith Adekunle`](https://github.com/FaithAdekunle)

## License
This project is licensed under the MIT License - see the [`LICENSE.md`](https://github.com/FaithAdekunle/EventsManager/blob/c43b2854c4342f88fe445e6bc18395bf1b0a051e/LICENSE.md) file for details

## Contribution
When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the author of this repository before making a change.

## Acknowledgment
+ All dependencies used in creating this application
+ [`PurbleBooth README-Template.md`](https://gist.github.com/PurpleBooth/109311bb0361f32d87a2)
