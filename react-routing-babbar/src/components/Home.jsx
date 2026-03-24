import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate();
  function navigateTo(){
    navigate("/about")
  }
  return (
    <div>
      Home Page
      <button onClick={navigateTo}>
        Click to About
      </button>
    </div>
  )
}

export default Home
