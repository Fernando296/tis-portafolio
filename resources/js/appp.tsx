import React from 'react';  //yo miguel no tenia de mi
import ReactDOM from "react-dom/client";
import ProfileBasicInfoPage from "./pages/profile/ProfileBasicInfoPage";
import "../css/app.css";

const root = document.getElementById("app");

if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ProfileBasicInfoPage />
    </React.StrictMode>
  );
}