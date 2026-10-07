const { randomUUID } = require('crypto');
const driverRepository = require('../repositories/driverRepository');

class DriverService {
  create(data) {
    const { name } = data;

    if (!name) {
      const error = new Error('Name is required');
      error.statusCode = 400;

      throw error;
    }

    const driver = {
      id: randomUUID(),
      name
    };

    return driverRepository.create(driver);
  }

  findAll(filters = {}) {
    const drivers = driverRepository.findAll();

    return drivers.filter((driver) => {
      if (!filters.name) {
        return true;
      }

      return driver.name
        .toLowerCase()
        .includes(filters.name.toLowerCase());
    });
  }

  findById(id) {
    const driver = driverRepository.findById(id);

    if (!driver) {
      const error = new Error('Driver not found');
      error.statusCode = 404;

      throw error;
    }

    return driver;
  }

  update(id, data) {
    this.findById(id);

    const updateData = {};

    if (data.name !== undefined) {
      if (!data.name) {
        const error = new Error('Name is required');
        error.statusCode = 400;

        throw error;
      }

      updateData.name = data.name;
    }

    return driverRepository.update(id, updateData);
  }

  delete(id) {
    this.findById(id);

    driverRepository.delete(id);
  }
}

module.exports = new DriverService();