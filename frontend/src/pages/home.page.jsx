import PageNavigation from "../components/inpage-navigation.component.jsx"
import {AnimationWraper} from "../common/page-animation.jsx"
import { useQuery } from "@tanstack/react-query";
import {toast} from "react-hot-toast"
import React, {useEffect, useState} from "react"
import Loader from "../components/loader.component.jsx"
import FillterBlogs from "../components/Filter.component.jsx"
import BlogPostCard from "../components/blog-post.component.jsx"
import MinimalBlogPost from "../components/nobanner-blog-post.component.jsx"

export default function HomePage() {
  const [blogs, setBlogs] = useState(null)
  const [trandinhblogs, setTrandingBlogs] = useState(null)
  
  const {data:Blogs, isLoading:FindingBlogs} = useQuery({
    queryKey: ["Blogs"],
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
        })
      
      const data = await res.json();
      setBlogs(data.message)

      return data.message
      } catch (e) {
        toast.error(e.message)
      }
    }
  })
  
  
  const {data:TrandingBlogs, isLoading:FindingTrandingBlogs} = useQuery({
    queryFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/getTrandingBlogs`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: 'include',
        })
      
      const data = await res.json();
      setTrandingBlogs(data.message)
      return data.message
      } catch (e) {
        toast.error(e.message)
      }
    }
  })
  
  useEffect(() => {
    
  }, [])
  
  return (
    <AnimationWraper>
     <div className="w-full ">
  {/* LEFT COLUMN - Blog Feed */}

    <PageNavigation defaultHidden={[]} routes={["Home", "Trending", "Fillter", "Feed"]}>
      {blogs == null ? (
        <Loader />
      ) : (
        blogs.map((blog, i) => (
          <AnimationWraper
            keyValue={i}
            transition={{ duration: 1, delay: i * 0.1 }}
          >
            <BlogPostCard content={blog} author={blog.author.personal_info} />
       {blog.length == 0 && <div
        className="p-2 m-4 text-gray-400 bg-gray-100 text-center rounded-full"
        >Posts related to this query not found </div> }
          </AnimationWraper>
        ))
      )}

      {trandinhblogs == null ? (
        <Loader />
      ) : (
        trandinhblogs.map((blog, i) => (
          <AnimationWraper
            keyValue={i}
            transition={{ duration: 1, delay: i * 0.1 }}
          >
            <MinimalBlogPost content={blog} index={i} />
          </AnimationWraper>
        ))
      )}
      
      {blogs && <FillterBlogs blogs={blogs} /> }
      
      
      <div className="p-2 rounded-lg bg-gray-100 m-4 text-gray-600">Coming soon !</div>
      
      
    </PageNavigation>
  

</div>
</AnimationWraper>
    )
}