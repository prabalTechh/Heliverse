import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import LoginForm from "./pages/LoginForm"
import SignupForm from "./pages/SignupForm.jsx"
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  
} from "react-router-dom";
import Home from './pages/Home.jsx'

const router = createBrowserRouter([
  {path:"/" , element: <App />},
  {path:"/login" , element:<LoginForm />},
  {path:"/SignUp" , element:<SignupForm />},
  {path:"/home" , element:<Home />},
])

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)
