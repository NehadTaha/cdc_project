import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
//import Home from "./Pages/Home";
import reportWebVitals from "./reportWebVitals";
import HomePage from "./Pages/HomePage";

import { Routes, Route, BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

reportWebVitals();
