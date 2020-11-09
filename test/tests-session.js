const request = require('supertest');
const mongoose = require('mongoose');
const mocks = require('./mocks');
const bcrypt = require('bcrypt');

const { expect } = require('chai');

describe('Session Server:', function () {
  const sessionServer = require('../server/server-session');
  const agent = request.agent(sessionServer);
  const User = mongoose.connection.model('User');

  afterEach(async () => {
    try {
      await mongoose.connection.dropCollection('users');
    } catch (error) {
      return true;
    }
  });

  after(async () => {
    sessionServer.close();
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  describe('Invalid endpoints:', () =>{
    it('should return a status 404 when accessing an invalid endpoint', (done) => {
      request(sessionServer)
        .get(mocks.mockURL)
        .expect(404)
        .end(done);
    });
  });

  describe('Endpoint "/register":', () => {
    it('should create a new user', (done) => {
      request(sessionServer)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(mocks.mockUser1)
        .expect(201)
        .end(() => {
          User.find((err, users) => {
            expect(users.length).to.equal(1);
            done();
          });
        });
    });

    it('should store a bcrypt hashed password', (done) => {
      request(sessionServer)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(mocks.mockUser1)
        .end(() => {
          User.find((err, users) => {
            expect(users[0].password).to.not.equal(mocks.mockUser1.password);
            expect(bcrypt.compareSync(mocks.mockUser1.password, users[0].password)).to.equal(true);
            done();
          });
        });
    });

    it('should return an error when creating a user without an email', (done) => {
      request(sessionServer)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(mocks.mockIncompleteUser1)
        .expect((res)=> {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should return an error when creating a user without a password', (done) => {
      request(sessionServer)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(mocks.mockIncompleteUser2)
        .expect((res)=> {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should return an error when creating a user without first name', (done) => {
      request(sessionServer)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(mocks.mockIncompleteUser3)
        .expect((res)=> {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should return an error when creating a user without last name', (done) => {
      request(sessionServer)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(mocks.mockIncompleteUser4)
        .expect((res)=> {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('Each user should store their own specific password', (done) => {
      request(sessionServer)
        .post('/register')
        .set('Content-Type', 'application/json')
        .send(mocks.mockUser1)
        .end(() => {
          request(sessionServer)
            .post('/register')
            .set('Content-Type', 'application/json')
            .send(mocks.mockUser2)
            .end(() => {
              User.find((err, users) => {
                expect(users[0].password).to.not.equal(mocks.mockUser1.password);
                expect(users[0].password).to.not.equal(users[1].password);
                done();
              });
            });
        });
    });

    it('Should not create the same user twice', (done)=> {
      User.create(mocks.mockUser1).then(() => {
        request(sessionServer)
          .post('/register')
          .set('Content-Type', 'application/json')
          .send(mocks.mockUser1)
          .expect((res) => {
            expect(res.status).to.be.at.least(400);
          })
          .end(() => {
            User.find((err, users) => {
              expect(users.length).to.equal(1);
              done();
            });
          });
      });
    });
  });

  describe('Endpoint "/login":', () => {
    beforeEach(async () => {
      const hash = await bcrypt.hash(mocks.mockUser1.password, 10);
      await User.create({ ...mocks.mockUser1, password: hash});
    });

    it('should accept an email & password and return the user object', (done) => {
      request(sessionServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ email: mocks.mockUser1.email, password: mocks.mockUser1.password })
        .expect(200)
        .end(done);
    });

    it('should return an error when trying to login with the wrong credentials', (done) => {
      request(sessionServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ email: mocks.mockUser1.email, password: mocks.mockUser2.password })
        .expect((res) => {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should return an error when missing the email', (done) => {
      request(sessionServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ email: '', password: mocks.mockUser1.password })
        .expect((res) => {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should return an error when missing the password', (done) => {
      request(sessionServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ email: mocks.mockUser1.email, password: '' })
        .expect((res) => {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should return a session cookie on successful login', (done) => {
      request(sessionServer)
        .post('/login')
        .set('Content-Type', 'application/json')
        .send({ email: mocks.mockUser1.email, password: mocks.mockUser1.password })
        .expect(200)
        .expect('set-cookie', /sid=/)
        .end(done);
    });
  });

  describe('Endpoint "/me":', () => {
    beforeEach((done) => {
      User.create({ ...mocks.mockUser1, password: bcrypt.hashSync(mocks.mockUser1.password, 10)})
        .then(() => {
          agent
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({ email: mocks.mockUser1.email, password: mocks.mockUser1.password })
            .end(done);
        });
    });

    it('should deny entry to non-authorised users', (done) => {
      request(sessionServer)
        .get('/me')
        .expect((res) => {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should allow entry when a session cookie is provided', (done) => {
      agent
        .get('/me')
        .expect(200)
        .end(done);
    });
  });

  describe('Endpoint "/logout":', () => {
    beforeEach((done) => {
      User.create({ ...mocks.mockUser1, password: bcrypt.hashSync(mocks.mockUser1.password, 10)})
        .then(() => {
          agent
            .post('/login')
            .set('Content-Type', 'application/json')
            .send({ email: mocks.mockUser1.email, password: mocks.mockUser1.password })
            .end(done);
        });
    });

    it('should deny entry to non-authorised users', (done) => {
      request(sessionServer)
        .get('/logout')
        .expect((res) => {
          expect(res.status).to.be.at.least(400);
        })
        .end(done);
    });

    it('should destroy the session when requested by an authorised user', (done) => {
      agent
        .post('/logout')
        .expect(200)
        .expect('set-cookie', /Expires=Thu, 01 Jan 1970 00:00:00 GMT/)
        .end(() => {
          agent
            .post('/logout')
            .expect((res) => {
              expect(res.status).to.be.at.least(400);
            })
            .end(done);
        });
    });
  });
});
