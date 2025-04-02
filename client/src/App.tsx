import "./App.css";
import { Navigate, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/Register";
import LoginPage from "./pages/auth/Login";

import { ToastContainer } from "react-toastify";

import ProfilePage from "./pages/profile/Profile";

function App() {
  return (
    <>
      <Routes>
        <Route path="/auth">
          <Route path="register" element={<RegisterPage />} />
          <Route path="login" element={<LoginPage />} />
        </Route>

        <Route path="/profile" element={<ProfilePage />}></Route>

        <Route path="/" element={<LoginPage />}></Route>
        <Route path="*" element={<Navigate to="/" />}></Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
