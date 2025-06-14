import {useParams, Link, useNavigate} from "react-router-dom"
import React from "react"
import {queryClient} from "../main.jsx"
import { useQuery, useMutation } from "@tanstack/react-query";
import {AnimationWraper} from "../common/page-animation.jsx"
import {toast} from "react-hot-toast"
import Notfound from "../imgs/404.png"

import BlogPostCard from "../components/blog-post.component.jsx"

export default function ProfilePage() {
  const {id} = useParams()
  const [user, setUser] = React.useState(null)
  const [blogs, setBlogs] = React.useState(null)
  
  const authUser = queryClient.getQueryData(['authUser']);
  
  const {mutate:FetchUser, isPending:isUserFecthing} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      ); 
      
      const data = await res.json()
      
      if (!res.ok) {
        return toast.error(data.message)
      }
      
      setUser(data.message)
      console.log(data)
      return data
      } catch (e) {
        console.log(e)
        toast.error(e.message)
      }
    }
  })
  
  const {mutate:FetchUserBlogs, isPending:isUserBlogsFecthing} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/all/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      ); 
      
      const data = await res.json()
       console.log(data)
      if (!res.ok) {
        return toast.error(data.message)
      }

      
       
      setBlogs(data.message)
      
      
      return data
      } catch (e) {
        toast.error(e.message)
      }
    }
  })
  
  
  let isOwner = user?._id == authUser.user?._id;
  
  React.useEffect(() => {
    FetchUser()
    setTimeout(() => {
      FetchUserBlogs()
    }, 1000)
  }, [id])
  
  return (
    <AnimationWraper>
     {user ? (
      <div className="w-full flex flex-col justify-center gap-10 items-center " >
      <div>
      <img className="w-28 rounded-full mt-6" src={user?.personal_info.profile_img} />
      </div>
      
      <div className="p-4 rounded-lg  flex gap-2 bg-gray-100/70 flex-col">
        <h1>@{user?.personal_info.username}</h1>
        <h1>{user?.personal_info.email}</h1>
      </div>
      
        <div className="flex gap-2.5  p-2 rounded text-blue-400 ">
          <span className="flex gap-2.5 bg-gray border  p-2 rounded text-gray-800 ">Like {user?.account_info.total_likes}</span>
          <span className="flex gap-2.5 bg-black p-2 rounded text-white ">reads {user?.account_info.total_reads}</span>
          
          {isOwner ? (<span className="flex gap-2.5 bg-black p-2 rounded text-white ">Edit</span>) : ""}
        </div>
      
   <hr className="w-full m-2" />
      
      <div className="">
      {blogs?.map((blog, i) => {
        return <BlogPostCard content={blog} author={blog.author.personal_info} />
      })}
      </div>
      
     </div>) : (<div className="p-4 justify-center items-center flex"></div>)}
    </AnimationWraper>
    )
}