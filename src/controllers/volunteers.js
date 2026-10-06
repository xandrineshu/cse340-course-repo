import { addVolunteer, removeVolunteer } from '../models/volunteers.js';

// POST /project/:id/volunteer - Sign up to volunteer
export const signUpVolunteer = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await addVolunteer(userId, projectId);
        req.flash('success', 'You have successfully signed up to volunteer for this project!');
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error signing up volunteer:', error);
        req.flash('error', 'Unable to sign up for this project. Please try again.');
        res.redirect(`/project/${req.params.id}`);
    }
};

// POST /project/:id/unvolunteer - Remove volunteering registration
export const cancelVolunteer = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.session.user.user_id;

        await removeVolunteer(userId, projectId);
        req.flash('success', 'You have been removed as a volunteer for this project.');

        // Redirect back to referral page (e.g., dashboard or project details)
        const backUrl = req.get('Referrer') || '/dashboard';
        res.redirect(backUrl);
    } catch (error) {
        console.error('Error removing volunteer:', error);
        req.flash('error', 'Unable to remove volunteer status. Please try again.');
        res.redirect('/dashboard');
    }
};