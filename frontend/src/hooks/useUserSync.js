import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { syncUser } from "../lib/api";

function useUserSync() {
  const { isSignedIn } = useAuth();     // check if user is signed in
  const { user } = useUser();       // get user info from Clerk

  const { mutate: syncUserMutation, isPending, isSuccess } = useMutation({ mutationFn: syncUser });       // set up POST request to backend /users/sync in api.js
  // syncUserMutation() -> trigger API call
  // isPending -> request in progress
  // isSuccess -> request successful

 
  useEffect(() => {         // send user data to backend to sync when user logs in
    if (isSignedIn && user && !isPending && !isSuccess) {       // only trigger when user logged in. user data exists, and no request is in progress or already successful
      syncUserMutation({    // trigger API call 
        email: user.primaryEmailAddress?.emailAddress,  // send user email
        name: user.fullName || user.firstName,      // send username
        imageUrl: user.imageUrl,        // send user profile image url
      });
    }
  }, [isSignedIn, user, syncUserMutation, isPending, isSuccess]);   // rerun if any changes

  return { isSynced: isSuccess }; // return whether user data is successfully synced
}

export default useUserSync;

// keep user data in sync (when user logs in, info is sent to backend to create/update user in db so db updated)