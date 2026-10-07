const driverService = require('../services/driverService');

class DriverController {
  create(req, res, next) {
    try {
      const driver = driverService.create(req.body);

      return res.status(201).json(driver);
    } catch (error) {
      next(error);
    }
  }

  findAll(req, res, next) {
    try {
      const drivers = driverService.findAll(req.query);

      return res.status(200).json(drivers);
    } catch (error) {
      next(error);
    }
  }

  findById(req, res, next) {
    try {
      const driver = driverService.findById(req.params.id);

      return res.status(200).json(driver);
    } catch (error) {
      next(error);
    }
  }

  update(req, res, next) {
    try {
      const driver = driverService.update(
        req.params.id,
        req.body
      );

      return res.status(200).json(driver);
    } catch (error) {
      next(error);
    }
  }

  delete(req, res, next) {
    try {
      driverService.delete(req.params.id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DriverController();