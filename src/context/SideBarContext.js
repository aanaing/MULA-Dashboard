import { createContext, useState } from "react";

const SideBarContext = createContext();

const SideBarContextProvider = ({ children }) => {
  const [nav, setNav] = useState("");

  return (
    <SideBarContext.Provider value={{ nav, setNav }}>
      {children}
    </SideBarContext.Provider>
  );
};

export default SideBarContext;
export { SideBarContextProvider };
