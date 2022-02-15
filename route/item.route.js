const { Router } = require('express');
const express = require('express');
const router = express.Router();

const itemController = require('../controller/item.controller');
const authController = require('../controller/auth.controller');

/* Get all items API route which is used to list all items */
router.get('/getAllItems', authController.auth, itemController.getAllItems);

/* Get Item by name API route which is used to get items by its name */
router.get('/getItemByName/:name', authController.auth, itemController.getItemByName);

/* Insert Item API route which is used to insert items */
router.post('/insertItem', authController.auth, itemController.insertItem);

/* Update Item API route which is used to update items */
router.put('/updateItem', authController.auth, itemController.updateItem);

/* Delete Item API route which is used to remove items */
router.delete('/deleteItem/:id', authController.auth, itemController.deleteItem);


module.exports = router;