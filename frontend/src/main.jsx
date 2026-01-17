import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";

// Import your Publishable Key from .env
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY


if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')).render(   // render app inside <div id="root">
  <StrictMode>    {/* check for safer code */}
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>  {/* enable login users everywhere in app */}
      <BrowserRouter> {/* enable to access all routes in app */}
      <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>,
);

// start react and loads app.jsx into page