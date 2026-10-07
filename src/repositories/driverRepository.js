const drivers = [];

class DriverRepository {
  create(driver) {
    drivers.push(driver);

    return driver;
  }

  findAll() {
    return drivers;
  }

  findById(id) {
    return drivers.find((driver) => driver.id === id);
  }

  update(id, data) {
    const driver = this.findById(id);

    if (!driver) {
      return null;
    }

    Object.assign(driver, data);

    return driver;
  }

  delete(id) {
    const index = drivers.findIndex((driver) => driver.id === id);

    if (index === -1) {
      return false;
    }

    drivers.splice(index, 1);

    return true;
  }

  clear() {
    drivers.length = 0;
  }
}

module.exports = new DriverRepository();