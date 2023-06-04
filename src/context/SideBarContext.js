import { createContext, useState } from "react";

const SideBarContext = createContext();

const SideBarContextProvider = ({ children }) => {
  const [nav, setNav] = useState("");
  const [role, setRole] = useState(null);

  return (
    <SideBarContext.Provider value={{ nav, setNav, role, setRole }}>
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarContext;
export { SideBarContextProvider };
