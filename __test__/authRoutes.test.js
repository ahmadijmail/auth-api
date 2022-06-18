'use strict';

process.env.SECRET = "TEST_SECRET";


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

  it('creates a new user and sends an object with the user and the token to the client', async () => {

    const response = await mockRequest.post('/signup').send(userData.testUser);
    const userObject = response.body;
  

    expect(response.status).toBe(201);
    expect(userObject.token).toBeDefined();
    expect(userObject.id).toBeDefined();
    expect(userObject.role).toBeDefined();
    expect(userObject.username).toEqual(userData.testUser.username);
  });

  it('signin with basic authentication headers logs in a user and sends an object with the user and the token to the client', async () => {
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

   

  it('3 Can signin with bearer auth token', async () => {
    let { username, password } = userData.testUser;

    const response = await mockRequest.post('/signin')
      .auth(username, password);
    accessToken = response.body.token;
    const bearerResponse = await mockRequest
      .get('/users')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(bearerResponse.status).toBe(201);
  });

  it('can add a food', async () => {
    const response = await mockRequest.post('/api/v2/food').set('Authorization', `Bearer ${accessToken}`).send({
        name:'ahmad',
        calories:'ijmail',
        type:'fruit'
      
    });
    expect(response.status).toBe(201);
});

   // test if can read
   test('can get all food', async () => {
    const response = await mockRequest.get('/api/v2/food').set('Authorization', `Bearer ${accessToken}`);
    expect(response.status).toBe(200);

});


test('can get one food', async () => {
  const response = await mockRequest.get('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
  expect(response.status).toBe(200);

});

 
test('can update a record', async () => {
  const response = await mockRequest.put('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
  expect(response.status).toBe(201);
});
  
test('can delete a record', async () => {
  const response = await mockRequest.delete('/api/v2/food/1').set('Authorization', `Bearer ${accessToken}`);
  expect(response.status).toBe(204);
});




  // it('4 basic fails with known user and wrong password ', async () => {

  //   const response = await mockRequest.post('/signin')
  //     .auth('admin', 'xyz')
  //   const { user, token } = response.body;

  //   expect(response.status).toBe(403);
  //   expect(response.text).toEqual("Invalid Login");
  //   expect(user).not.toBeDefined();
  //   expect(token).not.toBeDefined();
  // });

  // it('5 basic fails with unknown user', async () => {

  //   const response = await mockRequest.post('/signin')
  //     .auth('nobody', 'xyz')
  //   const { user, token } = response.body;

  //   expect(response.status).toBe(403);
  //   expect(response.text).toEqual("Invalid Login");
  //   expect(user).not.toBeDefined();
  //   expect(token).not.toBeDefined();
  // });

  // it('6 bearer fails with an invalid token', async () => {

  //   // First, use basic to login to get a token
  //   const response = await mockRequest.get('/users')
  //     .set('Authorization', `Bearer foobar`)
  //   const userList = response.body;

  //   // Not checking the value of the response, only that we "got in"
  //   expect(response.status).toBe(500);
  //   expect(userList.length).toBeFalsy();
  // });

  // it('7 Succeeds with a valid token', async () => {

  //   const response = await mockRequest.get('/users')
  //     .set('Authorization', `Bearer ${accessToken}`);

  //   expect(response.status).toBe(201);
  //   expect(response.body).toBeTruthy();
  //   expect(response.body).toEqual(expect.anything());
  // });

  // it('8 Secret Route fails with invalid token', async () => {
  //   const validToken='dsugcsjmhtcvbmjhxj2hmgv mahgv'
  //   const response =await  mockRequest.get('/secret')
  //     .set('Authorization', `x ${validToken}`);
 

  //   expect(response.status).toBe(500);
  
  // },20000);
});