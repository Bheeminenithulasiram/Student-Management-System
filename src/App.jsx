import { ToastContainer } from "react-toastify";
import "./App.css";
import LandingPage from "./components/HomePage/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ErrorPage from "./components/utils/ErrorPage";
import AdminDash from "./components/Admin/AdminDash";
import AdminTeachers from "./components/Admin/AdminTeachers";
import AdminWardens from "./components/Admin/AdminWardens";
import AdminManageCie from "./components/Admin/AdminManageCie";
import TeacherDashboard from "./components/Teachers/TeaDashboard";
import ReqStudents from "./components/Teachers/ReqStudents";
import Attendance from "./components/Teachers/Attendence";
import ViewStudents from "./components/Teachers/ViewStudents";
import Circulars from "./components/Teachers/Circulars";
import WardenDashboard from "./components/Warderns/WardenDashboard";
import OutingRequests from "./components/Warderns/OutingRequests";
import StudentDashboard from "./components/Student/StudentDashboard";
import ViewAnnouncements from "./components/Student/ViewAnnouncements";
import ViewAttendence from "./components/Student/ViewAttendence";
import ApplyOuting from "./components/Student/ApplyOuting";
import ViewProfile from "./components/Student/ViewProfile";
import MonthlyAtt from "./components/Warderns/MonthlyAtt";

function App() {
  return (
    <div className="">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin">
            <Route path="dashboard" element={<AdminDash />} />
            <Route path="manageteachers" element={<AdminTeachers />} />
            <Route path="managewardans" element={<AdminWardens />} />
            <Route path="authcirculars" element={<AdminManageCie />} />
          </Route>

          <Route path="/teacher">
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="reqstudents" element={<ReqStudents />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="viewstudents" element={<ViewStudents />} />
            <Route path="circulars" element={<Circulars />} />
          </Route>

          <Route path="/warden">
            <Route path="dashboard" element={<WardenDashboard />} />
            <Route path="outingreq" element={<OutingRequests />} />
            <Route path="MonthlyAtt" element={<MonthlyAtt />} />

          </Route>

          <Route path="/student">
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="ViewAnnouncements" element={<ViewAnnouncements />} />
            <Route path="ViewAttendence" element={<ViewAttendence />} />
            <Route path="ApplyOuting" element={<ApplyOuting />} />
            <Route path="ViewProfile" element={<ViewProfile />} />





          </Route>

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
