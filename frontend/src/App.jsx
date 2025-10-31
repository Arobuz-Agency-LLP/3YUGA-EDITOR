import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Editor from "./components/editor/Editor";
import ModeSelector from "./components/ui/ModeSelector";
import MindMapping from "./components/mindmapping/MindMapping";

const PageWrapper = ({ children }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: "easeOut" }} style={{ height: "100%" }}>
    {children}
  </motion.div>
);

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <ModeSelector />
            </PageWrapper>
          }
        />
        <Route
          path="/editor"
          element={
            <PageWrapper>
              <Editor />
            </PageWrapper>
          }
        />
        <Route
          path="/mindmapping"
          element={
           <React.StrictMode>
  <MindMapping />
</React.StrictMode>

          }
        />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="App" style={{ width: "100vw", height: "100vh" }}>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
