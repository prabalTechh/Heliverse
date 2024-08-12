import React, { useEffect, useState } from 'react';
import { fetchClassrooms } from './apiService';
import SignupForm from './pages/SignupForm';
import LoginForm from './pages/LoginForm';
import {useNavigate} from "react-router-dom";
const App = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [activeComponent, setActiveComponent] = useState('none'); // Default to 'none'
  const navigate = useNavigate();
  useEffect(() => {
    const fetchProtectedData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const data = await fetchClassrooms(token);
          setClassrooms(data);
        } catch (error) {
          console.error('Error fetching classrooms:', error);
        }
      }
    };

    fetchProtectedData();
  }, []);

  const handleClick = (component) => {
    setActiveComponent(component);
  };

  const handleLoginSuccess = () => {
    navigate('/home'); // Navigate to Home component after successful login
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'signup':
        return <SignupForm />;
      case 'login':
        return <LoginForm onLoginSuccess={handleLoginSuccess} />;
      default:
        return <div className="text-black flex justify-center items-center">Select an option to display the form</div>;
    }
  };

  return (
    <div className="h-screen grid md:grid-cols-[70%_30%] grid-cols-[50%_50%]">
      <div className="bg-gradient-to-b from-gray-200 via-blue-100 to-slate-200 h-full flex flex-col justify-center items-center text-xl text-black ">
        <div className="w-full ">{renderComponent()}</div>
      </div>
      <div className={`bg-[#e4e3e3] h-full flex flex-col justify-center items-center`}>
        <div className="space-y-4 w-2/3">
          <button
            className="border-2 border-fuchsia-600 rounded-full bg-gray-800 py-2 uppercase font-light w-full text-white"
            onClick={() => handleClick('signup')}
          >
            SignUp
          </button>
          <button
            className="border-2 border-fuchsia-600 rounded-full bg-gray-800 py-2 uppercase font-light w-full text-white"
            onClick={() => handleClick('login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
