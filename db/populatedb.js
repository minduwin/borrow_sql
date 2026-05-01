const { Client } = require('pg');
require('dotenv').config();

const inv_url = process.env.INV_URL;

const SQL = `
CREATE TABLE IF NOT EXISTS inventory (
    invent_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tool VARCHAR ( 255 ) NOT NULL,
    condition VARCHAR ( 255 ) NOT NULL,
    situation VARCHAR ( 255 ) NOT NULL,
    image_path TEXT
);

CREATE TABLE IF NOT EXISTS toolusers (
    tooluser_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tooluser_name VARCHAR ( 100 ) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tooluser_id INT REFERENCES toolusers(tooluser_id),
    invent_id INT REFERENCES inventory(invent_id),
    borrowed_at TIMESTAMP DEFAULT NOW(),
    returned_at TIMESTAMP
);

INSERT INTO inventory (tool, condition, situation, image_path)
VALUES 
    ('Dewalt Cordless Drill/Impact 20V set', 'Good', 'Available', 'images/drill.png'),
    ('Husky Mechanics Tool Set', 'Good', 'Available', 'images/husky-set.png'),
    ('Milwaukee Table Saw', 'Fair', 'Available', 'images/table-saw.png'),
    ('Dewalt Miter Saw', 'Good', 'Available', 'images/miter-saw.png'),
    ('Dewalt Cordless Circular Saw', 'Poor', 'Available', 'images/saw.png'),
    ('RYOBi Cordless Nailer', 'Good', 'In use', 'images/ryobi-nailer.jpg'),
    ('Makita Cordless Lawn Mower', 'Poor', 'Available', 'images/lawn-mower.jpg'),
    ('Homelite Cordless Hedge Trimmer', 'Fair', 'Available', 'images/trimmer.jpg'),
    ('RYOBI Cordless Leaf Blower', 'Good', 'Available', 'images/blower.jpg');

INSERT INTO toolUsers (toolUser_name)
VALUES
    ('Mr. Leatherface'),
    ('Michael Myers'),
    ('Norman Bates'),
    ('Patrick Bateman'),
    ('Jack Torrance');

CREATE VIEW transactions_details AS
SELECT
    t.transaction_id,
    u.tooluser_name,
    i.tool,
    i.invent_id, 
    t.borrowed_at,
    t.returned_at
FROM transactions t
JOIN toolusers u ON t.tooluser_id = u.tooluser_id
JOIN inventory i ON t.invent_id = i.invent_id;

CREATE VIEW inventory_status AS
SELECT
    i.invent_id,
    i.tool,
    i.condition,
    i.situation,
    i.image_path,
    u.tooluser_name AS currently_held_by,
    t.borrowed_at
FROM inventory i
LEFT JOIN transactions t ON i.invent_id = t.invent_id AND t.returned_at IS NULL
LEFT JOIN toolusers u ON t.tooluser_id = u.tooluser_id;
`;

async function main() {
    console.log('Seeding...');
    const client = new Client({
        connectionString: inv_url,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('Done...');
}

main();