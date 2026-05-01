const { Router } = require('express');
const appController = require('../controllers/appController');
const toolRouter = Router();

// Get info
toolRouter.get('/', appController.firstPage);
toolRouter.get('/inventory', appController.displayInventory);
toolRouter.get('/users', appController.displayUsers);
toolRouter.get('/borrow', appController.getInfoforForm);
toolRouter.get('/transactions', appController.displayTransactions);
toolRouter.get('/details/:id', appController.openTool);

// Post info
toolRouter.post('/users', appController.addNewUser);
toolRouter.post('/borrow', appController.postBorrow);
toolRouter.post('/:invent_id/return', appController.postReturningTool);
toolRouter.post('/delete-user/:tooluser_id', appController.postDeleteUser);

module.exports = toolRouter;