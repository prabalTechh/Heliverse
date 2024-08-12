import axios from "axios";

// Set up the base URL for your API
const API_URL = 'https://heliverse-qmxf.onrender.com/api'; // Updated to your Render backend URL

// Function for user signup
export const signup = async (email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/auth/signup`, { email, password, role });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function for user login
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function for fetching protected data (classrooms)
export const fetchClassrooms = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/classroom/class`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function for fetching user details
export const getUserDetails = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/details`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Function to create a timetable
export const createTimetable = async (timetable) => {
  try {
    const response = await axios.post(`${API_URL}/Timetable`, timetable);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Function to fetch timetables for a classroom
export const fetchTimetablesForClassroom = async (classroomId) => {
  try {
    const response = await axios.get(`${API_URL}/Timetable/classroom/${classroomId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message);
  }
};
