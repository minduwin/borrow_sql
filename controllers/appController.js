const db = require('../db/queries');

// First page to render
async function firstPage(res, res) {
    res.render('index', {
        title: 'Home',
    })
}

// Display information
async function displayInventory(req, res) {
    const tools = await db.getAllInventory();
    res.render('inventory', {
        title: 'Inventory',
        tools: tools,
    });
}

async function displayUsers(req, res) {
    const toolUsers = await db.getAllUsers();
    res.render('users', {
        title: 'Users',
        toolUsers: toolUsers,
    });
}

async function displayTransactions(req, res) {
    const orders = await db.getTransactions();
    res.render('transactions', {
        title: 'Transactions',
        orders: orders,
    });
}

async function getInfoforForm(res, res) {
    const allTools = await db.getAllInventory();
    const allUsers = await db.getAllUsers();
    res.render('borrow', {
        title: 'Form',
        allTools: allTools,
        allUsers: allUsers,
    });
}

// Show tool details
async function openTool(req, res) {
    const toolId = req.params.id;

    try {
        const tool = await db.getTool(toolId);
        if (tool) {
            res.render('details', {
                title: 'Tool Details',
                tool: tool
            });
        } else {
            res.status(404).send('Tool not found.');
        }
    } catch (error) {
        console.error('Error fetching tool', error);
        res.status(500).send('Server error.')
    }
};

// Add Information
async function addNewUser(req, res) {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send('Please add a name...');
    }

    try {
        await db.addUser(name);
        res.redirect('/users');
    } catch (error) {
        console.error('Error message: ', error.message);
        res.status(500).send('Something went wrong.')
    }
}

// Borrow tool
async function postBorrow(req, res) {
    // Grab info from the form
    const { userId, toolId } = req.body;
    // Get all the inventory
    const tools = await db.getAllInventory();

    try {
        await db.borrowTool(userId, toolId);
        res.redirect('/transactions');
    } catch (error) {
        console.error('Controller Error: ', error.message);
        // If tool borrowed, show error and redirect to inventory page
        if (error.message === 'Tool is not available') {
            return res.render('inventory', {
                title: 'Inventory',
                tools: tools,
                error: "This tool is already 'In Use'"
            })
        }
        res.status(500).send('Something went wrong.');
    }
}

// Return tool
async function postReturningTool(req, res) {
    const { invent_id } = req.params;
    await db.returnTool(invent_id);
    res.redirect('/transactions');
}

// Delete user
async function postDeleteUser(req, res) {
    // Get password to delete user
    const { adminPass } = req.body;
    // Get userId info
    const userId = req.params.tooluser_id;

    // Check if password is correct
    if (adminPass === "1234") {
        await db.deleteUser(userId);
        res.redirect('/users');    
    // If not, show error
    } else {
        res.status(403).send('Unauthorized: Incorrect Password!');
    }
};

module.exports = {
    firstPage, 
    displayInventory,
    displayUsers,
    displayTransactions,
    openTool,
    addNewUser,
    getInfoforForm,
    postBorrow,
    postReturningTool,
    postDeleteUser,
}