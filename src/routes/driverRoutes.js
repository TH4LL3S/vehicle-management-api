const express = require('express');
const driverController = require('../controllers/driverController');

const router = express.Router();

router.post('/', driverController.create);
router.get('/', driverController.findAll);
router.get('/:id', driverController.findById);
router.put('/:id', driverController.update);
router.delete('/:id', driverController.delete);

module.exports = router;