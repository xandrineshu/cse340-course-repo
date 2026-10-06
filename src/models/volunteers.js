import pool from './db.js';

// Add a user as a volunteer for a project
export const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteers (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING *;
    `;
    const result = await pool.query(query, [userId, projectId]);
    return result.rows[0];
};

// Remove a user as a volunteer from a project
export const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2
        RETURNING *;
    `;
    const result = await pool.query(query, [userId, projectId]);
    return result.rows[0];
};

// Check if a user is currently signed up as a volunteer for a project
export const isUserVolunteering = async (userId, projectId) => {
    const query = `
        SELECT 1 FROM project_volunteers
        WHERE user_id = $1 AND project_id = $2;
    `;
    const result = await pool.query(query, [userId, projectId]);
    return result.rowCount > 0;
};

// Retrieve all projects a specific user has volunteered for
export const getProjectsByVolunteer = async (userId) => {
    const query = `
        SELECT p.*, o.name AS organization_name
        FROM project p
        JOIN project_volunteers pv ON p.project_id = pv.project_id
        LEFT JOIN organization o ON p.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY p.project_date ASC;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
};