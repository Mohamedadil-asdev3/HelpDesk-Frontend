// import { HashRouter, Route, Routes, useLocation } from 'react-router-dom';
// import Login from './Components/login';
// import Header from './Components/header';
// import Footer from './Components/footer';
// import UserDashboard from './Components/userDashboard';
// import TicketForm from './Components/createTicket';
// import HODDashboard from './Components/HODdashboard';
// import COEDashboard from './Components/CEOdashboard';
// import AdminDashboard from './Components/adminDashboard';
// import Entity from './Components/adminPanel/entity';
// import Location from './Components/adminPanel/location';
// import Users from './Components/adminPanel/user';
// import Category from './Components/adminPanel/createCategory';
// import Watcher from './Components/adminPanel/watcherGroups';
// import Department from './Components/adminPanel/department';
// import Role from './Components/adminPanel/role';
// import HolidayCalender from './Components/adminPanel/holidayCalender';
// import EmailTemplate from './Components/adminPanel/emailTemplate';
// import AdminPanel from './Components/adminPanel';
// import ApprovalPage from './Components/ApprovalPages/Approvalpage';

// function Layout() {

//   const location = useLocation();

//   const hideHeaderFooter =
//     location.pathname === "/" || location.pathname.startsWith("/admin");

//   return (
//     <>
//       {!hideHeaderFooter && <Header />}

//       <Routes>
//         <Route path="/" element={<Login />} />
//         <Route path="/UserDashboard" element={<UserDashboard />} />
//         <Route path="/CreateTicket" element={<TicketForm />} />
//         <Route path="/Approval" element={<ApprovalPage />} />
//         <Route path="/AdminDashboard" element={<AdminDashboard />} />
//         <Route path="/HODdashboard" element={<HODDashboard />} />
//         <Route path="/COEdashboard" element={<COEDashboard />} />

//         {/* Admin Panel */}
//         <Route path="/admin/*" element={<AdminPanel />}>
//           <Route path="entity" element={<Entity />} />
//           <Route path="location" element={<Location />} />
//           <Route path="user" element={<Users />} />
//           <Route path="category" element={<Category />} />
//           <Route path="watcher" element={<Watcher />} />
//           <Route path="department" element={<Department />} />
//           <Route path="role" element={<Role />} />
//           <Route path="calender" element={<HolidayCalender />} />
//           <Route path="template" element={<EmailTemplate />} />
//         </Route>

//       </Routes>

//       {!hideHeaderFooter && <Footer />}
//     </>
//   );
// };


// export default function App() {
//   return (
//     <HashRouter>
//       <Layout />
//     </HashRouter>
//   );
// }

import { HashRouter, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './Components/Login';
import Header from './Components/Header';
import Footer from './Components/Footer';
import UserDashboard from './Components/userDashboard';
import TicketForm from './Components/createTicket';
import HODDashboard from './Components/HODdashboard';
import COEDashboard from './Components/CEOdashboard';
import AdminDashboard from './Components/adminDashboard';
import Entity from './Components/adminPanel/entity';
import Location from './Components/adminPanel/location';
import Users from './Components/adminPanel/user';
import Category from './Components/adminPanel/createCategory';
import Watcher from './Components/adminPanel/watcherGroups';
import Department from './Components/adminPanel/department';
import Role from './Components/adminPanel/role';
import HolidayCalender from './Components/adminPanel/holidayCalender';
import EmailTemplate from './Components/adminPanel/emailTemplate';
import AdminPanel from './Components/adminPanel';
import ApprovalPage from './Components/ApprovalPages';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Placeholder Components (add actual if available)
const TechnicianDashboard = () => <div>Technician Dashboard</div>;
const ApproverPage = () => <div>Approver Page</div>;

// Role-based access check - Updated to match Header.js logic
const getUserRole = () => {
  const mapping = localStorage.getItem('selected_role_mapping');
  if (!mapping) return null;
  const parsed = JSON.parse(mapping);

  // Handle both full user object and direct mapping
  if (parsed.role_mappings && Array.isArray(parsed.role_mappings) && parsed.role_mappings.length > 0) {
    return parsed.role_mappings[0].role_name?.toLowerCase() || null;
  }
  return parsed.role_name?.toLowerCase() || null;
};

const hasAccess = (allowedRoles, currentRole) => {
  if (!currentRole) return false;
  if (allowedRoles.includes('superadmin')) return true; // Note: Changed from 'super admin' to 'superadmin'
  return allowedRoles.includes(currentRole);
};

// Protected Route Component - Updated to redirect unauthorized to UserDashboard
const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/UserDashboard" }) => {
  const currentRole = getUserRole();
  const isAuthenticated = !!localStorage.getItem('access_token') && !!currentRole;

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!hasAccess(allowedRoles, currentRole)) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Public Route Component - Redirects authenticated users to UserDashboard
const PublicRoute = ({ children }) => {
  const currentRole = getUserRole();
  const isAuthenticated = !!localStorage.getItem('access_token') && !!currentRole;

  if (isAuthenticated) {
    return <Navigate to="/UserDashboard" replace />;
  }

  return children;
};

function Layout() {
  const location = useLocation();

  const hideHeaderFooter =
    location.pathname === "/" || location.pathname.startsWith("/admin");

  return (
    <>
      {!hideHeaderFooter && <Header />}

      <Routes>
        {/* Login - Only accessible when not authenticated */}
        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        {/* Default Dashboard for ALL authenticated users */}
        <Route
          path="/UserDashboard"
          element={
            <ProtectedRoute allowedRoles={['user', 'technician', 'hod', 'ceo', 'admin', 'superadmin']}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* Role-specific Dashboards - These are ADDITIONAL options, not defaults */}
        <Route
          path="/TechnicianDashboard"
          element={
            <ProtectedRoute allowedRoles={['technician', 'superadmin']}>
              <TechnicianDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/HODdashboard"
          element={
            <ProtectedRoute allowedRoles={['hod', 'superadmin']}>
              <HODDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/COEdashboard"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'superadmin']}>
              <COEDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/AdminDashboard"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Common Pages */}
        <Route
          path="/CreateTicket"
          element={
            <ProtectedRoute allowedRoles={['user', 'technician', 'superadmin','admin']}>
              <TicketForm />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/Approver"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'hod', 'technician', 'user', 'superadmin']}>
              <ApproverPage />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/Approval"
          element={
            <ProtectedRoute allowedRoles={['ceo', 'hod', 'technician', 'user', 'superadmin']}>
              <ApprovalPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Panel - Only for Admin and Super Admin */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="entity" replace />} />
          <Route path="entity" element={<Entity />} />
          <Route path="location" element={<Location />} />
          <Route path="user" element={<Users />} />
          <Route path="category" element={<Category />} />
          <Route path="watcher" element={<Watcher />} />
          <Route path="department" element={<Department />} />
          <Route path="role" element={<Role />} />
          <Route path="calender" element={<HolidayCalender />} />
          <Route path="template" element={<EmailTemplate />} />
        </Route>

        {/* Fallback - Redirect authenticated users to UserDashboard, others to login */}
        <Route path="*" element={
          localStorage.getItem('access_token') ?
            <Navigate to="/UserDashboard" replace /> :
            <Navigate to="/" replace />
        } />
      </Routes>

      {!hideHeaderFooter && <Footer />}
       <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </>
  );
};

export default function App() {
  return (
    <HashRouter>
      <Layout />
    </HashRouter>
  );
}