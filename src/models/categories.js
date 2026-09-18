import pool from './db.js';

// Existing function
export const getAllCategories = async () => {
    const query = `
        SELECT 
            c.category_id,
            c.name,
            COALESCE(
                json_agg(
                    json_build_object(
                        'project_id', p.project_id,
                        'title', p.title,
                        'location', p.location,
                        'project_date', p.project_date
                    )
                ) FILTER (WHERE p.project_id IS NOT NULL), '[]'
            ) AS projects
        FROM public.category c
        LEFT JOIN public.project_category pc ON c.category_id = pc.category_id
        LEFT JOIN public.project p ON pc.project_id = p.project_id
        GROUP BY c.category_id, c.name
        ORDER BY c.name ASC;
    `;

    const result = await pool.query(query);
    return result.rows;
};

/**
 * Retrieves a single category by its ID.
 */
export const getCategoryDetails = async (id) => {
    const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
};

/**
 * Retrieves all categories associated with a specific service project.
 */
export const getCategoriesForProject = async (projectId) => {
    const query = `
        SELECT c.category_id, c.name
        FROM public.category c
        JOIN public.project_category pc ON c.category_id = pc.category_id
        WHERE pc.project_id = $1;
    `;
    const result = await pool.query(query, [projectId]);
    return result.rows;
};
