import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import Dashboard from "./pages/Dashboard"
import Navbar from './components/NavBar';
import Footer from './components/Footer';
import CreatePost from './components/CreatePost';
import PostDetails from './components/PostDetails';
import Community from './components/Community';

const App = () => {
  const token = localStorage.getItem("token");
  
  return (
    <Router>
      <Navbar />
      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/community" element={<Community />} />
            <Route path="/dashboard" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/signin" />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </Router>
  )
}

export default App

