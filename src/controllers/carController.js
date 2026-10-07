const carService = require('../services/carService');

class CarController {
  create(req, res, next) {
    try {
      const car = carService.create(req.body);

      return res.status(201).json(car);
    } catch (error) {
      next(error);
    }
  }

  findAll(req, res, next) {
    try {
      const cars = carService.findAll(req.query);

      return res.status(200).json(cars);
    } catch (error) {
      next(error);
    }
  }

  findById(req, res, next) {
    try {
      const car = carService.findById(req.params.id);

      return res.status(200).json(car);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const car = carService.update(
        req.params.id,
        req.body
      );

      return res.status(200).json(car);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      carService.delete(req.params.id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CarController();