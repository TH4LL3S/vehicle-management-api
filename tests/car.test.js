const request = require('supertest');
const app = require('../src/app');
const carRepository = require('../src/repositories/carRepository');

describe('Cars API', () => {
  beforeEach(() => {
    carRepository.clear();
  });
  it('should create a car', async () => {
    const response = await request(app)
      .post('/cars')
      .send({
        plate: 'ABC1D23',
        color: 'Preto',
        brand: 'Ford'
      });

    expect(response.statusCode).toBe(201);

    expect(response.body).toEqual(
      expect.objectContaining({
        plate: 'ABC1D23',
        color: 'Preto',
        brand: 'Ford'
      })
    );

    expect(response.body.id).toBeDefined();
  });

  it('should list all cars', async () => {
    const response = await request(app)
      .get('/cars');

    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should filter cars by brand', async () => {
    const response = await request(app)
      .get('/cars?brand=Ford');

    expect(response.statusCode).toBe(200);

    response.body.forEach((car) => {
      expect(car.brand.toLowerCase()).toBe('ford');
    });
  });

  it('should filter cars by color', async () => {
    const response = await request(app)
      .get('/cars?color=Preto');

    expect(response.statusCode).toBe(200);

    response.body.forEach((car) => {
      expect(car.color.toLowerCase()).toBe('preto');
    });
  });

  it('should return a car by id', async () => {
    const created = await request(app)
      .post('/cars')
      .send({
        plate: 'XYZ9A99',
        color: 'Azul',
        brand: 'Honda'
      });

    const response = await request(app)
      .get(`/cars/${created.body.id}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(created.body.id);
  });

  it('should update a car', async () => {
    const created = await request(app)
      .post('/cars')
      .send({
        plate: 'AAA1A11',
        color: 'Preto',
        brand: 'Toyota'
      });

    const response = await request(app)
      .put(`/cars/${created.body.id}`)
      .send({
        color: 'Branco'
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.color).toBe('Branco');
  });

  it('should delete a car', async () => {
    const created = await request(app)
      .post('/cars')
      .send({
        plate: 'BBB2B22',
        color: 'Verde',
        brand: 'Fiat'
      });

    const deleteResponse = await request(app)
      .delete(`/cars/${created.body.id}`);

    expect(deleteResponse.statusCode).toBe(204);

    const getResponse = await request(app)
      .get(`/cars/${created.body.id}`);

    expect(getResponse.statusCode).toBe(404);
  });

    it('should not create a car without plate', async () => {
    const response = await request(app)
      .post('/cars')
      .send({
        color: 'Preto',
        brand: 'Ford'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'Plate, color and brand are required'
    );
  });

  it('should not create a car without color', async () => {
    const response = await request(app)
      .post('/cars')
      .send({
        plate: 'ABC1D23',
        brand: 'Ford'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'Plate, color and brand are required'
    );
  });

  it('should not create a car without brand', async () => {
    const response = await request(app)
      .post('/cars')
      .send({
        plate: 'ABC1D23',
        color: 'Preto'
      });

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe(
      'Plate, color and brand are required'
    );
  });

  it('should return 404 when car does not exist', async () => {
    const response = await request(app)
      .get('/cars/non-existent-id');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Car not found');
  });

  it('should return 404 when updating a car that does not exist', async () => {
    const response = await request(app)
      .put('/cars/non-existent-id')
      .send({
        color: 'Branco'
      });

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Car not found');
  });

  it('should return 404 when deleting a car that does not exist', async () => {
    const response = await request(app)
      .delete('/cars/non-existent-id');

    expect(response.statusCode).toBe(404);
    expect(response.body.error).toBe('Car not found');
  });

  it('should filter cars by brand and color', async () => {
    await request(app)
      .post('/cars')
      .send({
        plate: 'AAA1A11',
        color: 'Preto',
        brand: 'Ford'
      });

    await request(app)
      .post('/cars')
      .send({
        plate: 'BBB2B22',
        color: 'Branco',
        brand: 'Ford'
      });

    const response = await request(app)
      .get('/cars?brand=Ford&color=Preto');

    expect(response.statusCode).toBe(200);

    expect(response.body).toHaveLength(1);
    expect(response.body[0].brand).toBe('Ford');
    expect(response.body[0].color).toBe('Preto');
  });
});