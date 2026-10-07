const express = require('express');
const carController = require('../controllers/carController');

const router = express.Router();

router.post('/', carController.create);
router.get('/', carController.findAll);
router.get('/:id', carController.findById);
router.put('/:id', carController.update);
router.delete('/:id', carController.delete);

module.exports = router;