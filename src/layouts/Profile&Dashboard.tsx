// import React from "react";

import SideBar from "../components/user/profile&Dashboard/SideBar";
import { Route, Routes } from "react-router-dom";
import Header from "@/components/user/shared/Header";
import Footer from "@/components/user/shared/Footer";
import ProfilePage from "@/pages/user/ProfilePage";
import ProfileFormPage from "@/pages/user/ProfileFormPage";
import ApplicationListPage from "@/pages/user/ApplicationListPage";
import ApplicationDetailsPage from "@/pages/user/ApplicationDetailsPage";
import UserLoanListPage from "@/pages/user/UserLoanListPage";
import ChangePassword from "@/components/user/profile/ChangePassword";
import EmiListPage from "@/pages/user/EmiListPage";
import TransactionPage from "@/pages/user/TransactionPage";
import UserChatPage from "@/pages/user/UserChatPage";
import NotFound from "@/components/shared/NotFound";
// import LoanListingPage from "@/pages/user/LoanListingPage";
export default function ProfileAndDashboard() {
  return (
    <>
      <Header />
      <div className="flex  h-screen  ">
        <div>
          <SideBar />
        </div>
        <div className="flex-grow   overflow-y-auto bg-gray-100 sm:p-6 p-4">
          <Routes>
            <Route path="profile" element={<ProfilePage />} />
            <Route
              path="/profile/complete-profile"
              element={<ProfileFormPage />}
            />
            <Route path="applications" element={<ApplicationListPage />} />
            <Route path="loans" element={<UserLoanListPage />} />
            <Route path="chat-support" element={<UserChatPage />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route
              path="/applications/:id"
              element={<ApplicationDetailsPage />}
            />

            <Route path="/loan/:id" element={<EmiListPage />} />
            <Route path="/transactions" element={<TransactionPage />} />
                          <Route path="*" element={<NotFound role={'user'}/>} />
            
            {/* <Route
              path="/loan/:id"
              element={<EmiListPage />}
            />
             <Route
              path="/loan/:id"
              element={<EmiListPage />}
            /> */}
          </Routes>
        </div>
      </div>
      <Footer />
    </>
  );
}
