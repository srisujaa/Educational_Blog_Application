import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import AdminLogin from "./components/AdminLogin/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagement from "./components/UserManagement/UserManagement";
import "./components/UserManagement/UserManagement.css";
import BlogManagement from "./components/BlogManagement/BlogManagement";
import "./components/BlogManagement/BlogManagement.css";
import BlogList from "./pages/BlogList";
import "./pages/BlogList.css";
import BlogEditor from "./components/BlogManagement/BlogEditor";
import "./components/BlogManagement/BlogEditor.css";
import CourseEnrollment from "./components/CourseEnrollment/CourseEnrollment";
import "./components/CourseEnrollment/CourseEnrollment.css";
import ReadingProgress from "./components/ReadingProgress/ReadingProgress";
import LearningPathGenerator from "./components/LearningPath/LearningPathGenerator";
import "./components/LearningPath/LearningPathGenerator.css";
import BlogDetail from "./pages/BlogDetail";
import LearningPath from "./pages/LearningPath";
import Quiz from "./pages/Quiz";
import BrainBreak from "./pages/BrainBreak";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/blogs/create" element={<BlogEditor />} />
        <Route path="/blogs/edit/:id" element={<BlogEditor />} />
        <Route path="/blogs/manage" element={<BlogManagement />} />
        <Route path="/courses/:courseId" element={<CourseEnrollment />} />
        <Route path="/reading-progress" element={<ReadingProgress />} />
        <Route path="/learning-path" element={<LearningPath />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/brain-break" element={<BrainBreak />} />
      </Routes>
    </div>
  );
}

export default App;
