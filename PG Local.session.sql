UPDATE inventory
SET tool = 'Cordless Drill 20V set'
WHERE tool = 'Dewalt Cordless Drill/Impact 20V set';

UPDATE inventory
SET tool = 'Circular Saw'
WHERE tool = 'Dewalt Cordless Circular Saw';

UPDATE inventory
SET tool = 'Lawn Mower'
WHERE tool = 'Makita Cordless Lawn Mower';

UPDATE inventory
SET tool = 'Hedge Trimmer'
WHERE tool = 'Homelite Cordless Hedge Trimmer';

UPDATE inventory
SET tool = 'Leaf Blower'
WHERE tool = 'RYOBI Cordless Leaf Blower';

UPDATE inventory
SET tool = 'Mechanics Tool Set'
WHERE tool = 'Husky Mechanics Tool Set';

UPDATE inventory
SET tool = 'Table Saw'
WHERE tool = 'Milwaukee Table Saw';

UPDATE inventory
SET tool = 'Miter Saw'
WHERE tool = 'Dewalt Miter Saw';

UPDATE inventory
SET tool = 'Cordless Nailer'
WHERE tool = 'RYOBi Cordless Nailer';

CREATE OR REPLACE VIEW inventory_status AS
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

UPDATE inventory
SET situation = 'Available'
WHERE tool = 'Cordless Nailer';

DROP VIEW IF EXISTS inventory_status;

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