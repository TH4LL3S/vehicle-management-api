const request = require('supertest');
const app = require('../src/app');
const driverRepository = require('../src/repositories/driverRepository');

describe('Drivers API', () => {
  beforeEach(() => {
    driverRepository.clear();
  });

  it('should create a driver', async () => {
    const response = await request(app)
      .post('/drivers')
      .send({
        name: 'João da Silva'
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'João da Silva'
      })
    );

    expect(response.body.id).toBeDefined();
  });

  it('should list all drivers', async () => {
    await request(app)
      .post('/drivers')
      .send({
        name: 'João da Silva'
      });

    const response = await request(app)
      .get('/drivers');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toHaveLength(1);
  });

  it('should filter drivers by name', async () => {
    await request(app)
      .post('/drivers')
      .send({
        name: 'João da Silva'
      });

    await request(app)
      .post('/drivers')
      .send({
        name: 'Maria Souza'
      });

    const response = await request(app)
      .get('/drivers?name=joão');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('João da Silva');
  });

  it('should return a driver by id', async () => {
    const created = await request(app)
      .post('/drivers')
      .send({
        name: 'João da Silva'
      });

    const response = await request(app)
      .get(`/drivers/${created.body.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });

  it('should update a driver', async () => {
    const created = await request(app)
      .post('/drivers')
      .send({
        name: 'João da Silva'
      });

    const response = await request(app)
      .put(`/drivers/${created.body.id}`)
      .send({
        name: 'João Santos'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.name).toBe('João Santos');
  });

  it('should delete a driver', async () => {
    const created = await request(app)
      .post('/drivers')
      .send({
        name: 'João da Silva'
      });

    const deleteResponse = await request(app)
      .delete(`/drivers/${created.body.id}`);

    expect(deleteResponse.statusCode).toBe(204);

    const getResponse = await request(app)
      .get(`/drivers/${created.body.id}`);

    expect(getResponse.statusCode).toBe(404);
  });

  it('should not create a driver without name', async () => {
    const response = await request(app)
      .post('/drivers')
      .send({});

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Name is required');
  });

  it('should return 404 when driver does not exist', async () => {
    const response = await request(app)
      .get('/drivers/non-existent-id');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Driver not found');
  });

  it('should return 404 when updating a driver that does not exist', async () => {
    const response = await request(app)
      .put('/drivers/non-existent-id')
      .send({
        name: 'João'
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Driver not found');
  });

  it('should return 404 when deleting a driver that does not exist', async () => {
    const response = await request(app)
      .delete('/drivers/non-existent-id');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Driver not found');
  });
});