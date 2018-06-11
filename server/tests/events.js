/* eslint-disable import/no-extraneous-dependencies */
import Sequelize from 'sequelize';
import dotenv from 'dotenv';
import chai from 'chai';
import chaiHttp from 'chai-http';
import testHelper from './testHelper';
import bodies from './bodies';
import host from '../index.js';

chai.use(chaiHttp);
chai.should();

module.exports = describe('Tests for events api', () => {
  before((done) => {
    dotenv.config({ path: '.env' });
    const database = process.env.TEST_DATABASE;
    const sequelize = new Sequelize(database);
    sequelize
      .query('DELETE FROM events')
      .then(() => done());
  });
  describe('POST api/v1/events', () => {
    it('should return error for missing name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.NO_NAME)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('name must be 1 - 30 characters');
          done();
        });
    });

    it('should return error for empty name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.EMPTY_NAME)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('name must be 1 - 30 characters');
          done();
        });
    });

    it('should return error for missing type field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.NO_TYPE)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('type must be between 1 - 20 characters');
          done();
        });
    });

    it('should return error for empty type field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.EMPTY_TYPE)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('type must be between 1 - 20 characters');
          done();
        });
    });

    it('should return error for missing center id field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.NO_CENTER_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('invalid centerId value');
          done();
        });
    });

    it('should return error for invalid center id field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.INVALID_CENTER_ID)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('invalid centerId value');
          done();
        });
    });

    it('should return error for missing guests field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.NO_GUESTS)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('guests must be a positive integer');
          done();
        });
    });

    it('should return error for invalid guests field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.INVALID_GUESTS)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('guests must be a positive integer');
          done();
        });
    });

    it('should return error for missing end date field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.NO_END_DATE)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('Invalid end date. Use format DD/MM/YYYY.');
          done();
        });
    });

    it('should return errorfor past end date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.PAST_END_DATE)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('end date is past');
          done();
        });
    });

    it('should return error for booking a past start date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.PAST_START_DATE)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('start date is past');
          done();
        });
    });

    it('should return error for booking invalid start date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.INVALID_START_DATE)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error')
            .equal('Invalid start date. Use format DD/MM/YYYY.');
          done();
        });
    });

    it('should return error for start date set after end date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.BAD_TIMING)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error')
            .equal('start date cannot be ahead of end date');
          done();
        });
    });

    it('should return error for missing token', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send(bodies.eventBodies.CREATE_EVENT(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('missing token');
          done();
        });
    });

    it('should return error for bad token token', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.fakeToken}`)
        .send(bodies.eventBodies.CREATE_EVENT(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('authentication failed');
          done();
        });
    });

    it('should create and add a new event', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send(bodies.eventBodies.CREATE_EVENT(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('event');
          testHelper.setEventId(res.body.event.id);
          done();
        });
    });

    it('should create another event', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send(bodies.eventBodies.CREATE_ANOTHER_EVENT(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('event');
          done();
        });
    });
  });

  describe('GET api/v1/events', () => {
    it('should fetch all events', (done) => {
      chai
        .request(host)
        .get(`/api/v1/events?token=${testHelper.userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.status.should.equal('success');
          done();
        });
    });

    it('should fetch all events with pagination', (done) => {
      chai
        .request(host)
        .get(`/api/v1/events?token=${testHelper.userToken}&pagination=true`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.should.have.property('metaData');
          res.body.metaData.pagination.currentPage.should.equal(1);
          done();
        });
    });

    it('should fetch some events with pagination', (done) => {
      chai
        .request(host)
        .get(`/api/v1/events?token=${testHelper.userToken}` +
        '&pagination=true&offset=1&limit=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.status.should.equal('success');
          res.body.should.have.property('metaData');
          res.body.metaData.pagination.currentPage.should.equal(2);
          done();
        });
    });
  });

  describe('GET api/v1/centers/:centerId/events', () => {
    it('should return error for non existing center', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers/0/events')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.error.should.equal('center not found');
          done();
        });
    });

    it('should return error for invalid center id', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers/centerId/events')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.error.should.equal('invalid centerId parameter');
          done();
        });
    });

    it('should fetch events booked in one center', (done) => {
      chai
        .request(host)
        .get(`/api/v1/centers/${testHelper.centerId}/events`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.status.should.equal('success');
          done();
        });
    });
  });

  describe('PUT api/v1/events/:id', () => {
    it('should return error for non existing event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/2147483648?token=${testHelper.userToken}`)
        .send(bodies.eventBodies.NO_EVENT(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('event not found');
          done();
        });
    });

    it('should edit event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/${testHelper.eventId}` +
          `?token=${testHelper.userToken}`)
        .send(bodies.eventBodies.EDIT_EVENT(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.event.should.have.property('name')
            .equal('test event 123 changed');
          done();
        });
    });

    it('should return error for booked dates', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send(bodies.eventBodies.BOOKED_DATES(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('error')
            .equal('dates have been booked');
          done();
        });
    });

    it('should return error for too many guests', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send(bodies.eventBodies.TOO_MANY_GUESTS(testHelper.centerId))
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('error')
            .equal('guests too large for this center');
          done();
        });
    });

    it('should return error non existing center', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send(bodies.eventBodies.NO_CENTER)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('center not found');
          done();
        });
    });
  });

  describe('PUT api/v1/events/:id/decline', () => {
    it('should return error for non existing event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/0/decline?token=${testHelper.adminToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('event not found');
          done();
        });
    });

    it('should decline event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/${testHelper.eventId}/decline` +
          `?token=${testHelper.adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').equal('success');
          done();
        });
    });
  });

  describe('DELETE api/v1/events/:id', () => {
    it('should return error for non existing event', (done) => {
      chai
        .request(host)
        .delete(`/api/v1/events/0?token=${testHelper.userToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('event not found');
          done();
        });
    });

    it('should delete an event', (done) => {
      chai
        .request(host)
        .delete(`/api/v1/events/${testHelper.eventId}` +
          `?token=${testHelper.userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').equal('success');
          done();
        });
    });
  });
});
