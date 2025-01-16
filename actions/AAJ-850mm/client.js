function(properties, context) {
    // Determine the path for redirection
    const path = properties.redirect_url ? getPath(properties.redirect_url) : getPath(currentURL);
    
    // Function to open the Clerk Sign In modal
    const openSignIn = () => {
        Clerk.openSignIn({
            afterSignInUrl: `${path}`,
            initialValues: {
                emailAddress: properties.email ?? null,
            },
        });
    };

    // Try to open the modal, ensuring Clerk is ready
    try {
        waitForClerk(openSignIn);
    } catch (err) {
        console.error("Error loading sign-in modal:", err.message || err);
    }
}