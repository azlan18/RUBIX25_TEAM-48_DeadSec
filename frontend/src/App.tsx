import { BrowserRouter as Router, Route, Routes,Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
function App() {
  const token = localStorage.getItem("token");
  
  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/dashboard" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App

