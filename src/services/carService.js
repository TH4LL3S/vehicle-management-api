const { randomUUID } = require('crypto');
const carRepository = require('../repositories/carRepository');

class CarService {
  create(data) {
    const { plate, color, brand } = data;

    if (!plate || !color || !brand) {
      const error = new Error('Plate, color and brand are required');
      error.statusCode = 400;

      throw error;
    }

    const car = {
      id: randomUUID(),
      plate,
      color,
      brand
    };

    return carRepository.create(car);
  }

  findAll(filters = {}) {
    const cars = carRepository.findAll();

    return cars.filter((car) => {
      const matchesColor =
        !filters.color ||
        car.color.toLowerCase() === filters.color.toLowerCase();

      const matchesBrand =
        !filters.brand ||
        car.brand.toLowerCase() === filters.brand.toLowerCase();

      return matchesColor && matchesBrand;
    });
  }

  findById(id) {
    const car = carRepository.findById(id);

    if (!car) {
      const error = new Error('Car not found');
      error.statusCode = 404;

      throw error;
    }

    return car;
  }

  update(id, data) {
    this.findById(id);

    const allowedFields = ['plate', 'color', 'brand'];

    const updateData = Object.fromEntries(
      Object.entries(data).filter(([key]) =>
        allowedFields.includes(key)
      )
    );

    return carRepository.update(id, updateData);
  }

  delete(id) {
    this.findById(id);

    carRepository.delete(id);
  }
}

module.exports = new CarService();