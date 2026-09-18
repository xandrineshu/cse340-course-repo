import { getUpcomingProjects, getProjectDetails, getCategoriesByProject } from '../models/projects.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Render upcoming projects page
const showProjectsPage = async (req, res, next) => {
    try {
        const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
        const title = 'Upcoming Service Projects'; // Updated title per activity requirements

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

        // Pass categories along with title and project
        res.render('project', {
            title,
            project,
            categories: categories || []
        });
    } catch (error) {
        next(error);
    }
};

export { showProjectsPage, showProjectDetailsPage };
