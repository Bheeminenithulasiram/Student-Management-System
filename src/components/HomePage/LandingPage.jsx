import React, { useState, useEffect } from "react";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaCalendarAlt,
  FaChartLine,
  FaBook,
  FaUniversity,
} from "react-icons/fa";
import { FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../utils/api";



const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [stats, setStats] = useState([
    { value: 0, max: 5000, label: "Students" },
    { value: 0, max: 250, label: "Courses" },
    { value: 0, max: 98, label: "Success Rate" },
    { value: 0, max: 150, label: "Faculty" },
  ]);
  const collegeImage =
    "https://shiksha-static-mediadata.s3.ap-southeast-1.amazonaws.com/mediadata/reviewDocument/images/1687610965888images.jpeg";
  const learningImage =
    "https://images.unsplash.com/file-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

  useEffect(() => {
    const intervals = stats.map((stat, index) => {
      const increment = stat.max / 50;
      return setInterval(() => {
        setStats((prevStats) => {
          const newStats = [...prevStats];
          if (newStats[index].value < stat.max) {
            newStats[index].value = Math.min(
              newStats[index].value + increment,
              stat.max
            );
          }
          return newStats;
        });
      }, 20);
    });

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: <FaBook className="text-4xl mb-4 text-blue-600" />,
      title: "Course Management",
      description:
        "Comprehensive tools to manage your academic journey with ease.",
    },
    {
      icon: <FaChartLine className="text-4xl mb-4 text-blue-600" />,
      title: "Performance Analytics",
      description:
        "Real-time insights into your academic progress and performance.",
    },
    {
      icon: <FaCalendarAlt className="text-4xl mb-4 text-blue-600" />,
      title: "Smart Scheduling",
      description: "Automated scheduling that adapts to your academic needs.",
    },
    {
      icon: <FaChalkboardTeacher className="text-4xl mb-4 text-blue-600" />,
      title: "Faculty Collaboration",
      description: "Seamless communication with instructors and advisors.",
    },
    {
      icon: <FaUserGraduate className="text-4xl mb-4 text-blue-600" />,
      title: "Student Portal",
      description: "Personalized dashboard with all your academic information.",
    },
    {
      icon: <FaUniversity className="text-4xl mb-4 text-blue-600" />,
      title: "Campus Integration",
      description: "Connect with all campus services through one platform.",
    },
  ];

  const testimonials = [
    {
      quote:
        "Arjun College of Technology transformed how I organize my academic life. Everything is in one place and so easy to access!",
      name: "Sarah Johnson",
      role: "Computer Science, Senior",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      quote:
        "As an international student, Arjun College of Technology helped me navigate the system effortlessly. The multilingual support is fantastic!",
      name: "Carlos Mendez",
      role: "Business Administration",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      quote:
        "The analytics tools helped me identify my weak areas and improve my grades significantly.",
      name: "Priya Patel",
      role: "Engineering, Sophomore",
      avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    },
  ];

  const programs = [
    "Computer Science",
    "Business Administration",
    "Engineering",
    "Liberal Arts",
    "Health Sciences",
    "Architecture",
  ];

  // Register and login logic
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    file: null,
    address: "",
  });
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    userType: "Student",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = "Invalid email";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Invalid mobile number";
    if (!formData.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return newErrors;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
       console.log("s");
       
      const response = await api.post("/student/register", formDataToSend);
      toast.success(response.data.message || "Registration successful!");
      setSuccess("Registration successful!");
      setTimeout(() => {
        setIsRegisterOpen(false);
        setSuccess("");
        setFormData({
          name: "",
          email: "",
          password: "",
          mobile: "",
          file: null,
          address: "",
        });
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed. Please try again.";
      setErrors({ api: errorMessage });
      toast.error(errorMessage);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.email || !loginData.password) {
      setErrors({ login: "Please fill all fields" });
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      let endpoint = "";
      if (loginData.userType === "Student") endpoint = "/student/login";
      else if (loginData.userType === "Teacher") endpoint = "/teacher/login";
      else if (loginData.userType === "Admin") endpoint = "/admin/login";
      else if (loginData.userType === "Warden") endpoint = "/warden/login";

      const data = {
        email: loginData.email,
        password: loginData.password,
      };

      const response = await api.post(endpoint, data);

      localStorage.setItem("userType", loginData.userType);
      localStorage.setItem("data", JSON.stringify(response.data.data));

      let dashboardRoute = "";
      if (loginData.userType === "Student") dashboardRoute = "/student/dashboard";
      else if (loginData.userType === "Teacher") dashboardRoute = "/teacher/dashboard";
      else if (loginData.userType === "Admin") dashboardRoute = "/admin/dashboard";
      else if (loginData.userType === "Warden") dashboardRoute = "/warden/dashboard";

      window.location.href = dashboardRoute;
      setLoginData({ email: "", password: "", userType: "Student" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials";
      setErrors({ login: errorMessage });
      toast.error(errorMessage);
      setLoginData({ email: "", password: "", userType: "Student" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-blue-700 text-2xl font-bold">
            Arjun <span className="text-blue-500">College of Technology</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600">
              Home
            </a>
            <a href="#features" className="text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#programs" className="text-gray-700 hover:text-blue-600">
              Programs
            </a>
            <button
              onClick={() => setIsLoginOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Login
            </button>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="relative bg-gradient-to-r from-blue-800 to-blue-600 text-white py-20"
      >
        <div
          className="absolute inset-0 opacity-10 bg-cover bg-center"
          style={{ backgroundImage: `url(${collegeImage})` }}
        ></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
              >
                Transform Your{" "}
                <span className="text-yellow-300">Academic Journey</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xl mb-8"
              >
                Arjun College of Technology provides a comprehensive platform to
                streamline your education management, track progress, and
                achieve academic excellence.
              </motion.p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
                  onClick={() => setIsRegisterOpen(true)}
                >
                  Register as Student
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-800 transition"
                >
                  Learn More
                </motion.button>
              </div>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="relative"
              >
                <img
                  src={collegeImage}
                  alt="University Campus"
                  className="rounded-xl shadow-2xl border-8 border-white transform rotate-1"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-lg shadow-lg text-blue-800">
                  <div className="text-2xl font-bold">#1</div>
                  <div className="text-sm">Student Platform</div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 shadow-sm">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="p-4"
              >
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {Math.round(stat.value)}
                  {stat.label === "Success Rate" ? "%" : "+"}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage your academic life in one intuitive
              platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition"
              >
                <div className="flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-bold text-center mb-3 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
              >
                Diverse <span className="text-blue-600">Academic Programs</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-lg text-gray-600 mb-8"
              >
                Choose from our wide range of accredited programs designed to
                prepare you for success in today's competitive world.
              </motion.p>
              <motion.ul
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                viewport={{ once: true }}
                className="grid grid-cols-2 gap-4"
              >
                {programs.map((program, index) => (
                  <li key={index} className="flex items-center">
                    <span className="bg-blue-100 text-blue-600 p-1 rounded-full mr-3">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </span>
                    {program}
                  </li>
                ))}
              </motion.ul>
            </div>
            <div className="md:w-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative"
              >
                <img
                  src={learningImage}
                  alt="Students learning"
                  className="rounded-xl shadow-xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-blue-600 text-white p-6 rounded-xl shadow-lg max-w-xs">
                  <div className="text-xl font-bold mb-2">
                    Personalized Learning
                  </div>
                  <div className="text-sm">
                    Tailored academic paths based on your goals and performance
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-100">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              What Our Students Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from students who transformed their academic experience with
              Arjun College of Technology
            </p>
          </motion.div>

          <div className="relative max-w-4xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{
                  opacity: activeTestimonial === index ? 1 : 0,
                  scale: activeTestimonial === index ? 1 : 0.9,
                }}
                transition={{ duration: 0.5 }}
                className={`absolute inset-0 ${activeTestimonial === index ? "z-10" : "z-0"}`}
              >
                <div className="bg-white p-8 rounded-xl shadow-md">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-bold text-gray-800">
                        {testimonial.name}
                      </div>
                      <div className="text-blue-600">{testimonial.role}</div>
                    </div>
                  </div>
                  <p className="text-lg italic text-gray-700">
                    "{testimonial.quote}"
                  </p>
                </div>
              </motion.div>
            ))}

            <div className="flex justify-center mt-80 pt-4 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${activeTestimonial === index ? "bg-blue-600" : "bg-gray-300"}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="contact"
        className="py-20 bg-gradient-to-r from-blue-700 to-blue-900 text-white"
      >
        <div className="container mx-auto px-6 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Transform Your Academic Experience?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            viewport={{ once: true }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            Join thousands of students who are already achieving more with Arjun
            College of Technology.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <button
              onClick={() => setIsRegisterOpen(true)}
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-bold hover:bg-yellow-300 transition text-lg"
            >
              Sign Up Now
            </button>
            <button className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-800 transition text-lg">
              Schedule a Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-blue-400 text-2xl font-bold mb-4">
                Arjun <span className="text-blue-300">College of Technology</span>
              </div>
              <p className="text-gray-400">
                Empowering students and educators with innovative academic
                management solutions.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#home"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#programs"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Programs
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Testimonials
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Feedback
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="text-gray-400 not-italic">
                <p>123 University Avenue</p>
                <p>Springfield, CA 12345</p>
                <p className="mt-2">
                  Email: info@arjuncollegeoftechnology.edu
                </p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>
              © {new Date().getFullYear()} Arjun College of Technology. All
              rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                ></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                ></svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition">
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                ></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Student Registration Dialog */}
      <AnimatePresence>
        {isRegisterOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-6">Student Registration</h2>
              <div onSubmit={handleRegister}>
                {["name", "email", "mobile", "address"].map((field) => (
                  <div key={field} className="mb-4">
                    {field !== "address" ? (
                      <input
                        type={field === "email" ? "email" : "text"}
                        placeholder={
                          field.charAt(0).toUpperCase() + field.slice(1)
                        }
                        value={formData[field]}
                        onChange={(e) =>
                          setFormData({ ...formData, [field]: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <textarea
                        placeholder="Address"
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-lg h-24"
                      />
                    )}
                    {errors[field] && (
                      <p className="text-red-500 text-sm">{errors[field]}</p>
                    )}
                  </div>
                ))}
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password}</p>
                  )}
                </div>
                <input
                  type="file"
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                  onChange={(e) =>
                    setFormData({ ...formData, file: e.target.files[0] })
                  }
                />
                {errors.api && (
                  <p className="text-red-500 text-sm mb-4">{errors.api}</p>
                )}
                {success && <p className="text-green-500 mb-4">{success}</p>}
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsRegisterOpen(false)}
                    className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {loading ? "Registering..." : "Register"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Dialog */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            >
              <h2 className="text-2xl font-bold mb-6">Login</h2>
              <div onSubmit={handleLogin}>
                <select
                  value={loginData.userType}
                  onChange={(e) =>
                    setLoginData({ ...loginData, userType: e.target.value })
                  }
                  className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                  <option value="Warden">Warden</option>
                </select>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                />
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg pr-10"
                  />
                  <FontAwesomeIcon
                    icon={showPassword ? faEyeSlash : faEye}
                    className="absolute right-3 top-4 text-gray-400 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </div>
                {errors.login && (
                  <p className="text-red-500 text-sm mb-4">{errors.login}</p>
                )}
                <div className="flex justify-between">
                  <button
                    onClick={() => setIsLoginOpen(false)}
                    className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-700"
                  >
                    Close
                  </button>
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;