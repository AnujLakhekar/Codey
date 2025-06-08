import React, { useState, useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import logo from "../imgs/logo.png";
import { FaSearch } from "react-icons/fa";
import { FaPen } from "react-icons/fa6";
import { IoNotificationsOutline } from "react-icons/io5";
import AlertBox from "../components/AlertBox.commponent";
import { queryClient } from "../main.jsx";
import UserNavigation from "../components/user-navigation.component.jsx"

export default function Navbar() {
 const [isSerachBarHidden, setIsSerachBarHidden] = useState(true);
const [authUser, setAuthUser] = useState(false);
const [userNavigationPanel, setUserNavigationPanel] = useState(false);

 const data = queryClient.getQueryData(["authUser"]);

useEffect(() => {
 setAuthUser(data?.user);
 }, [data]);

return (
  <>
 <nav className="navbar bg-white sticky top-0 z-50 flex w-full justify-between h-[60px] items-center gap-10 p-5 border-b border-gray-10">
<div className="flex w-full justify-between items-center">

{/* Logo */}
<Link to="/">
<img src={logo} className="w-10 p-2 h-10" />
</Link>

{/* Search bar */}
<div
className={`absolute md:relative ${
isSerachBarHidden ? "hidden" : "flex"
} bg-white md:bg-transparent z-50 left-0 md:flex justify-center items-center ease-in duration-300 py-5 top-16 md:top-0 p-2`}
>
<input
type="text"
placeholder="Search"
id="search"
className="relative bg-gray-300/30 px-[12vw] md:px-10 left-5 md:left-0 p-2 placeholder:text-gray-400 outline-none rounded-lg"
/>
<FaSearch
size={14}
color="black"
className="absolute left-6 md:left-2 z-10 w-[43px] h-[40px] p-2"
/>
</div>

{/* Desktop buttons */}
<div className="hidden md:flex items-center gap-3">
{authUser ? (
<>
<Link to="/editor">
<button className="bg-gray-100 rounded-lg p-2 flex items-center gap-2.5">
          <FaPen />
Write
</button>
</Link>
<Link to="/dashboard/notification">
<div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
<IoNotificationsOutline size={24}  />
</div>
</Link>
 <div>
  <div className="relative">
  <button onClick={() =>setUserNavigationPanel(!userNavigationPanel)} className="w-10 h-10 mt-1">
   <img className="w-full object-cover h-full rounded-full" src={authUser.personal_info.profile_img} />
  </button>
  {userNavigationPanel ? (<UserNavigation  username={authUser.personal_info.username} />) : ""}
</div> 
 </div>
</>
) : (
<>
<div className="group">
<button
className="bg-gray-100 rounded-lg p-2 flex items-center gap-2.5 text-gray-400"
disabled
>
<FaPen />
Write
</button>
<AlertBox text="Complete authentication before creating code!" />
</div>
<Link to="/signup">
<button className="btn-dark">Signup</button>
</Link>
<Link to="/signin">
<button className="btn-light">Login</button>
</Link>
</>
)}
</div>

{/* Mobile buttons */}
<div className="flex md:hidden items-center gap-2.5">
<FaSearch
onClick={() => setIsSerachBarHidden(!isSerachBarHidden)}
color="gray"
className="duration-100 ease-in hover:bg-gray-300/30 rounded-full w-[43px] h-[40px] p-2"
/>
{authUser ? (<><Link to="/dashboard/notification">
<div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full">
<IoNotificationsOutline size={24} />
</div>
</Link>

<div className="relative">
  <button onClick={() =>setUserNavigationPanel(!userNavigationPanel)} className="w-10 h-10 mt-1">
   <img className="w-full object-cover h-full rounded-full" src={authUser.personal_info.profile_img} />
  </button>
  {userNavigationPanel ? (<UserNavigation  username={authUser.personal_info.username} />) : ""}
</div>
</>) : (
<Link to="/signup">
<button className="btn-dark">Signup</button>
</Link>
)}
</div>
</div>
</nav>
<Outlet />
</>
 );
}
