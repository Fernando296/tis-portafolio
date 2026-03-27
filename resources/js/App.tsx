import React from 'react';
import Layout from './components/Layout';

export default function App() {
    return (
        <Layout>
            prueba
        </Layout>
    );
}

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
  