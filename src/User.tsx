import HomePage from "./pages/user/HomePage";
import { Route, Routes } from "react-router-dom";
import Register from "./pages/user/Register";
import LoginForm from "./pages/user/login";
import IsLogin from "./protected/IsLogin";
import IsLogout from "./protected/IsLogout";
import ForgotPasswordEmailPage from "./pages/user/ForgotPasswordEmailPage";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import ProfileAndDashboard from "./layouts/Profile&Dashboard";
import LoanListingPage from "./pages/user/LoanListingPage";
import LoanDetailsPage from "./pages/user/LoanDetailsPage";
import LoanApplicationPage from "./pages/user/LoanApplicationPage";
import NotificationPage from "./pages/user/NotificationPage";
import ContactUsPage from "./pages/user/ContactUsPage";
import AboutUsPage from "./pages/user/AboutUsPage";
import NotFound from "./components/shared/NotFound";
function User() {
  return (
    <>
      <Routes>
        <Route index element={<HomePage />}></Route>

        <Route
          path="/register"
          element={
            <IsLogout>
              <Register />
            </IsLogout>
          }
        ></Route>
        <Route
          path="/login"
          element={
            <IsLogout>
              <LoginForm />
            </IsLogout>
          }
        ></Route>
        <Route
          path="/forgot-password"
          element={<ForgotPasswordEmailPage />}
        ></Route>
        <Route
          path="/reset-password/:token"
          element={<ResetPasswordPage />}
        ></Route>
        <Route
          path="/dashboard/*"
          element={
            <IsLogin>
              <ProfileAndDashboard />
            </IsLogin>
          }
        ></Route>
        <Route path="/loans" element={<LoanListingPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/loan/:id" element={<LoanDetailsPage />} />
        <Route path="/loan/application/:id" element={<LoanApplicationPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />

        <Route path="*" element={<NotFound role={'user'}/>} />
      </Routes>
    </>
  );
}

export default User;
