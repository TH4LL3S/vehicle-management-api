const cars = [];

class CarRepository {
  create(car) {
    cars.push(car);

    return car;
  }

  findAll() {
    return cars;
  }

  findById(id) {
    return cars.find((car) => car.id === id);
  }

  update(id, data) {
    const car = this.findById(id);

    if (!car) {
      return null;
    }

    Object.assign(car, data);

    return car;
  }

  delete(id) {
    const index = cars.findIndex((car) => car.id === id);

    if (index === -1) {
      return false;
    }

    cars.splice(index, 1);

    return true;
  }

    clear() {
    cars.length = 0;
  }
}

module.exports = new CarRepository();