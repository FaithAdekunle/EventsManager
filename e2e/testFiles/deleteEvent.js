/* global module */
import expect from 'expect';

const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  deleteEvent: (browser) => {
    browser

      // sign in as user
      .url(`${APP_BASE_PATH}/signin`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)

      // sign in as user
      .setValue('input[type=email]', 'user@user.com')
      .setValue('input[type=password]', 'userpassword')
      .click('input[type=submit]')
      .pause(5000)

      // delete event
      .elements('css selector', '.event-title', (results) => {
        expect(results.value.length).toBe(2);
      })
      .click('.fa-trash')
      .pause(1000)
      .click('.btn-danger')
      .pause(2000)
      .elements('css selector', '.event-title', (results) => {
        expect(results.value.length).toBe(1);
      })
      .pause(2000)
      .end();
  },
};
