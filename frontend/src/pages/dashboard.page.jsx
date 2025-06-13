import {AnimationWraper} from "../common/page-animation.jsx"
import {queryClient} from "../main.jsx"
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import React from "react"
import BlogPostCard from "../components/blog-post.component.jsx"
import {DefaultChart} from "../carts/Graph.jsx"

export default function Dashboard() {
  const [blogs, setBlogs] = React.useState(null)
  const [chartDatabase, setChartDatabase] = React.useState(null)
  const AuthUser = queryClient.getQueryData(["authUser"]);
  
  const {mutate:FetchUserBlogs, isPending:isUserBlogsFecthing} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/all/${AuthUser?.user.personal_info.username}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      ); 
      
      const data = await res.json()
       console.log(data)
      if (!res.ok) {
        return setBlogs(null)
      }

      
       
      setBlogs(data.message)
      
      const ChartData = [];

for (let blog of data.message) {
  ChartData.push({
    name: blog.title,
    likes: blog.activity.total_likes,
    reads: blog.activity.total_reads,
  });
}

      
      setChartDatabase(ChartData)
      
      return data
      } catch (e) {
        toast.error(e.message)
      }
    }
  })
  
  
  React.useEffect(() => {
    FetchUserBlogs()
  }, [])
  
  return (
  <AnimationWraper>
       <DefaultChart data={chartDatabase} />
      <div className="m-2.5 bg-gray-100 rounded-lg">
      {blogs?.map((blog, i) => {
        return <div className={`w-full ${i !== blogs.length ? "border-b border-b-gray-200" : ""} overflow-hidden overflow-y-scroll`}><BlogPostCard content={blog} author={blog.author.personal_info} /></div>
      })}
      </div>
  </AnimationWraper>
  )
}