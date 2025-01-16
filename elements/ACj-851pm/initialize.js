function(instance, context) {
  const userProfileHandler = () => {
    try {
      /**
       * * Checks if session storage has an item named 'clerkModalWasOpen' and if it exists and is true then it reopens the modal to persist the users state prior to page reload for oAuth.
       */
      const modalWasOpen = sessionStorage.getItem("clerkModalWasOpen");
      if (modalWasOpen) {
        window.Clerk.openUserProfile();

        /**
         * * Remove the session storage item as the modal has been reopened and we no longer want to persist the modal's open state on reload.
         */
        sessionStorage.removeItem("clerkModalWasOpen");
      }
    } catch (error) {
      console.error(error);
    }
  };

  waitForClerk(userProfileHandler);
}