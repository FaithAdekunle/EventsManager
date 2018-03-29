import uuidv4 from 'uuid/v4';

class TestHelper {
  constructor() {
    this.userToken = undefined;
    this.adminToken = undefined;
    this.centerId = undefined;
    this.eventId = undefined;
    this.userEmail = `${uuidv4()}@gmail.com`;
    this.adminEmail = `${uuidv4()}@gmail.com`;
    this.userPassword = uuidv4();
    this.adminPassword = uuidv4();
    this.centerName = uuidv4();
    this.anotherCenterName = uuidv4();
    this.randomCenterName = uuidv4();
    this.fakeToken = uuidv4();
    this.fakeEmail = `${uuidv4()}@gmail.com`;
  }

  setUserToken(userToken) {
    this.userToken = userToken;
  }

  setAdminToken(adminToken) {
    this.adminToken = adminToken;
  }

  setCenterId(centerId) {
    this.centerId = centerId;
  }

  setEventId(eventId) {
    this.eventId = eventId;
  }
}

export default new TestHelper();

