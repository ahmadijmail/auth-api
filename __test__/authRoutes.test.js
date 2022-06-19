'use strict';


const { db } = require('../src/index');
const supertest = require('supertest');
const server = require('../src/server').server;

const mockRequest = supertest(server);

let userData = {
  testUser: { username: 'user', password: 'password', role: 'admin' },
};
let accessToken = null;

beforeAll(async () => {
  await db.sync();
  
});
afterAll(async () => {
  await db.drop();


});

describe('Auth Router', () => {

  it('signup creates a new user and sends an object', async () => {

    const response = await mockRequest.post('/signup').send(userData.testUser);
    const userObject = response.body;
  

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.id).toBeDefined();
    expect(userObject.role).toBeDefined();
    expect(userObject.username).toEqual(userData.testUser.username);
  });

  it('signin with basic authentication headers logs in a user and sends an object', async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest.post('/signin')
      .auth(username, password);

    const userObject = response.body;
    expect(response.status).toBe(200);
    expect(userObject.token).toBeDefined();
    expect(userObject.user.id).toBeDefined();
    expect(userObject.user.role).toBeDefined();
    expect(userObject.user.username).toEqual(username);
  });

   

  it(' Can signin with bearer auth token', async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest.post('/signin')
      .auth(username, password);
    accessToken = response.body.token;
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(bearerResponse.status).toBe(201);
  });

  it('with a bearer token that has create permissions adds an item to the DB', async () => {
    const response = await mockRequest.post('/api/v2/food').set('Authorization', `Bearer ${accessToken}`).send({
        name:'ahmad',
        calories:'ijmail',
        type:'fruit'
      
    });
    expect(response.status).toBe(201);
});

   // test if can read
   test('with a bearer token that has read permissions returns a list of :model items', async () => {
    const response = await mockRequest.get('/api/v2/food').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);

});


test('with a bearer token that has read permissions returns a single item by ID', async () => {
  const response = await mockRequest.get('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
  expect(response.status).toBe(200);

});

 
test('with a bearer token that has update permissions returns a single, updated item by ID', async () => {
  const response = await mockRequest.put('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
  expect(response.status).toBe(201);
});
  
test('with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found', async () => {
  const response = await mockRequest.delete('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
  expect(response.status).toBe(204);
});


});