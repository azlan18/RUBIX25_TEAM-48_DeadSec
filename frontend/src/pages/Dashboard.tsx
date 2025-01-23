import { useNavigate } from "react-router-dom"

const Dashboard = () => {
  const navigate = useNavigate()
  function handleClick() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  }
  return (
    <>
    <div>Dasboard</div>
    <button onClick={handleClick}>Logout</button></>
  )
}

export default Dashboard