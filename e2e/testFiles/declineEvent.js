/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  declineEvent: (browser) => {
    browser

      .url(`${APP_BASE_PATH}/signin`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)

      // sign in as admin
      .setValue('input[type=email]', 'admin@admin.com')
      .setValue('input[type=password]', 'adminpassword')
      .click('input[type=submit]')
      .pause(5000)
      .click('img.center-image')
      .pause(5000)

      // decline event
      .assert.elementNotPresent('declined')
      .execute(() => {
        scrollTo(0, document.body.scrollHeight);
      })
      .pause(2000)
      .click('i.fa-times.pull-right')
      .pause(15000)
      .assert.visible('.declined')
      .pause(2000)
      .end();
  },
};
