/* eslint-disable import/no-extraneous-dependencies */
import chai from 'chai';
import chaiHttp from 'chai-http';
import testHelper from './testHelper';
import bodies from './bodies';
import host from '../index.js';

chai.use(chaiHttp);
chai.should();

module.exports = describe('Tests for Centers endpoints', () => {
  describe('POST api/v1/centers', () => {
    it('should return error for missing name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.NO_NAME)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('name must be 1 - 50 characters');
          done();
        });
    });

    it('should return error for empty name field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.EMPTY_NAME)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('name must be 1 - 50 characters');
          done();
        });
    });

    it('should return error for missing description field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.NO_DESCRIPTION)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('description must be 1 - 1200 characters');
          done();
        });
    });

    it('should return error for empty description field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.EMPTY_DESCRIPTION)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('description must be 1 - 1200 characters');
          done();
        });
    });

    it('should return error for missing facilities field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.NO_FACILITIES)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('facilities must be 1 - 300 characters');
          done();
        });
    });

    it('should return error for empty facilities field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.EMPTY_FACILITIES)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('facilities must be 1 - 300 characters');
          done();
        });
    });

    it('should return error for invalid center cost', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.INVALID_COST)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('cost must be a positive integer');
          done();
        });
    });

    it('should return error for invalid center capacity', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.INVALID_CAPACITY)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('capacity must be a positive integer');
          done();
        });
    });

    it('should return error for missing address field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.NO_ADDRESS)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('address must be 1 - 50 characters');
          done();
        });
    });

    it('should return error for empty address field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.EMPTY_ADDRESS)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('address must be 1 - 50 characters');
          done();
        });
    });

    it('should return error for missing images field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.NO_IMAGES)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('image(s) invalid');
          done();
        });
    });

    it('should return error for empty images field', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.EMPTY_IMAGES)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('image(s) invalid');
          done();
        });
    });

    it('should return error for missing token', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers')
        .send(bodies.centerBodies.CREATE_CENTER)
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('missing token');
          done();
        });
    });

    it('should return error for unauthorized token', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.userToken}`)
        .send(bodies.centerBodies.CREATE_CENTER)
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('error').to.equal('unauthorized token');
          done();
        });
    });

    it('should return error for bad token', (done) => {
      chai
        .request(host)
        .post('/api/v1/centers?token=randomtoken')
        .send(bodies.centerBodies.CREATE_CENTER)
        .end((err, res) => {
          res.should.have.status(401);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('authentication failed');
          done();
        });
    });

    it('should add new center', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send(bodies.centerBodies.CREATE_CENTER)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('status').to.equal('success');
          res.body.center.images.length.should.equal(4);
          testHelper.setCenterId(res.body.center.id);
          done();
        });
    });

    it('should return error for duplicate center', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send(bodies.centerBodies.CREATE_CENTER)
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('error').to
            .equal('center name already exists in center address');
          done();
        });
    });

    it('should add another center', (done) => {
      chai
        .request(host)
        .post(`/api/v1/centers?token=${testHelper.adminToken}`)
        .send(bodies.centerBodies.CREATE_ANOTHER_CENTER)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.be.a('object');
          res.body.should.have.property('status').to.equal('success');
          res.body.center.images.length.should.equal(4);
          done();
        });
    });
  });

  describe('GET api/vi/centers', () => {
    it('should fetch all centers', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('centers');
          done();
        });
    });

    it('should fetch first center', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers?limit=1')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('centers');
          res.body.centers.length.should.equal(1);
          done();
        });
    });

    it('should fetch one center', (done) => {
      chai
        .request(host)
        .get(`/api/v1/centers/${testHelper.centerId}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('center');
          done();
        });
    });

    it('should return error for non esisting center', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers/0')
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('center not found');
          done();
        });
    });

    it('should return error for invalid center id', (done) => {
      chai
        .request(host)
        .get('/api/v1/centers/id')
        .end((err, res) => {
          res.should.have.status(400);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('invalid id parameter');
          done();
        });
    });
  });

  describe('PUT api/vi/centers/:id', () => {
    it('should return error for non existing center', (done) => {
      chai
        .request(host)
        .put(`/api/v1/centers/0?token=${testHelper.adminToken}`)
        .send(bodies.centerBodies.EDIT_CENTER)
        .end((err, res) => {
          res.should.have.status(404);
          res.should.be.a('object');
          res.body.should.have.property('error').equal('center not found');
          done();
        });
    });

    it('should return error for duplicate center', (done) => {
      chai
        .request(host)
        .put(`/api/v1/centers/${testHelper.centerId}?` +
          `token=${testHelper.adminToken}`)
        .send(bodies.centerBodies.CREATE_ANOTHER_CENTER)
        .end((err, res) => {
          res.should.have.status(409);
          res.should.be.a('object');
          res.body.should.have.property('error')
            .equal('center name already exists in center address');
          done();
        });
    });

    it('should edit a center', (done) => {
      chai
        .request(host)
        .put(`/api/v1/centers/${testHelper.centerId}` +
          `?token=${testHelper.adminToken}`)
        .send(bodies.centerBodies.EDIT_CENTER)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('status').to.equal('success');
          res.body.center.images.length.should.equal(1);
          done();
        });
    });
  });
});
