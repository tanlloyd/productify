import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import api from "../lib/axios";

let isInterceptorRegistered = false;

function useAuthReq() {
  const { isSignedIn, getToken, isLoaded } = useAuth();  // getToken() = get Clerk token isLoaded = clerk finished loading
 
  useEffect(() => {
    if (isInterceptorRegistered) return; // stop duplicate interceptors
    isInterceptorRegistered = true;     // interceptor = security checkpoint b4 every request

    const interceptor = api.interceptors.request.use(async (config) => {        // runs b4 any 
      if (isSignedIn) {     // if user logged in
        const token = await getToken();     // get auth token
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;     // add token to request headers for backend to verify user
        }
      }
      return config;        // send to backend
    });

    return () => {   // cleanup function to remove interceptor when component unmounts
      api.interceptors.request.eject(interceptor);      // remove interceptor
      isInterceptorRegistered = false;      // allow interceptor to be re-added if needed
    };
  }, [isSignedIn, getToken]);   // rerun if login state or token change

  return { isSignedIn, isClerkLoaded: isLoaded };   // return login state and whether Clerk finished loading
}

export default useAuthReq;

// handle authentication