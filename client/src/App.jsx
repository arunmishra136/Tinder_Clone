import { BrowserRouter, Route, Routes ,Navigate} from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import React from 'react';
import { Toaster } from "react-hot-toast";

function App() {
  const {checkAuth, authUser ,checkingAuth}=useAuthStore();

  useEffect(() => {
    checkAuth();
    console.log("Checking Auth:", checkingAuth, "Auth User:", authUser); // <-- Add this line
}, [checkAuth]); // <-- Ensure dependencies are correct


if (checkingAuth) return <div>Loading...</div>;



  return(
 <div className='absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]'>
 
 
  <Routes>
  <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/auth" />} />
  <Route path="/auth" element={!authUser ? <AuthPage /> : <Navigate to={"/"}/>}/>
    <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to = {"/auth"} />}/>
    <Route path="/chat/:id" element={authUser ? <ChatPage /> : <Navigate to = {"/auth"} />}/>

  </Routes>
  
  <Toaster/>
  
 </div>
 
  );

}

export default App;