document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. Logout Confirmation Modal
    // ==========================================
    const logoutTriggers = document.querySelectorAll('.logout-trigger');
    const logoutModal = document.getElementById('logout-modal');
    const cancelLogoutBtn = document.getElementById('cancel-logout');

    if (logoutModal) {
        logoutTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                logoutModal.style.display = 'flex';
            });
        });

        if (cancelLogoutBtn) {
            cancelLogoutBtn.addEventListener('click', () => {
                logoutModal.style.display = 'none';
            });
        }

        logoutModal.addEventListener('click', (e) => {
            if (e.target === logoutModal) {
                logoutModal.style.display = 'none';
            }
        });
    }

    // ==========================================
    // 2. Unvolunteer Modal (Dashboard & Project Details)
    // ==========================================
    const unvolunteerTriggers = document.querySelectorAll('.unvolunteer-trigger, #unvolunteer-trigger');
    const cancelVolunteerModal = document.getElementById('cancel-volunteer-modal');
    const cancelUnvolunteerBtn = document.getElementById('cancel-unvolunteer');
    const confirmUnvolunteerBtn = document.getElementById('confirm-unvolunteer');
    let activeForm = null;

    if (cancelVolunteerModal) {
        unvolunteerTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                // Find the specific form associated with the clicked button
                activeForm = trigger.closest('form') || document.getElementById('unvolunteer-form');
                cancelVolunteerModal.style.display = 'flex';
            });
        });

        if (cancelUnvolunteerBtn) {
            cancelUnvolunteerBtn.addEventListener('click', () => {
                cancelVolunteerModal.style.display = 'none';
                activeForm = null;
            });
        }

        if (confirmUnvolunteerBtn) {
            confirmUnvolunteerBtn.addEventListener('click', () => {
                if (activeForm) {
                    activeForm.submit();
                }
            });
        }

        cancelVolunteerModal.addEventListener('click', (e) => {
            if (e.target === cancelVolunteerModal) {
                cancelVolunteerModal.style.display = 'none';
                activeForm = null;
            }
        });
    }
});