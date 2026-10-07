const { randomUUID } = require('crypto');

const usageRepository = require('../repositories/usageRepository');
const carRepository = require('../repositories/carRepository');
const driverRepository = require('../repositories/driverRepository');

class UsageService {
    create(data) {
        const {
            carId,
            driverId,
            reason,
            startDate
        } = data;

        if (!carId || !driverId || !reason) {
            const error = new Error(
                'Car, driver and reason are required'
            );

            error.statusCode = 400;

            throw error;
        }

        const car = carRepository.findById(carId);

        if (!car) {
            const error = new Error('Car not found');

            error.statusCode = 404;

            throw error;
        }

        const driver = driverRepository.findById(driverId);

        if (!driver) {
            const error = new Error('Driver not found');

            error.statusCode = 404;

            throw error;
        }

        const activeCarUsage =
            usageRepository.findActiveByCarId(carId);

        if (activeCarUsage) {
            const error = new Error(
                'Car is already being used'
            );

            error.statusCode = 409;

            throw error;
        }

        const activeDriverUsage =
            usageRepository.findActiveByDriverId(driverId);

        if (activeDriverUsage) {
            const error = new Error(
                'Driver is already using a car'
            );

            error.statusCode = 409;

            throw error;
        }

        const usage = {
            id: randomUUID(),
            startDate: startDate || new Date().toISOString(),
            endDate: null,
            driverId,
            carId,
            reason
        };

        return usageRepository.create(usage);
    }

    finish(id) {
        const usage = usageRepository.findById(id);

        if (!usage) {
            const error = new Error('Usage not found');

            error.statusCode = 404;

            throw error;
        }

        if (usage.endDate !== null) {
            const error = new Error(
                'Usage has already been finished'
            );

            error.statusCode = 409;

            throw error;
        }

        return usageRepository.update(id, {
            endDate: new Date().toISOString()
        });
    }

    findAll() {
        const usages = usageRepository.findAll();

        return usages.map((usage) => {
            const car = carRepository.findById(usage.carId);
            const driver = driverRepository.findById(usage.driverId);

            return {
                id: usage.id,
                startDate: usage.startDate,
                endDate: usage.endDate,
                reason: usage.reason,
                driver: driver
                    ? {
                        id: driver.id,
                        name: driver.name
                    }
                    : null,
                car: car
                    ? {
                        id: car.id,
                        plate: car.plate,
                        color: car.color,
                        brand: car.brand
                    }
                    : null
            };
        });
    }

    findById(id) {
        const usage = usageRepository.findById(id);

        if (!usage) {
            const error = new Error('Usage not found');

            error.statusCode = 404;

            throw error;
        }

        return usage;
    }
}

module.exports = new UsageService();