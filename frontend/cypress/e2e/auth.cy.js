describe('Authentication Flow', () => {
    it('should allow a user to log in', () => {
        // Visit login page
        cy.visit('/login');

        // Fill in credentials (assuming there's a test user or the user we know exists)
        // IMPORTANT: In a real CI environment, we should seed this user.
        // For now, we'll try to login with the admin user which we know exists from previous steps.
        cy.get('input[type="email"]').type('admin@example.com');
        cy.get('input[type="password"]').type('123456');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Verify redirection to Home or Dashboard
        // The "Sign In" link should disappear or profile link should appear
        cy.url().should('not.include', '/login');
        cy.contains('Admin').should('exist'); // Checks for Admin link in navbar
    });

    it('should show error for invalid credentials', () => {
        cy.visit('/login');
        cy.get('input[type="email"]').type('wrong@example.com');
        cy.get('input[type="password"]').type('wrongpassword');
        cy.get('button[type="submit"]').click();

        // Verify toast or alert appears
        // Since we use react-hot-toast, we look for the message
        cy.contains('Invalid email or password').should('exist');
    });
});
