import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Sources from "./pages/Sources";
import Tasks from "./pages/Tasks";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}
