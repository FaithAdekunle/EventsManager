/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import testHelper from './testHelper';
import host from '../index.js';

chai.use(chaiHttp);
chai.should();

describe('Tests for events api', () => {
  describe('POST api/v1/events', () => {
    it('should return a status 400 error response for missing name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          type: 'test type 123',
          start: '20/12/2019',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('name must be 1 - 30 characters');
          done();
        });
    });

    it('should return a status 400 error response for empty name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: '         ',
          type: 'test type 123',
          start: '20/12/2019',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('name must be 1 - 30 characters');
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
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('type must be between 1 - 20 characters');
          done();
        });
    });

    it('should return a status 400 error response for empty type field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: '         ',
          start: '20/12/2018',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('type must be between 1 - 20 characters');
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
          end: '21/12/2019',
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('invalid centerId value');
          done();
        });
    });

    it('should return a status 400 error response for invalid center id field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          end: '21/12/2019',
          centerId: -2,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('invalid centerId value');
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
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('guests must be a positive integer');
          done();
        });
    });

    it('should return a status 400 error response for invalid guests field', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 0,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('guests must be a positive integer');
          done();
        });
    });

    it('should return a status 400 error response for missing end field', (done) => {
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
          res.body.should.have.property('error').to.equal('Invalid end date. Use format DD/MM/YYYY.');
          done();
        });
    });

    it('should return a status 400 error response for past end date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          end: '21/12/2017',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('end date is past');
          done();
        });
    });

    it('should return a status 400 success response for booking a past start date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2016',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('start date is past');
          done();
        });
    });

    it('should return a status 400 success response for booking invalid start date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '70/22/2018',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('Invalid start date. Use format DD/MM/YYYY.');
          done();
        });
    });

    it('should return a status 400 success response for start date ahead of end date', (done) => {
      chai
        .request(host)
        .post('/api/v1/events')
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '20/12/2018',
          guests: 20,
          end: '19/12/2018',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('start date cannot be ahead of end date');
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
          start: '20/12/2019',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('missing token');
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
          start: '20/12/2019',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('authentication failed');
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
          start: '20/12/2019',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('event');
          testHelper.setEventId(res.body.event.id);
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
          start: '30/12/2019',
          guests: 20,
          end: '31/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('event');
          done();
        });
    });
  });

  describe('GET api/v1/events', () => {
    it('should return a status 200 success response fetching all events', (done) => {
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
  });

  describe('GET api/v1/:centerId/events', () => {
    it('should return a status 404 error response for fetching events for a non existing center', (done) => {
      chai
        .request(host)
        .get('/api/v1/0/events')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.error.should.equal('center not found');
          done();
        });
    })

    it('should return a status 404 error response for fetching events for an invalid centerId', (done) => {
      chai
        .request(host)
        .get('/api/v1/centerId/events')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.error.should.equal('invalid centerId parameter');
          done();
        });
    })

    it('should return a status 201 success response for fetching events for a center', (done) => {
      chai
        .request(host)
        .get(`/api/v1/${testHelper.centerId}/events`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.status.should.equal('success');
          done();
        });
    })
  })

  describe('PUT api/v1/events/:id', () => {
    it('should return a status 200 success response for valid put request', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/${testHelper.eventId}?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123 changed',
          type: 'test type 123',
          start: '20/12/2019',
          guests: 20,
          end: '21/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.event.should.have.property('name').equal('test event 123 changed');
          done();
        });
    });

    it('should return a status 404 failure response for editing a non existing event', (done) => {
      chai
        .request(host)
        .put(`/api/v1/events/2147483648?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123 changed',
          type: 'test type 123',
          start: '10/12/2019',
          guests: 20,
          end: '11/12/2019',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('event not found');
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
          start: '30/12/2019',
          guests: 20,
          end: '01/01/2020',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('dates have been booked');
          done();
        });
    });

    it('should return a status 409 error response for more guests than capacity', (done) => {
      chai
        .request(host)
        .post(`/api/v1/events?token=${testHelper.userToken}`)
        .send({
          name: 'test event 123',
          type: 'test type 123',
          start: '30/12/2019',
          guests: 600,
          end: '01/01/2020',
          centerId: testHelper.centerId,
        })
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('guests too large for this center');
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
          start: '19/12/2019',
          guests: 20,
          end: '21/12/2019',
          centerId: 0,
        })
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('center not found');
          done();
        });
    });
  });

  describe('PUT api/v1/events/:id/decline', () => {
    it('should return a status 404 error response for declining non existing event', (done) => {
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

  describe('DELETE api/v1/events/:id', () => {
    it('should return a status 404 success response for deleting a non existing event', (done) => {
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
