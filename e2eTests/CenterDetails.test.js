/* global module */
const APP_BASE_PATH = 'http://localhost:7777';

module.exports = {
  'CenterDetails Page': (browser) => {
    browser

      // sign in as admin
      .url(`${APP_BASE_PATH}/signin`)
      .waitForElementVisible('body', 5000)
      .assert.urlEquals(`${APP_BASE_PATH}/signin`)
      .setValue('input[type=email]', 'admin@admin.com')
      .setValue('input[type=password]', 'adminpassword')
      .click('input[type=submit]')
      .pause(5000)

      // search for centers
      .setValue('#filter', 'blue room')
      .click('input[type=submit]')
      .pause(5000)

      // nav to center details page
      .click('.center-image')
      .pause(5000)
      .assert.hidden('.modal-content')

      // edit center
      .click('button.btn.btn-primary.btn-block')
      .pause(1000)
      .assert.visible('.modal-content')
      .clearValue('textarea')
      .setValue('textarea', `Bespoke Event Center is a world-class all-in-one 
      multi-purpose event centre. It has facilities for various events such as 
      conferences, seminars, concerts, training, weddings, product launches 
      and all types of events. The Hall is also fully equipped with musical 
      instruments, a public address system, cold room, kitchenette, conference 
      room, standby generator, tight security and ample parking space.`)
      .pause(1000)
      .click('input[type=submit]')
      .pause(5000)
      .assert.hidden('.modal-content')
      .pause(1000)
      .end();
  },
};
