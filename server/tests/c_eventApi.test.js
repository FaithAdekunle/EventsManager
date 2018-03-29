/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import testHelper from './testHelper';
import host from '../index.js';

chai.use(chaiHttp);
chai.should();

describe('Tests for events api', () => {
  describe('Tests for creating event', () => {
    it('should return a status 400 error response for missing name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing event name field');
          done();
        });
    });

    it('should return a status 400 error response for empty name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: '',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('event name must be between 1 and 100 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing type field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing event type field');
          done();
        });
    });

    it('should return a status 400 error response for empty type field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: '',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('event type must be between 1 and 20 characters long');
          done();
        });
    });

    it('should return a status 400 error response for missing center id field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing center id field');
          done();
        });
    });

    it('should return a status 400 error response for invalid center id value', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: -2,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for centerId, guests and days fields');
          done();
        });
    });

    it('should return a status 400 error response for missing guests field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing guests field');
          done();
        });
    });

    it('should return a status 400 error response for invalid guests value', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 'invalid',
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for centerId, guests and days fields');
          done();
        });
    });

    it('should return a status 400 error response for missing days field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').to.include('missing days field');
          done();
        });
    });

    it('should return a status 400 error response for invalid days value', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 0,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed for centerId, guests and days fields');
          done();
        });
    });

    it('should return a status 400 success response for booking a passed date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2016',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Pevious dates can not be booked');
          done();
        });
    });

    it('should return a status 400 success response for booking invalid date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '70/22/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid date. Use format DD/MM/YYYY for date');
          done();
        });
    });

    it('should return a status 400 error response for missing token', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('missing token');
          done();
        });
    });

    it('should return a status 401 error response for bad token token', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.fakeToken}`)
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('authentication failed');
          done();
        });
    });

    it('should return a status 201 success response for valid post request', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('end').equal('21/12/2018');
          testHelper.setEventId(res.body.id);
          done();
        });
    });

    it('should return a status 201 success response for valid post request', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send({
          name: 'test event 456',
          type: 'test type 123',
          start: '30/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('end').equal('31/12/2018');
          done();
        });
    });
  });

  describe('Test for fetching events', () => {
    it('should return a status 200 success response fetching all events', (done) => {
      chai
        .request(host)
        .get(`/api/v1/events?token=${testHelper.userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body[res.body.length - 1].should.have.property('name').equal('test event 456');
          done();
        });
    });
  });

  describe('Test for editing event', () => {
    it('should return a status 200 success response for valid put request', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/${testHelper.eventId}?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123 changed',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('name').equal('test event 123 changed');
          done();
        });
    });

    it('should return a status 404 failure response for editing a non existing event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/0?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123 changed',
          type: 'test type 123',
          start: '20/12/2019',
          guests: 20,
          days: 2,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('event not found');
          done();
        });
    });

    it('should return a status 409 error response for booked dates', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '19/12/2018',
          guests: 20,
          days: 8,
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('dates have been booked');
          done();
        });
    });

    it('should return a status 404 error response for booking a non existing center', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '19/12/2018',
          guests: 20,
          days: 8,
          centerId: 0,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center not found');
          done();
        });
    });
  });

  describe('Test for declining event', () => {
    it('should return a status 404 error response for declining non existing event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/0/decline?token=${testHelper.adminToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('event not found');
          done();
        });
    });

    it('should return a status 200 success response for declining user event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/${testHelper.eventId}/decline?token=${testHelper.adminToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').equal('success');
          done();
        });
    });
  });

  describe('Test for deleting event', () => {
    it('should return a status 404 success response for deleting a non existing event', (done) => {
      chai
        .request(host)
        .delete(`/api/v1/events/0?token=${testHelper.userToken}`)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('event not found');
          done();
        });
    });

    it('should return a status 200 success response for deleting an event', (done) => {
      chai
        .request(host)
        .delete(`/api/v1/events/${testHelper.eventId}?token=${testHelper.userToken}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').equal('success');
          done();
        });
    });
  });
});
