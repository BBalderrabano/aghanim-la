import React, { Suspense } from "react";
import "./App.css";

import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConfirmDialogProvider } from 'react-mui-confirm';

// Components
import Layout from "./components/Layout";
import RequireAuth from "./components/auth/RequireAuth";
import PersistLogin from "./components/auth/PersistLogin";

import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Unnauthorized from "./pages/Unauthorized";

import AdminLAClasses from "./pages/admin-tools/Classes/AdminLAClasses";
import AdminUsers from "./pages/admin-tools/Users/AdminUsers";

import { AuthProvider } from "./context/AuthProvider";

function Root() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<SignUp />} />

        <Route path="unnauthorized" element={<Unnauthorized />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth allowedRoles={[parseInt(process.env.REACT_APP_USER_ROLE)]} />}>
            <Route path="/" element={<Home />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route element={<RequireAuth allowedRoles={[
                                                      parseInt(process.env.REACT_APP_ADMIN_ROLE),
                                                      parseInt(process.env.REACT_APP_EDITOR_ROLE)
                                                    ]} />}>
            <Route path="admin-tools/classes" element={<AdminLAClasses />} />
            <Route path="admin-tools/users" element={<AdminUsers />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <Suspense fallback={null}>
      <ConfirmDialogProvider>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<Root />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ConfirmDialogProvider>
    </Suspense>
  );
}

export default App;