import "./style/App.css";
import { Routes, Route } from "react-router-dom";

import Home from "./view/Home";
import Login from "./view/Login";
import NotFoundView from "./view/NotFoundView";
import { useContext } from "react";
import { SideBarContextProvider } from "./context/SideBarContext";

function App() {
  return (
    <SideBarContextProvider>
      <Routes>
        <Route path="*" element={<Home />} />
        <Route path="/" element={<Login />} />
        {/* <Route pathe="*" element={<NotFoundView />} /> */}
      </Routes>
    </SideBarContextProvider>
  );
}

export default App;
