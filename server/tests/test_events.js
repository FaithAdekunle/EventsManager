/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
chai.should();
const host = 'localhost:7777';


describe('Tests for local Events API', () => {
  let eventId;

  describe('Create Event', () => {
    it('should return a status 200 error response for any missing body field', (done) => {
      chai
        .request(host)
        .post('/events/')
        .send({})
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for back date', (done) => {
      const body = {
        name: 'Annual COMSA Conference',
        type: 'conference',
        days: 1,
        start: '20/10/2017',
        guests: 300,
        center: 'The Conference center',
      };
      chai
        .request(host)
        .post('/events/')
        .send(body)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Use format DD/MM/YYYY for date');
          eventId = res.body.id;
          done();
        });
    });

    it('should return a status 200 error response for invalid number of days', (done) => {
      const body = {
        name: 'Annual COMSA Conference',
        type: 'conference',
        days: 'days',
        start: '20/10/2017',
        guests: 300,
        center: 'The Conference center',
      };
      chai
        .request(host)
        .post('/events/')
        .send(body)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed');
          eventId = res.body.id;
          done();
        });
    });

    it('should return a status 200 error response for invalid number of guests', (done) => {
      const body = {
        name: 'Annual COMSA Conference',
        type: 'conference',
        days: 1,
        start: '20/10/2017',
        guests: -300,
        center: 'The Conference center',
      };
      chai
        .request(host)
        .post('/events/')
        .send(body)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed');
          eventId = res.body.id;
          done();
        });
    });

    it('should return a status 200 success response for valid post request', (done) => {
      const body = {
        name: 'Annual COMSA Conference',
        type: 'conference',
        days: 1,
        start: '20/12/2017',
        guests: 300,
        center: 'The Conference center',
      };
      chai
        .request(host)
        .post('/events/')
        .send(body)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.all.keys(['id', 'name', 'type', 'days', 'start', 'end', 'guests', 'center']);
          eventId = res.body.id;
          done();
        });
    });
  });

  describe('Modify Event', () => {
    it('should return a status 200 error response for modifying a non existing event', (done) => {
      const body = {
        id: 'fakeid',
        name: 'Annual IEEE Conference',
        type: 'conference',
        days: 1,
        start: '20/12/2017',
        guests: 300,
        center: 'The Conference center',
      };
      chai
        .request(host)
        .put('/events/fakeId')
        .send(body)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('event not found');
          done();
        });
    });

    it('should return a status 200 error response for any missing modifier fields', (done) => {
      chai
        .request(host)
        .put(`/events/${eventId}`)
        .send({})
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should modify name field and return a status 200 success response for valid put request', (done) => {
      const body = {
        id: eventId,
        name: 'Annual IEEE Conference',
        type: 'conference',
        days: 1,
        start: '20/12/2017',
        guests: 300,
        center: 'The Conference center',
      };
      chai
        .request(host)
        .put(`/events/${eventId}`)
        .send(body)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('name').equal('Annual IEEE Conference');
          res.body.should.have.all.keys(['id', 'name', 'type', 'days', 'start', 'end', 'guests', 'center']);
          done();
        });
    });
  });

  describe('Delete event', () => {
    it('should return a status 200 error response for trying to delete a non existing event', (done) => {
      chai
        .request(host)
        .delete('/events/fakeId')
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('event not found');
          done();
        });
    });

    it('should return a status 200 success response for a valid delete request', (done) => {
      chai
        .request(host)
        .delete(`/events/${eventId}`)
        .then((res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').equal('success');
          done();
        });
    });
  });
});

