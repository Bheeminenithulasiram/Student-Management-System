import {
  MdOutlineAnalytics,
  MdOutlineCalendarMonth,
  MdOutlineRateReview,
} from "react-icons/md";
import {
  FaBookReader,
  FaFileDownload,
  FaFileUpload,
  FaUserGraduate,
  FaUserSecret,
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { PiStudent } from "react-icons/pi";
import { FaListCheck } from "react-icons/fa6";

export const teacherPaths = [
  {
    path: "student",
    name: "Students",
    icon: <FaUserGraduate className="h-8 w-8" />,
  },
  {
    path: "remarks",
    name: "Remarks",
    icon: <MdOutlineAnalytics className="h-8 w-8" />,
  },
  {
    path: "upload-material",
    name: "Uploaded Material",
    icon: <FaFileUpload className="h-8 w-8" />,
  },
  {
    path: "sessions",
    name: "Sessions",
    icon: <MdOutlineCalendarMonth className="h-8 w-8" />,
  },

  {
    path: "logout",
    name: "Logout",
    icon: <CiLogout className="h-8 w-8" />,
  },
];

export const adminPaths = [
  {
    path: "subject",
    name: "Subjects",
    icon: <FaBookReader className="h-8 w-8" />,
  },
  {
    path: "faculty",
    name: "Faculties",
    icon: <PiStudent className="h-8 w-8" />,
  },
  {
    path: "student",
    name: "Students",
    icon: <FaUserGraduate className="h-8 w-8" />,
  },
  {
    path: "parents",
    name: "Parents",
    icon: <FaUserGraduate className="h-8 w-8" />,
  },
  {
    path: "attendence",
    name: "Attendence",
    icon: <FaListCheck className="h-8 w-8" />,
  },
  {
    path: "marks",
    name: "Marks",
    icon: <MdOutlineRateReview className="h-8 w-8" />,
  },
  {
    path: "logout",
    name: "Logout",
    icon: <CiLogout className="h-8 w-8" />,
  },
];

export const studentPaths = [
  {
    path: "sessions",
    name: "Session Links",
    icon: <FaListCheck className="h-8 w-8" />,
  },
  {
    path: "feedback",
    name: "Feedbacks",
    icon: <MdOutlineRateReview className="h-8 w-8" />,
  },
  {
    path: "material",
    name: "Material Download",
    icon: <FaFileDownload className="h-8 w-8" />,
  },
  {
    path: "change-password",
    name: "Change Password",
    icon: <FaUserSecret className="h-8 w-8" />,
  },
  {
    path: "logout",
    name: "Logout",
    icon: <CiLogout className="h-8 w-8" />,
  },
];
