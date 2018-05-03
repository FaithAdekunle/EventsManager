import uuidv4 from 'uuid/v4';

/**
 * TestHelpers class. Holds realtime test data
 */
class TestHelper {
  /**
   * constructor
   */
  constructor() {
    this.userToken = undefined;
    this.adminToken = undefined;
    this.centerId = undefined;
    this.eventId = undefined;
    this.userEmail = `${uuidv4()}@gmail.com`;
    this.adminEmail = 'admin_test@admin.com';
    this.userPassword = uuidv4();
    this.adminPassword = 'adminpassword';
    this.centerName = uuidv4();
    this.anotherCenterName = uuidv4();
    this.randomCenterName = uuidv4();
    this.fakeToken = uuidv4();
    this.fakeEmail = `${uuidv4()}@gmail.com`;
  }

  /**
   * sets to received user token after test login
   * @param { string } userToken
   * @returns { void }
   */
  setUserToken(userToken) {
    this.userToken = userToken;
  }

  /**
   * sets to received admin token after test login
   * @param { string } adminToken
   * @returns { void }
   */
  setAdminToken(adminToken) {
    this.adminToken = adminToken;
  }

  /**
   * sets to id of created center
   * @param { integer } centerId
   * @returns { void }
   */
  setCenterId(centerId) {
    this.centerId = centerId;
  }

  /**
   * sets to id of created event
   * @param { integer } eventId
   * @returns { void }
   */
  setEventId(eventId) {
    this.eventId = eventId;
  }
}

export default new TestHelper();
