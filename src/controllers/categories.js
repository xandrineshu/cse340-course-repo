// Import model functions
import {
    getAllCategories,
    getCategoryDetails,
    getCategoryById,
    addCategory,
    updateCategory,
    getCategoriesForProject,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectsByCategory, getProjectDetails } from '../models/projects.js';

const showCategoriesPage = async (req, res, next) => {
    try {
        const categories = await getAllCategories();
        const title = 'Service Categories';

        res.render('categories', { title, categories });
    } catch (error) {
        next(error);
    }
};

const showCategoryDetailsPage = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryDetails(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        const projects = await getProjectsByCategory(categoryId);

        res.render('category', {
            title: `${category.name} Projects`,
            category,
            projects
        });
    } catch (error) {
        next(error);
    }
};

// Render form to create new category
const showNewCategoryForm = (req, res) => {
    res.render('new-category', {
        title: 'New Category',
        errors: [],
        name: ''
    });
};

// Process submission for creating new category
const processNewCategoryForm = async (req, res, next) => {
    try {
        const name = req.body.name ? req.body.name.trim() : '';
        const errors = [];

        // Server-side validation: presence, min 3 chars, max 100 chars
        if (!name) {
            errors.push('Category name is required.');
        } else if (name.length < 3) {
            errors.push('Category name must be at least 3 characters long.');
        } else if (name.length > 100) {
            errors.push('Category name must not exceed 100 characters.');
        }

        if (errors.length > 0) {
            return res.render('new-category', {
                title: 'New Category',
                errors,
                name
            });
        }

        await addCategory(name);

        // Add success flash message
        req.flash('success', 'Category created successfully.');

        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

// Render form to edit existing category
const showEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await getCategoryById(categoryId);

        if (!category) {
            const err = new Error('Category Not Found');
            err.status = 404;
            return next(err);
        }

        res.render('edit-category', {
            title: 'Edit Category',
            errors: [],
            category
        });
    } catch (error) {
        next(error);
    }
};

// Process submission for updating category
const processEditCategoryForm = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const name = req.body.name ? req.body.name.trim() : '';
        const errors = [];

        // Server-side validation: presence, min 3 chars, max 100 chars
        if (!name) {
            errors.push('Category name is required.');
        } else if (name.length < 3) {
            errors.push('Category name must be at least 3 characters long.');
        } else if (name.length > 100) {
            errors.push('Category name must not exceed 100 characters.');
        }

        if (errors.length > 0) {
            return res.render('edit-category', {
                title: 'Edit Category',
                errors,
                category: { category_id: categoryId, name }
            });
        }

        await updateCategory(categoryId, name);

        // Add success flash message
        req.flash('success', 'Category updated successfully.');

        res.redirect('/categories');
    } catch (error) {
        next(error);
    }
};

const showAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;

        const projectDetails = await getProjectDetails(projectId);
        const categories = await getAllCategories();
        const assignedCategories = await getCategoriesForProject(projectId);

        const title = 'Assign Categories to Project';

        res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
    } catch (error) {
        next(error);
    }
};

const processAssignCategoriesForm = async (req, res, next) => {
    try {
        const projectId = req.params.projectId;
        const selectedCategoryIds = req.body.categoryIds || [];

        const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
        await updateCategoryAssignments(projectId, categoryIdsArray);
        req.flash('success', 'Categories updated successfully.');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        next(error);
    }
};

// Export controller functions
export {
    showCategoriesPage,
    showCategoryDetailsPage,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};