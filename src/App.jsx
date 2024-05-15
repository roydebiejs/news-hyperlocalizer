import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Stories from "./pages/Stories";
import Sources from "./pages/Sources";
import Tasks from "./pages/Tasks";
import Story from "./pages/Story";

import Nav from "./components/Nav";

export default function App() {
  return (
    <>
      <BrowserRouter>
        <div>
          <Nav
            page={
              <Routes>
                <Route path="/" element={<Navigate to="/stories" replace />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="/stories/:id" element={<Story />} />
                <Route path="/sources" element={<Sources />} />
                <Route path="/tasks" element={<Tasks />} />
              </Routes>
            }
          />
        </div>
      </BrowserRouter>
    </>
  );
}
