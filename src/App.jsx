import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import News from "./pages/News";
import Sources from "./pages/Sources";
import Tasks from "./pages/Tasks";

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
                <Route path="/stories" element={<News />} />
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
