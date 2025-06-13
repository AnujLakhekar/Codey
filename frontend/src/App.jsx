import Navbar from "./components/navbar.component"
import {Navigate, Routes, Route} from "react-router-dom"
import UserAuthForm from "./pages/userAuthForm.page"
import HomePage from "./pages/home.page.jsx"
import { Toaster } from 'react-hot-toast';
import { useQuery } from "@tanstack/react-query";
import React, {createContext} from "react"
import {Editor} from "./pages/editor.pages.jsx"
import BlogPage from "./pages/blog.page.jsx"
import ProfilePage from "./pages/profile.page.jsx"
import Dashboard from "./pages/dashboard.page.jsx"


const App = () => {
  const [authUser, setAuthUser] = React.useState(null)
  
  
  const {data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Login failed");
        }

        const data = await res.json();
        setAuthUser(data.user)
        return data;
      } catch (e) {
        toast.error(e.message);
        throw new Error(e.message);
      }
    },
  });
  
  
  
  if (isLoading) {
    return <div className="w-full h-screen flex justify-center animate-spin items-center"><div className="w-5 h-5 rounded-full border border-2 border-gray-100 border-t-black"></div></div>
  }


    return (
      <main>
      <Toaster
      position="top-center"
    />
      <Routes>
      <Route path="/editor" element={authUser ? <Editor /> : <Navigate to="/signin" />} /> 
      
      <Route path="/editor/:id" element={authUser ? <Editor state="editingOld" /> : <Navigate to="/signin" />} />
      
      <Route path="/" element={<Navbar />}>
         <Route path="signup" element={!authUser ? <UserAuthForm type="signup" /> : <Navigate to="/" />} />
         
         <Route path="" element={authUser ? <HomePage /> : <Navigate to="/signin" />} />
         
         <Route path="profile/:id" element={authUser ? <ProfilePage /> : <Navigate to="/signin" />} />
         
         <Route path="signin" element={!authUser ? <UserAuthForm type="signin" /> : <Navigate to="/" />} />
         
         <Route path="blog/:id" element={authUser ? <BlogPage /> : <Navigate to="/" />} />
         <Route path="Dashboard" element={authUser ? <Dashboard /> : <Navigate to="/" />} />
         </Route>
      </Routes>
      </main>
    )
}

export default App;