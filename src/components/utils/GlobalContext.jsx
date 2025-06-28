import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";
import axios from "axios";

const GlobalContext = createContext();

const initCurrentUser = () => {
  const currentUser = sessionStorage.getItem("currentUser");
  return currentUser ? JSON.parse(currentUser) : {};
};

const CollegeProvider = ({ children }) => {
  const token = Cookies.get("token");
  const role = Cookies.get("role");
  const [subjects, setSubjects] = useState({});
  const [currentUser, setCurrentUser] = useState(initCurrentUser);
  const [teachers] = useState({});

  const getSubjects = async () => {
    try {
      const response = await axios.get("/subjects");
      setSubjects(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // const getTeachers = async (role) => {
  //   try {
  //     const response = await api.get(`/users?q=&role=${role}`);
  //     setTeachers(response.data.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("currentUser"));

    if (user) {
      setCurrentUser(user);
    }
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        token,
        role,
        subjects,
        getSubjects,
        teachers,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
export const useCollege = () => {
  return useContext(GlobalContext);
};
export default CollegeProvider;
