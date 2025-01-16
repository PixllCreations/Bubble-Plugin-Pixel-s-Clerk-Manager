async function(properties, context) {
  const { createClerkClient } = require("@clerk/backend");
  const fetch = require("node-fetch");

  const clerkClient = createClerkClient({
    secretKey: context.keys.CLERK_SECRET_KEY,
    publishableKey: context.keys.CLERK_PUBLISHABLE_KEY,
  });
    
  const req = new fetch.Request("https://thenotwork.org", {
    headers: {  
      authorization: `${properties.clerk_session_token}`,
    },
  });

  const obj = await clerkClient.authenticateRequest(req, { jwtKey: context.keys.JWT_KEY, authorizedParties: ["https://thenotwork.org"] }).catch((error) => {
      return { status: 500, message: error.message, reason: null, isSignedIn: false };
  });
    
   const { status, reason, message, isSignedIn } = obj;
    
   return {
    status: status ?? null,
	reason: reason ?? null,
    message: message ?? null,
    isSignedIn: isSignedIn,
    obj: JSON.stringify(obj, null, 2),
   };
}