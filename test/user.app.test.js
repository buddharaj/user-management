import request from 'supertest';
import makeApp from '../app.js'
import { jest } from '@jest/globals'
import userdata from './user.json'
import { generateToken } from '../src/middleware/auth.js';


const checkUserById = jest.fn()
const checkUserByEmail = jest.fn()
const getUserByEmail = jest.fn()
const getUserById = jest.fn()
const deleteUserById = jest.fn()
const getUserAll = jest.fn()
const createUser = jest.fn()
const updateUser = jest.fn()
const database = {
  checkUserById,
  checkUserByEmail,
  getUserByEmail,
  getUserById,
  deleteUserById,
  getUserAll,
  createUser,
  updateUser
}
const app = makeApp(database)

const BASE_URL = "/v1/user"

describe('POST /v1/user - create user', function() {
    beforeEach(() => {
      getUserById.mockReset()
      checkUserByEmail.mockReset()
      checkUserByEmail.mockResolvedValue({rowCount:0})
      createUser.mockReset()
      createUser.mockReturnValueOnce({insertId:1})
    })

    it('Should successfully create a admin user', async () => {
        const response = await request(app)
        .post(BASE_URL)
        .send({
          name: userdata[0].name,
          password: userdata[0].password,
          email: userdata[0].email,
          role: userdata[0].role
        })
        .set('Accept', 'application/json')
      expect(response.status).toEqual(201);
      expect(response.body.id).toEqual(1);
    });

    it('Should successfully create a user ', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          name: userdata[1].name,
          password: userdata[1].password,
          email: userdata[1].email,
          role: userdata[1].role
        })
        .set('Accept', 'application/json')
      expect(response.status).toEqual(201);
      expect(response.body.id).toEqual(1);
    });

    it('Should NOT create a user for empty body', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send()
        .set('Accept', 'application/json')
      expect(response.status).toEqual(400);
    });
    it('Should NOT create a user for invalid input', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send(userdata[2])
        .set('Accept', 'application/json')
      expect(response.status).toEqual(400);
    });

    it('Should NOT create a user for missing input', async () => {
      const response = await request(app)
        .post(BASE_URL)
        .send({
          
        })
        .set('Accept', 'application/json')
      expect(response.status).toEqual(400);
    });
});

describe('GET /v1/user/:userId - get user', () => {
  let adminAccessToken;
  let userAccessToken;
  
  beforeEach(async () => {
    jest.resetModules();
    jest.setTimeout(60000);
    adminAccessToken = generateToken({
      id: userdata[0].id,
      name: userdata[0].name,
      email: userdata[0].email,
      role: userdata[0].role
    })
   userAccessToken = generateToken({
    id: userdata[1].id,
    name: userdata[1].name,
    email: userdata[1].email,
    role: userdata[1].role
    })

    getUserById.mockReset()
    getUserById.mockResolvedValue([{
      id: userdata[0].id,
      name: userdata[0].name,
      email: userdata[0].email,
      role: userdata[0].role
    }])
  })
  it('Should get user by id for Admin ', async () => {
      const response = await request(app)
      .get(BASE_URL + '/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccessToken}`)
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('email');
    expect(response.body.email).toEqual(userdata[0].email)
  });

  it('Should able to view own details - user', async () => {
    getUserById.mockResolvedValue([{
      id: userdata[1].id,
      name: userdata[1].name,
      email: userdata[1].email,
      role: userdata[1].role
    }])
    const response = await request(app)
      .get(BASE_URL + '/2')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('email');
    expect(response.body.email).toEqual(userdata[1].email)
  });
  it('Should NOT able to view others details - user', async () => {
    const response = await request(app)
      .get(BASE_URL + '/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
    expect(response.status).toEqual(401);
  });
});

describe('UPDATE /v1/user/:userId - update user', () => {
  let adminAccessToken;
  let userAccessToken;
  
  beforeEach(async () => {
    jest.resetModules();
    jest.setTimeout(60000);
    adminAccessToken = generateToken({
      id: userdata[0].id,
      name: userdata[0].name,
      email: userdata[0].email,
      role: userdata[0].role
    })
   userAccessToken = generateToken({
    id: userdata[1].id,
    name: userdata[1].name,
    email: userdata[1].email,
    role: userdata[1].role
    })
    checkUserById.mockReset()
    checkUserById.mockResolvedValue({rowCount: 1})
    updateUser.mockReset()
    updateUser.mockResolvedValue({rowAffected: 1})
  })
  it('Should update a user by id for Admin ', async () => {
      const response = await request(app)
      .put(BASE_URL + '/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccessToken}`)
    expect(response.status).toEqual(200);
  });

  it('Should update own details by user ', async () => {
    const response = await request(app)
      .put(BASE_URL + '/2')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
    expect(response.status).toEqual(200);
  });
  it('Should NOT update others details by user ', async () => {
    const response = await request(app)
      .put(BASE_URL + '/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
    expect(response.status).toEqual(401);
  });
});

describe('DELETE /v1/user/:userId - delete user', () => {
  let adminAccessToken;
  let userAccessToken;
  
  beforeEach(async () => {
    jest.resetModules();
    jest.setTimeout(60000);
    adminAccessToken = generateToken({
      id: userdata[0].id,
      name: userdata[0].name,
      email: userdata[0].email,
      role: userdata[0].role
    })
   userAccessToken = generateToken({
    id: userdata[1].id,
    name: userdata[1].name,
    email: userdata[1].email,
    role: userdata[1].role
    })
    checkUserById.mockReset()
    checkUserById.mockResolvedValue({rowCount: 1})
    deleteUserById.mockReset()
    deleteUserById.mockResolvedValue({rowAffected: 1})
  })
  it('Should delete a user by Admin ', async () => {
      const response = await request(app)
      .delete(BASE_URL + '/2')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccessToken}`)
    expect(response.status).toEqual(200);
  });
  it('Should NOT delete a user by user ', async () => {
    const response = await request(app)
      .delete(BASE_URL + '/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${userAccessToken}`)
    expect(response.status).toEqual(401);
  });
  it('Should NOT delete byself by Admin ', async () => {
    const response = await request(app)
      .delete(BASE_URL + '/1')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccessToken}`)
    expect(response.status).toEqual(401);
  });
});