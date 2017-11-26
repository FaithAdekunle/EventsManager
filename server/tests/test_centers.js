/* eslint-disable import/no-extraneous-dependencies */

import chai from 'chai';
import chaiHttp from 'chai-http';
import { readFileSync } from 'fs';

chai.use(chaiHttp);
chai.should();
const host = 'andela-events-manager.herokuapp.com';


describe('Tests for local Centers API', () => {
  let centerId;

  describe('Add new center', () => {
    it('should return a status 200 error response for any missing field', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for no images', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for invalid center cost', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 'cost')
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed');
          done();
        });
    });

    it('should return a status 200 error response for invalid center capacity', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', -450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Invalid details. Only positive integers allowed');
          done();
        });
    });

    it('should return a status 200 error response for empty name string', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', '')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for empty description string', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', '')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for empty address string', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', '')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for empty facilities string', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', '')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 success response for valid post request', (done) => {
      chai
        .request(host)
        .post('/centers/')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.all.keys(['id', 'name', 'description', 'address', 'facilities', 'capacity', 'cost', 'images']);
          centerId = res.body.id;
          done();
        });
    });
  });

  describe('Modify existing center', () => {
    it('should return a status 200 error response for any missing field', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for fake center id', (done) => {
      chai
        .request(host)
        .put('/centers/fakeid')
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center not found');
          done();
        });
    });


    it('should return a status 200 error response for empty name string', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}`)
        .field('name', '')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for empty description string', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}`)
        .field('name', 'The Conference center')
        .field('description', '')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for empty address string', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}`)
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', '')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 error response for empty facilities string', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}`)
        .field('name', 'The Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', '')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('Incomplete details');
          done();
        });
    });

    it('should return a status 200 success response for valid put request', (done) => {
      chai
        .request(host)
        .put(`/centers/${centerId}`)
        .field('name', 'The NEW Conference center')
        .field('description', 'This is the description for this center')
        .field('address', 'This is the address for this center')
        .field('facilities', 'This, is, the, address, for, this, center')
        .field('capacity', 450)
        .field('cost', 300000)
        .attach('images', readFileSync('./server/public/images/pp.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ss.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/wd.jpg'), 'image.jpg')
        .attach('images', readFileSync('./server/public/images/ws.jpg'), 'image.jpg')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('name').equal('The NEW Conference center');
          res.body.should.have.all.keys(['id', 'name', 'description', 'address', 'facilities', 'capacity', 'cost', 'images']);
          done();
        });
    });
  });

  describe('Fetch all centers', () => {
    it('should return a status 200 success response for valid get request', (done) => {
      chai
        .request(host)
        .get('/centers/')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body[0].should.have.all.keys(['id', 'name', 'description', 'address', 'facilities', 'capacity', 'cost', 'images']);
          done();
        });
    });
  });

  describe('Fetch one center', () => {
    it('should return a status 200 error response for fake center id', (done) => {
      chai
        .request(host)
        .get('/centers/fakeid')
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.property('err').equal('center not found');
          done();
        });
    });

    it('should return a status 200 success response for valid get request', (done) => {
      chai
        .request(host)
        .get(`/centers/${centerId}`)
        .end((err, res) => {
          if (err) done(err);
          res.should.have.status(200);
          res.should.be.a('object');
          res.body.should.have.all.keys(['name', 'description', 'address', 'facilities', 'capacity', 'cost', 'images']);
          done();
        });
    });
  });
});

