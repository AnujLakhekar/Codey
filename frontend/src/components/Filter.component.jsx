import React, { useState, useEffect } from "react";
import BlogPostCard from "./blog-post.component.jsx";
import {AnimationWraper} from "../common/page-animation.jsx"

export default function FillterBlogs({ blogs }) {
  const [pageState, setPageState] = useState("Home");
  const [blogsFound, setBlogsFound] = useState(blogs);
  const cata = ["all","tech", "games", "programing", "news"];

  useEffect(() => {
    // Optional effect if you want to reset blogs on page change
  }, [pageState]);

  function handleFillterFunction(e, index, category) {
    console.log(category);
    if (category == "All") {
    setBlogsFound(blogs);
    } else {
    const filteredBlogs = blogs.filter((f) => f.tags.includes(category.toLowerCase()));
    setBlogsFound(filteredBlogs);
    }
  }

  return (
    <>
      <div className="flex gap-1 w-full justify-center flex-wrap mb-4">
        {cata.map((c, i) => (
          <button
            key={i}
            onClick={(e) => handleFillterFunction(e, i, c.toLowerCase())}
            className="bg-gray-100 border p-2 text-gray-500 rounded-lg hover:bg-gray-200"
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {blogsFound.map((blog, i) => (
        <AnimationWraper keyValue={blog.blog_id} transition={{duration: 1, delay: i*.1}} >
          <BlogPostCard
            key={i}
            content={blog}
            author={blog.author.personal_info}
          />
          </AnimationWraper>
        ))}
        
        {blogsFound.length == 0 && <div
        className="p-2 m-4 text-gray-400 bg-gray-100 text-center rounded-full"
        >Posts related to this query not found </div> }
      </div>
    </>
  );
}
