
import {AnimationWraper} from "../common/page-animation.jsx"
import {Link} from "react-router-dom"

// icons
import { IoLogOut } from "react-icons/io5"
import { FaPen } from "react-icons/fa6"

// functions 
import { useQuery, useMutation } from "@tanstack/react-query";



export default function UserNavigation({username}) {
  
  const {mutate:SignOut, isPending:SigningOut} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`,
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
      } catch (e) {
        console.log(e.message)
        throw new Error(e)
      }
    },
    onSuccess: () => {
      window.location.href = "/signin"
    }
  })
  
  return (
    <AnimationWraper
    className="absolute z-50 top-16 right-4"
    transition={{duration: 0.5}}
    initial= {{y : 0, opacity: 0}}
    animate={{y: 10, opacity: 1}}
    >
    <div className="w-[160px] min-h-[180px] bg-gray-100 rounded-lg overflow-hidden">
      <div className="w-full ">
       <Link to="/editor" className="w-full flex items-center gap-2.5 text-gray-500 font-bold pl-3 border border-[2px] border-transparent border-b-gray-200 h-1/2 p-2 bg-gray-100 duration-200 ease-in hover:bg-gray-300"><FaPen />Editor</Link>
      </div>
      
      <div className="w-full ">
       <Link to="/dashboard" className="w-full flex items-center gap-2.5 text-gray-500 font-bold pl-3 border border-[2px] border-transparent border-b-gray-200 h-1/2 p-2 bg-gray-100 duration-200 ease-in hover:bg-gray-300">Dashboard</Link>
      </div>
      
      <div className="w-full ">
       <Link to={`/profile/${username}`} className="w-full flex items-center gap-2.5 text-gray-500 font-bold pl-3 border border-[2px] border-transparent border-b-gray-200 h-1/2 p-2 bg-gray-100 duration-200 ease-in hover:bg-gray-300">Profile</Link>
      </div>
      
    <div className="w-full " onClick={() => SignOut()}>
       <div  className="w-full flex flex-col justify-center gap-1 text-gray-500 font-bold pl-3 border border-[2px] border-transparent h-1/2 p-3 bg-gray-100 duration-200 ease-in hover:bg-gray-300">
        <span className="font-bold text-black flex  items-center gap-2
        1">SignOut</span> <span className="font-mono text-[10px]">@{username}</span>
       </div>
      </div>
      
    </div>
    </AnimationWraper>
    )
}