const usageService = require('../services/usageService');

class UsageController {
  create(req, res, next) {
    try {
      const usage = usageService.create(req.body);

      return res.status(201).json(usage);
    } catch (error) {
      next(error);
    }
  }

  finish(req, res, next) {
    try {
      const usage = usageService.finish(req.params.id);

      return res.status(200).json(usage);
    } catch (error) {
      next(error);
    }
  }

  findAll(req, res, next) {
    try {
      const usages = usageService.findAll();

      return res.status(200).json(usages);
    } catch (error) {
      next(error);
    }
  }

  findById(req, res, next) {
    try {
      const usage = usageService.findById(req.params.id);

      return res.status(200).json(usage);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UsageController();