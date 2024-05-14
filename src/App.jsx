import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
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
                <Route path="/" element={<Home />} />
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
