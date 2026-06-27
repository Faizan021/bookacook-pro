-- Update the first restaurant to use "pizza.speisely.de"
UPDATE restaurants 
SET slug = 'pizza', custom_domain = 'pizza.speisely.de' 
WHERE id = (SELECT id FROM restaurants LIMIT 1);

-- Update the first planner to use "events.speisely.de"
UPDATE planners 
SET slug = 'events', custom_domain = 'events.speisely.de' 
WHERE id = (SELECT id FROM planners LIMIT 1);

-- Update the first caterer to use "catering.speisely.de"
UPDATE caterers 
SET slug = 'catering', custom_domain = 'catering.speisely.de' 
WHERE id = (SELECT id FROM caterers LIMIT 1);
