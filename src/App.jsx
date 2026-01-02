import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "./Auth/LoginForm.jsx";
import OtpVerify from "./Auth/OtpVerify.jsx";
import Signup from "./Auth/Signup.jsx";

import Dashboard from "./Dashboards/Dashboard.jsx";
import Students from "./Student/Student.jsx";
import CreateStudent from "./Student/CreateStudent.jsx";
import StudentView from "./Student/StudentView.jsx";

import AddPlacement from "./Placement/AddPlacement.jsx";
import Placements from "./Placement/Placement.jsx";

import Courses from "./Course/Courses.jsx";
import AddCourse from "./Course/AddCourse.jsx";
import CourseView from "./Course/CourseView.jsx";
import EditCourse from "./Course/EditCourse.jsx";

import Resumes from "./Resume/Resumes.jsx";
import AddResume from "./Resume/AddResume.jsx";

import Alumni from "./Alumni/Alumni.jsx";
import AddAlumni from './Alumni/AddAlumni.jsx'

import Profile from "./Profile/Profile.jsx";
import EditProfile from "./Profile/EditProfile.jsx";

import { AuthContextProvider } from "./Context/AuthContext.jsx";
import ProtectedRoutes from "./Utils/ProtectedRoutes.jsx";

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="bg-white/90 p-8 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2">Unauthorized</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/otp" element={<OtpVerify />} />

          <Route path="/dashboard" element={
          <ProtectedRoutes> <Dashboard />
          </ProtectedRoutes>}/>

          <Route path="/students" element={
          <ProtectedRoutes roles={["admin", "counseller"]}>
          <Students/> </ProtectedRoutes> }/>
          
          <Route path="/students/:id" element={ 
          <ProtectedRoutes roles={["admin", "counseller"]}>
          <StudentView/> </ProtectedRoutes>}/>

          <Route path="/add-student" element={
          <ProtectedRoutes roles={["admin", "counseller"]}>
          <CreateStudent /> </ProtectedRoutes>}/>

          <Route path="/courses" element={
          <ProtectedRoutes roles={["admin"]}>
          <Courses /> </ProtectedRoutes>}/>

          <Route path="/add-course" element={
          <ProtectedRoutes roles={["admin"]}>
          <AddCourse/> </ProtectedRoutes>}/>

          <Route path="/courses/:id" element={
          <ProtectedRoutes roles={["admin", "counseller"]}>
          <CourseView /> </ProtectedRoutes> }/>

          <Route path="/courses/edit/:id" element={
          <ProtectedRoutes roles={["admin"]}>
          <EditCourse /> </ProtectedRoutes> }/>

          <Route path="/resumes" element={
          <ProtectedRoutes roles={["admin", "hr", "counseller"]}>
          <Resumes /></ProtectedRoutes> }/>

          <Route path="/add-resume" element={
          <ProtectedRoutes roles={["admin", "hr"]}>
          <AddResume /> </ProtectedRoutes> }/>

          <Route path="/placements" element={
          <ProtectedRoutes roles={["admin", "hr"]}>
          <Placements /> </ProtectedRoutes> }/>

          <Route path="/add-placement" element={
          <ProtectedRoutes roles={["admin", "hr"]}>
          <AddPlacement /> </ProtectedRoutes> }/>

          <Route path="/signup" element={
          <ProtectedRoutes roles={["admin"]}>
          <Signup /> </ProtectedRoutes>}/>

          <Route path="/alumni" element={
          <ProtectedRoutes roles={["admin", "counseller"]}>
          <Alumni /> </ProtectedRoutes> }/>

          <Route path="/add-alumni" element={
          <ProtectedRoutes roles={["admin", "counseller"]}>
          <AddAlumni /> </ProtectedRoutes> }/>

          <Route path="/profile" element={
          <ProtectedRoutes roles={["admin", "hr", "counseller"]}>
          <Profile /> </ProtectedRoutes> }/>

          <Route path="/profile/edit" element={
          <ProtectedRoutes roles={["admin", "hr", "counseller"]}>
          <EditProfile /> </ProtectedRoutes> }/>

          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={ <ProtectedRoutes>
          <Navigate to="/dashboard" replace />
          </ProtectedRoutes>}/>
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}
