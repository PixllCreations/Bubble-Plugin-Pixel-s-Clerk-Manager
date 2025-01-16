function(properties, context) {
    try {
        // Function to handle exponential backoff
        const trySignOut = (attempt = 1) => {
                if (!Clerk.user) {
                    return
                }
                // If Clerk is loaded, perform sign-out
                Clerk.signOut();
        };
        waitForClerk(trySignOut);
    } catch (error) {
        console.error("An error occurred during the sign-out process:", error);
    } 
}
