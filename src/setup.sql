-- =============================================================================
-- DATABASE SETUP SCRIPT
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. ORGANIZATION TABLE & DATA
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
    ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


-- -----------------------------------------------------------------------------
-- 2. PROJECT TABLE & DATA
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS project (
    project_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

INSERT INTO project (organization_id, title, description, location, project_date)
VALUES
    (1, 'Community Garden Cleanup', 'Help clear weeds and plant seasonal vegetables.', 'City Park', '2026-10-15'),
    (1, 'Food Pantry Sorting', 'Sort and box non-perishable food donations.', 'Main Street Center', '2026-10-22'),
    (1, 'Winter Coat Drive', 'Collect and distribute coats to local families.', 'Community Hall', '2026-11-05'),
    (1, 'Senior Center Tech Workshop', 'Assist seniors with smartphone and tablet basics.', 'Senior Plaza', '2026-11-12'),
    (1, 'Neighborhood Tree Planting', 'Plant native trees along neighborhood sidewalks.', 'Oak Avenue', '2026-11-20'),

    (2, 'Youth Literacy Tutoring', 'Read with elementary students after school.', 'Public Library', '2026-10-18'),
    (2, 'After-School Homework Club', 'Provide math and reading help to middle schoolers.', 'Youth Center', '2026-10-25'),
    (2, 'Book Drive & Distribution', 'Organize donated books for distribution.', 'Central High School', '2026-11-02'),
    (2, 'STEM Kit Assembly', 'Assemble hands-on science kits for elementary classrooms.', 'Tech Lab', '2026-11-09'),
    (2, 'Career Day Mentorship', 'Share career insights with graduating high schoolers.', 'Civic Center', '2026-11-16'),

    (3, 'Riverbed Trash Cleanup', 'Remove debris along the riverside trail.', 'Riverside Park', '2026-10-12'),
    (3, 'Park Bench Restoration', 'Sand and repaint wooden benches in the park.', 'Eastside Park', '2026-10-20'),
    (3, 'Recycling Drive', 'Collect electronic waste and plastic items.', 'Recycling Depot', '2026-11-01'),
    (3, 'Trail Maintenance Day', 'Clear overgrown brush along popular hiking trails.', 'Mountain Trailhead', '2026-11-08'),
    (3, 'Habitat Restoration', 'Plant native species to combat erosion.', 'Greenbelt Zone', '2026-11-19');


-- -----------------------------------------------------------------------------
-- 3. CATEGORY & PROJECT_CATEGORY TABLES & DATA
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS category (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

INSERT INTO category (name)
VALUES 
    ('Environmental'),
    ('Educational'),
    ('Community Service'),
    ('Health and Wellness');

INSERT INTO project_category (project_id, category_id)
VALUES
    (1, 1), (2, 3), (3, 3), (4, 4), (5, 1),
    (6, 2), (7, 2), (8, 2), (9, 2), (10, 2),
    (11, 1), (12, 1), (13, 1), (14, 1), (15, 1);


-- -----------------------------------------------------------------------------
-- 4. ROLES & USERS TABLES & DATA
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

INSERT INTO roles (role_name, role_description) 
VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- -----------------------------------------------------------------------------
-- 5. VERIFICATION QUERIES
-- -----------------------------------------------------------------------------
SELECT * FROM organization;
SELECT * FROM project;
SELECT * FROM category;
SELECT * FROM project_category;
SELECT * FROM roles;
SELECT * FROM users;


-- -----------------------------------------------------------------------------
-- 6. TESTS
-- -----------------------------------------------------------------------------
-- Insert a test user
INSERT INTO users (name, email, password_hash, role_id) 
VALUES ('testuser', 'test@example.com', 'placeholder_hash', 1);

-- Join users and roles to see complete information
SELECT u.user_id, u.name, u.email, r.role_name, r.role_description
FROM users u
JOIN roles r ON u.role_id = r.role_id;

-- Delete the test user
DELETE FROM users WHERE email = 'test@example.com';


-- If need to delete unnecessary project tests
-- Step 1: Remove any category connections for project ID
DELETE FROM public.project_category 
WHERE project_id = ;

-- Step 2: Delete project 17
DELETE FROM public.project 
WHERE project_id = ;

