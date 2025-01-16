async function(instance, context) {
  const frontendApi = context.keys.FRONTEND_API;
  const pubKey = context.keys.CLERK_PUBLISHABLE_KEY;

  if (window.Clerk && window.Clerk.loaded) {
    // Return if Clerk is already present and loaded.
    return;
  }

  // Dynamically load the Clerk SDK
  (function (d, s, id) {
    if (d.getElementById(id)) {
      // console.log("Clerk SDK script already exists in DOM. Skipping script injection.");
      return;
    }

    const js = d.createElement(s);
    js.id = id;
    js.setAttribute("crossOrigin", "anonymous");
    js.setAttribute("data-clerk-publishable-key", pubKey);
    js.src = `https://${frontendApi}/npm/@clerk/clerk-js@latest/dist/clerk.browser.js`;
    js.setAttribute("type", "text/javascript");

    // Ensure all Clerk-related logic runs after the SDK is fully loaded
    js.onload = async function () {
      const Clerk = window.Clerk;
      await startClerk(Clerk);
    };

    d.head.appendChild(js);
  })(document, "script", "clerk-js");

  // Start Clerk logic after loading the SDK
  const startClerk = async (Clerk) => {
    try {
      const formButton = {
        background: "linear-gradient(90deg, #4CAF50, #30cf6e )",
        color: "#E4E2DF",
        border: "none",
        "&:hover, &:focus, &:active": {
          background: "linear-gradient(90deg, #388E3C, #249c55)",
        },
      };

      // Load Clerk environment & session if available
      await Clerk.load({
        appearance: {
          signIn: {
            variables: {
              colorPrimary: "#30cf6e",
              colorBackground: "#1D201F",
              colorText: "#E8E6E3",
              colorInputBackground: "#333333",
              colorInputText: "#30cf6e",
              fontSize: "1.3rem",
              fontWeight: { normal: 300, medium: 400, semibold: 600, bold: 800 },
              fontFamily: "Roboto",
              fontFamilyButtons: "Roboto",
            },
            elements: {
              formButtonPrimary: formButton,
            },
          },
          signUp: {
            variables: {
              colorPrimary: "#30cf6e",
              colorBackground: "#1D201F",
              colorText: "#E8E6E3",
              colorInputBackground: "#333333",
              colorInputText: "#30cf6e",
              fontSize: "1.3rem",
              fontWeight: { normal: 300, medium: 400, semibold: 600, bold: 800 },
              fontFamily: "Roboto",
              fontFamilyButtons: "Roboto",
            },
            elements: {
              formButtonPrimary: formButton,
            },
          },
          userProfile: {
            variables: {
              colorPrimary: "#30cf6e",
              colorBackground: "#1D201F",
              colorText: "#E8E6E3",
              colorInputBackground: "#333333",
              colorInputText: "#30cf6e",
              fontSize: "1.3rem",
              fontWeight: { normal: 300, medium: 400, semibold: 600, bold: 800 },
              fontFamily: "Roboto",
              fontFamilyButtons: "Roboto",
            },
            elements: {
              formButtonPrimary: formButton,
            },
          },
        },
      });

      // Add hover styles dynamically
      const style = document.createElement("style");
      style.textContent = `
      a.cl-formFieldAction.cl-formFieldAction__identifier.cl-internal-7c8l8e {
        color: #E8E6E3; /* Default color */
        text-decoration: none; /* Remove underline */
      }
      a.cl-formFieldAction.cl-formFieldAction__identifier.cl-internal-7c8l8e:hover {
        color: #30cf6e; /* Hover color */
      }
    `;
      document.head.appendChild(style);

      // Use a MutationObserver to watch for the 'use phone' element within modal
      const observer = new MutationObserver((mutationsList, observer) => {
        const targetLink = document.querySelector(
          "a.cl-formFieldAction.cl-formFieldAction__identifier.cl-internal-7c8l8e",
        );

        if (targetLink) {
          // Disconnect the observer as the style has already been applied
          observer.disconnect();
        }
      });

      // Start observing the body for changes
      observer.observe(document.body, { childList: true, subtree: true });

      // Handle user data
      const sessionUser = Clerk.session?.user ?? null;
      const email = sessionUser?.primaryEmailAddress?.emailAddress?.toString() ?? "";
      const phone = sessionUser?.primaryPhoneNumber?.phoneNumber?.toString() ?? "";
      const clerkId = sessionUser?.id?.toString() ?? "";
      const sessionToken = (await Clerk.session?.getToken()) ?? "";

      instance.publishState("clerk_email", email);
      instance.publishState("clerk_id", clerkId);
      instance.publishState("clerk_phone", phone);
      instance.publishState("clerk_session_token", sessionToken);

      if (sessionUser) {
        instance.triggerEvent("clerk_with_user");
      } else {
        instance.triggerEvent("clerk_without_user");
      }
    } catch (err) {
      console.error("Error loading Clerk: ", err);
    }
  };
}