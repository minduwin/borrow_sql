const pool = require('./pool');

// Get information
async function getAllInventory() {
    const { rows } = await pool.query('SELECT * FROM inventory_status');
    return rows;
}

async function getAllUsers() {
    const { rows } = await pool.query('SELECT * FROM toolusers');
    return rows;
}

async function getTransactions() {
    const { rows } = await pool.query('SELECT * FROM transactions_details');
    return rows;
}

async function getTool(invent_id) {
    const res = await pool.query(
        'SELECT * FROM inventory_status WHERE invent_id = $1',
        [invent_id]
    );

    return res.rows[0];
}

// Add information
async function addUser(name) {
    await pool.query(
        'INSERT INTO toolusers (tooluser_name) VALUES ($1)',
        [name]
    );
}

// Borrow tool
async function borrowTool(userId, toolId) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN'); // Fixed spelling

        const updateRes = await client.query(
            "UPDATE inventory SET situation = 'In use' WHERE invent_id = $1 AND situation = 'Available' RETURNING *", // Fixed 'RETURNING'
            [toolId]
        );

        if (updateRes.rowCount === 0) {
            // This message must match the one in the controller exactly
            throw new Error('Tool is not available'); 
        }

        await client.query(
            'INSERT INTO transactions (tooluser_id, invent_id) VALUES ($1, $2)',
            [userId, toolId]
        );

        await client.query('COMMIT'); // Fixed spelling
        return { success: true };
    } catch (error) {
        // Only rollback if the connection was actually established
        await client.query('ROLLBACK'); 
        console.error('Transaction failed: ', error.message);
        throw error;
    } finally {
        client.release();
    }
}

// Return tool
async function returnTool(invent_id) {
    try {
        await pool.query('BEGIN');
        await pool.query(
            "UPDATE inventory SET situation = 'Available' WHERE invent_id = $1",
            [invent_id]
        );

        await pool.query(
            "UPDATE transactions SET returned_at = NOW() WHERE invent_id = $1 AND returned_at IS NULL",
            [invent_id]
        );

        await pool.query('COMMIT');
        return true;
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Return error', error);
        throw error;
    }
}

// Delete user
async function deleteUser(tooluser_id) {
    try {
        const res = await pool.query(
            'DELETE FROM toolusers WHERE tooluser_id = $1 RETURNING *',
            [tooluser_id]
        );
        return res.rows;
    } catch (error) {
        console.error('Database error: ', error.message);
        throw error;
    }
}

module.exports = {
    getAllInventory, 
    getAllUsers, 
    getTransactions,
    getTool, 
    addUser, 
    borrowTool, 
    returnTool, 
    deleteUser, 
};