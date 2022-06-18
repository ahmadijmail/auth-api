'use strict';
 // destructing assignment 


const { db } = require('../src/index');
const supertest = require('supertest');
const server = require('../src/server').server;
const mockRequest = supertest(server);




// before any of the test create a connection
beforeAll(async () => {
    await db.sync();
    
  });
  afterAll(async () => {
    await db.drop();
  
  
  });

describe('Web server', () => {
    // Check if 404 is handled 

 
    // test if can create a food
    test('can add a food', async () => {
        const response = await mockRequest.post('/api/v1/food').send({
            name:'ahmad',
            calories:'ijmail',
            type:'fruit'

        });
        expect(response.status).toBe(201);
    });

 
    // test if can read
    test('can get all food', async () => {
        const response = await mockRequest.get('/api/v1/food');
        expect(response.status).toBe(200);

    });
// test read one 
    test('can get one food', async () => {
        const response = await mockRequest.get('/api/v1/food/1');
        expect(response.status).toBe(200);

    });
 
 //test update a recrod   
    test('can update a record', async () => {
        const response = await mockRequest.put('/api/v1/food/1');
        expect(response.status).toBe(201);
    });
    // test if can delete a food
    test('can delete a record', async () => {
        const response = await mockRequest.delete('/api/v1/food/1');
        expect(response.status).toBe(204);
    });
});

// after all the tests are done
afterAll(async () => {
    await db.drop();
});