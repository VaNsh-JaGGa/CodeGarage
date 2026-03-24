
import NavBar from "./Common/NavBar";
import Form from "./Components/Form"
import { useEffect, useState } from "react";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
    useEffect(() => {
    if (darkMode) {
      document.body.classList.add("bg-gray-950", "text-white");
      document.body.classList.remove("bg-white", "text-black");
    } else {
      document.body.classList.add("bg-white", "text-black");
      document.body.classList.remove("bg-gray-950", "text-white");
    }
  }, [darkMode]);

  return (
    <>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Form darkMode={darkMode} />
    </>
  )
}

export default App