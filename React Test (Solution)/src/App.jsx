
import NavBar from "./Components/NavBar"
import Form from "./Components/Form"
import { useEffect, useState } from "react";

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      console.log("now to dark");
    } else {
      document.documentElement.classList.remove("dark");
      console.log("now to not dark");
    }
  }, [darkMode]);

  return (
    <>
      <NavBar darkMode={darkMode} setDarkMode={setDarkMode} />
      <Form />
    </>
  )
}

export default App