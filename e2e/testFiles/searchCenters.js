/* global module */
import expect from 'expect';

const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  searchCenters: (browser) => {
    browser
      .url(`${APP_BASE_PATH}/centers`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/centers`)

      // search for centers
      .setValue('#facility', 'chairs')
      .pause(1000)
      .click('input[type=submit]')
      .pause(2000)
      .elements('css selector', '.center-name', (results) => {
        expect(results.value.length).toBe(3);
      })
      .pause(1000)
      .setValue('#capacity', 600)
      .pause(1000)
      .click('input[type=submit]')
      .pause(2000)
      .elements('css selector', '.center-name', (results) => {
        expect(results.value.length).toBe(2);
      })
      .setValue('#filter', 'cloud')
      .pause(1000)
      .click('input[type=submit]')
      .pause(2000)
      .elements('css selector', '.center-name', (results) => {
        expect(results.value.length).toBe(1);
      })
      .pause(1000)
      .end();
  },
};
