import { FC } from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import SideBar from "../components/admin/SideBar";
import UserVerificationPage from "@/pages/admin/UserVerificationPage";
import UserVerificationListPage from "@/pages/admin/UserVerificationListPage";
import UserListPage from "@/pages/admin/UserListPage";
import UserDetailsPage from "@/pages/admin/UserDetailsPage";
import LoanListingPage from "@/pages/admin/LoanListingPage";
import AddLoanPage from "@/pages/admin/AddLoanPage";
import EditLoanPage from "@/pages/admin/EditLoanPage";
import LoanDetailsPage from "@/pages/admin/LoanDetailsPage";
import ApplicationListPage from "@/pages/admin/ApplicationListPage";
import ApplicationDetailsPage from "@/pages/admin/ApplicationDetailsPage";
import CapitalAndTransactionsPage from "@/pages/admin/CapitalAndTransactionsPage";
import UserLoanListPage from "@/pages/admin/UserLoanListPage";
import { EmiDetails } from "@/pages/admin/EmiDetailsPage";
import NotificationPage from "@/pages/admin/NotificationPage";
import AdminChatPage from "@/pages/admin/AdminChatPage";
import DashboardPage from "@/pages/admin/DashboardPage";
import NotFound from "@/components/shared/NotFound";

const AdminPages: FC = () => {
  return (
    <div className="h-screen flex">
      <div className="h-screen">
        <SideBar />
      </div>
      <div className="flex-grow overflow-y-auto bg-gray-100 sm:p-6">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="application" element={<ApplicationListPage />} />
          <Route
            path="capital-transaction"
            element={<CapitalAndTransactionsPage />}
          />
          <Route path="notification" element={<NotificationPage />} />
          <Route path="chat-support" element={<AdminChatPage />} />
          <Route
            path="User-verification"
            element={<UserVerificationListPage />}
          />
          <Route
            path="/user-verification/:id"
            element={<UserVerificationPage />}
          />
          <Route path="/users/:id" element={<UserDetailsPage />} />

          <Route path="loans" element={<LoanListingPage />} />
          <Route path="/loans/edit-loan/:id" element={<EditLoanPage />} />
          <Route path="/loans/add-loan" element={<AddLoanPage />} />
          <Route path="/loans/loan-details/:id" element={<LoanDetailsPage />} />
          <Route path="/user-loan/:userLoanId" element={<EmiDetails />} />
          <Route path="/application/:id" element={<ApplicationDetailsPage />} />
          <Route path="userloan" element={<UserLoanListPage />} />
                        <Route path="*" element={<NotFound role={'admin'}/>} />
          
        </Routes>
      </div>
    </div>
  );
};

export default AdminPages;
