import { getUpcomingProjects, getProjectDetails, getCategoriesByProject, createProject, updateProject } from '../models/projects.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Render upcoming projects page
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Service Projects';

        res.render('projects', { title, projects });
    } catch (error) {
        next(error);
    }
};

// Render single project details page
const showProjectDetailsPage = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Service Project Not Found');
            err.status = 404;
            return next(err);
        }

        // Fetch the categories linked to this project
        const categories = await getCategoriesByProject(projectId);
        const title = 'Project Details';

        res.render('project', {
            title,
            project,
            categories: categories || []
        });
    } catch (error) {
        next(error);
    }
};

// Render new project form
const showNewProjectForm = async (req, res, next) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Add New Service Project';

        res.render('new-project', { title, organizations });
    } catch (error) {
        next(error);
    }
};

// Handle form submission for creating a new project
const processNewProjectForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-project');
    }

    // Extract form data (supports either organizationId or organization_id from body)
    const { title, description, location, date, organizationId, organization_id } = req.body;
    const orgId = organizationId || organization_id;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(title, description, location, date, orgId);

        req.flash('success', 'New service project created successfully!');
        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);
        req.flash('error', 'There was an error creating the service project.');
        res.redirect('/new-project');
    }
};

// Render edit project form
const showEditProjectForm = async (req, res, next) => {
    try {
        const projectId = req.params.id;
        const project = await getProjectDetails(projectId);

        if (!project) {
            const err = new Error('Service Project Not Found');
            err.status = 404;
            return next(err);
        }

        const organizations = await getAllOrganizations();

        // Format project_date to YYYY-MM-DD so HTML5 date input can populate correctly
        if (project.date) {
            project.date = new Date(project.date).toISOString().split('T')[0];
        }

        const title = `Edit ${project.title}`;

        res.render('update-project', {
            title,
            project,
            organizations
        });
    } catch (error) {
        next(error);
    }
};

// Handle form submission for updating an existing project
const processEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-project/${projectId}`);
    }

    // Extract form data (supports either organizationId or organization_id from body)
    const { title, description, location, date, organizationId, organization_id } = req.body;
    const orgId = organizationId || organization_id;

    try {
        // Update the project in the database
        await updateProject(projectId, title, description, location, date, orgId);

        req.flash('success', 'Service project updated successfully!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error updating project:', error);
        req.flash('error', 'There was an error updating the service project.');
        res.redirect(`/edit-project/${projectId}`);
    }
};

// Input validation chain
const projectValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description must be less than 1000 characters'),
    body('location')
        .trim()
        .notEmpty().withMessage('Location is required')
        .isLength({ max: 200 }).withMessage('Location must be less than 200 characters'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Date must be a valid date format'),
    body('organizationId')
        .optional()
        .isInt().withMessage('Organization must be a valid selection'),
    body('organization_id')
        .optional()
        .isInt().withMessage('Organization must be a valid selection')
];

export {
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    showEditProjectForm,
    processEditProjectForm,
    projectValidation
};