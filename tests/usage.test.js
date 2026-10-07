const request = require('supertest');
const app = require('../src/app');

const carRepository = require('../src/repositories/carRepository');
const driverRepository = require('../src/repositories/driverRepository');
const usageRepository = require('../src/repositories/usageRepository');

describe('Usages API', () => {
    beforeEach(() => {
        carRepository.clear();
        driverRepository.clear();
        usageRepository.clear();
    });

    async function createCar(data = {}) {
        const response = await request(app)
            .post('/cars')
            .send({
                plate: 'ABC1D23',
                color: 'Preto',
                brand: 'Ford',
                ...data
            });

        return response.body;
    }

    async function createDriver(data = {}) {
        const response = await request(app)
            .post('/drivers')
            .send({
                name: 'João da Silva',
                ...data
            });

        return response.body;
    }

    async function createUsage(carId, driverId, data = {}) {
        return request(app)
            .post('/usages')
            .send({
                carId,
                driverId,
                reason: 'Visita ao cliente',
                ...data
            });
    }

    it('should create a usage', async () => {
        const car = await createCar();
        const driver = await createDriver();

        const response = await createUsage(
            car.id,
            driver.id
        );

        expect(response.statusCode).toBe(201);

        expect(response.body).toEqual(
            expect.objectContaining({
                carId: car.id,
                driverId: driver.id,
                reason: 'Visita ao cliente',
                endDate: null
            })
        );

        expect(response.body.id).toBeDefined();
        expect(response.body.startDate).toBeDefined();
    });

    it('should create a usage with a provided start date', async () => {
        const car = await createCar();
        const driver = await createDriver();

        const startDate = '2026-10-06T10:00:00.000Z';

        const response = await createUsage(
            car.id,
            driver.id,
            { startDate }
        );

        expect(response.statusCode).toBe(201);
        expect(response.body.startDate).toBe(startDate);
    });

    it('should not create usage without car', async () => {
        const driver = await createDriver();

        const response = await request(app)
            .post('/usages')
            .send({
                driverId: driver.id,
                reason: 'Visita ao cliente'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(
            'Car, driver and reason are required'
        );
    });

    it('should not create usage without driver', async () => {
        const car = await createCar();

        const response = await request(app)
            .post('/usages')
            .send({
                carId: car.id,
                reason: 'Visita ao cliente'
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(
            'Car, driver and reason are required'
        );
    });

    it('should not create usage without reason', async () => {
        const car = await createCar();
        const driver = await createDriver();

        const response = await request(app)
            .post('/usages')
            .send({
                carId: car.id,
                driverId: driver.id
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe(
            'Car, driver and reason are required'
        );
    });

    it('should not create usage with a non-existent car', async () => {
        const driver = await createDriver();

        const response = await createUsage(
            'non-existent-car',
            driver.id
        );

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Car not found');
    });

    it('should not create usage with a non-existent driver', async () => {
        const car = await createCar();

        const response = await createUsage(
            car.id,
            'non-existent-driver'
        );

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Driver not found');
    });

    it('should not allow a car to be used by two drivers at the same time', async () => {
        const car = await createCar();

        const driver1 = await createDriver({
            name: 'João'
        });

        const driver2 = await createDriver({
            name: 'Maria'
        });

        const firstUsage = await createUsage(
            car.id,
            driver1.id
        );

        expect(firstUsage.statusCode).toBe(201);

        const secondUsage = await createUsage(
            car.id,
            driver2.id
        );

        expect(secondUsage.statusCode).toBe(409);
        expect(secondUsage.body.error).toBe(
            'Car is already being used'
        );
    });

    it('should not allow a driver to use two cars at the same time', async () => {
        const car1 = await createCar({
            plate: 'AAA1A11'
        });

        const car2 = await createCar({
            plate: 'BBB2B22'
        });

        const driver = await createDriver();

        const firstUsage = await createUsage(
            car1.id,
            driver.id
        );

        expect(firstUsage.statusCode).toBe(201);

        const secondUsage = await createUsage(
            car2.id,
            driver.id
        );

        expect(secondUsage.statusCode).toBe(409);
        expect(secondUsage.body.error).toBe(
            'Driver is already using a car'
        );
    });

    it('should finish an active usage', async () => {
        const car = await createCar();
        const driver = await createDriver();

        const created = await createUsage(
            car.id,
            driver.id
        );

        const response = await request(app)
            .put(`/usages/${created.body.id}/finish`);

        expect(response.statusCode).toBe(200);
        expect(response.body.endDate).toBeDefined();
        expect(response.body.endDate).not.toBeNull();
    });

    it('should return 404 when usage does not exist', async () => {
        const response = await request(app)
            .put('/usages/non-existent-id/finish');

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(
            'Usage not found'
        );
    });

    it('should not finish the same usage twice', async () => {
        const car = await createCar();
        const driver = await createDriver();

        const created = await createUsage(
            car.id,
            driver.id
        );

        await request(app)
            .put(`/usages/${created.body.id}/finish`);

        const response = await request(app)
            .put(`/usages/${created.body.id}/finish`);

        expect(response.statusCode).toBe(409);
        expect(response.body.error).toBe(
            'Usage has already been finished'
        );
    });

    it('should allow the car to be used again after finishing the previous usage', async () => {
        const car = await createCar();

        const driver1 = await createDriver({
            name: 'João'
        });

        const driver2 = await createDriver({
            name: 'Maria'
        });

        const firstUsage = await createUsage(
            car.id,
            driver1.id
        );

        await request(app)
            .put(`/usages/${firstUsage.body.id}/finish`);

        const secondUsage = await createUsage(
            car.id,
            driver2.id
        );

        expect(secondUsage.statusCode).toBe(201);
    });

    it('should allow the driver to use another car after finishing the previous usage', async () => {
        const car1 = await createCar({
            plate: 'AAA1A11'
        });

        const car2 = await createCar({
            plate: 'BBB2B22'
        });

        const driver = await createDriver();

        const firstUsage = await createUsage(
            car1.id,
            driver.id
        );

        await request(app)
            .put(`/usages/${firstUsage.body.id}/finish`);

        const secondUsage = await createUsage(
            car2.id,
            driver.id
        );

        expect(secondUsage.statusCode).toBe(201);
    });

    it('should list usages', async () => {
        const car = await createCar();
        const driver = await createDriver();

        await createUsage(
            car.id,
            driver.id
        );

        const response = await request(app)
            .get('/usages');

        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toHaveLength(1);
    });

    it('should find a usage by id', async () => {
        const car = await createCar();
        const driver = await createDriver();

        const created = await createUsage(
            car.id,
            driver.id
        );

        const response = await request(app)
            .get(`/usages/${created.body.id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.id).toBe(created.body.id);
    });

    it('should return 404 when finding a non-existent usage', async () => {
        const response = await request(app)
            .get('/usages/non-existent-id');

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe(
            'Usage not found'
        );
    });

    test('should list usages with driver name and car information', async () => {
        const driverResponse = await request(app)
            .post('/drivers')
            .send({
                name: 'João Silva'
            });

        const carResponse = await request(app)
            .post('/cars')
            .send({
                plate: 'ABC-1234',
                color: 'Preto',
                brand: 'Toyota'
            });

        await request(app)
            .post('/usages')
            .send({
                driverId: driverResponse.body.id,
                carId: carResponse.body.id,
                reason: 'Visita ao cliente'
            });

        const response = await request(app)
            .get('/usages')
            .expect(200);

        expect(response.body).toHaveLength(1);

        expect(response.body[0]).toEqual(
            expect.objectContaining({
                reason: 'Visita ao cliente',
                driver: {
                    id: driverResponse.body.id,
                    name: 'João Silva'
                },
                car: {
                    id: carResponse.body.id,
                    plate: 'ABC-1234',
                    color: 'Preto',
                    brand: 'Toyota'
                }
            })
        );
    });
});