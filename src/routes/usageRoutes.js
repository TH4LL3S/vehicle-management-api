const express = require('express');
const usageController = require('../controllers/usageController');

const router = express.Router();

router.post('/', usageController.create);
router.get('/', usageController.findAll);
router.get('/:id', usageController.findById);
router.put('/:id/finish', usageController.finish);

module.exports = router;