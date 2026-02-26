import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import OtpVerification from "./pages/OtpVerification";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import ErrorPage from "./pages/Error";
import Profile from "./pages/Profile";
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-200" data-theme="valentine">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OtpVerification />} />
          <Route path="/profile-setup" element={<ProfileSetup />} />

          <Route
            element={
              <div className="h-screen bg-[#020205] flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto">
                  <Outlet />
                </main>
              </div>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;