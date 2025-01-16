function(properties, context) {
 const tryOpenProfileModal = () => {
    try {
      window.Clerk.openUserProfile();
      sessionStorage.setItem("clerkModalWasOpen", "true");

      /**
       * * This Observer watches for the modal to appear in the DOM and then collects the close button for the modal.
       * * Once button is found - set an on-click event listener for manual closure of modal.
       * * Remove the clerkModalWasOpen item from session storage if modal is closed manually.
       * * This prevents modal from reopening on page reload if user manually closes the modal.
       */

      // Use a MutationObserver to wait for the modal to load into the DOM
      const observer = new MutationObserver((mutations, observerInstance) => {
        const closeButton = document.querySelector(".cl-modalCloseButton");
        if (closeButton) {
          closeButton.onclick = () => {
            sessionStorage.removeItem("clerkModalWasOpen");
          };

          // Once the button is found and the event listener is attached stop observing
          observerInstance.disconnect();
        }
      });

      // Start observing the document for added nodes
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    } catch (error) {
      console.error(error);
    }
  };
    try {
    waitForClerk(tryOpenProfileModal);
    } catch (err) {
        console.error("Error opening modal: ", err);
    }
}