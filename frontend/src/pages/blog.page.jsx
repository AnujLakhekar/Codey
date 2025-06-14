import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import EditorJS from "@editorjs/editorjs";
import { toast } from "react-hot-toast";
import { tools } from "../components/tools.component.jsx";
import { formatPostDate } from "../common/date.jsx";
import { queryClient } from "../main.jsx";

import BlogLikeAndShareComponent from "../components/BloglikeShareReads.jsx"

export default function BlogPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isBlogAuthor, setIsBlogAuthor] = useState(false);
  const editorRef = useRef(null);
  const navigate = useNavigate()

  const { mutate: GetBlog, isPending: FetchingBlog } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Request failed");
        }

        const data = await res.json();
        setBlog(data.message);
      console.log(data)

        const AuthUser = queryClient.getQueryData(["authUser"]);
    
        const isAuthor = AuthUser.user?._id === data.message?.author._id;
        setIsBlogAuthor(isAuthor);

        return data;
      } catch (e) {
        throw e;
      }
    },
  });

  useEffect(() => {
    GetBlog();
  }, []);

  useEffect(() => {
    if (blog?.content?.[0]?.blocks?.length) {
      setTimeout(() => {
        editorRef.current = new EditorJS({
          holder: "ReadorElement",
          tools,
          readOnly: true,
          data: blog.content[0],
          onReady: () => {
            console.log("EditorJS is ready");
          },
        });
      }, 0);

      return () => {
        if (editorRef.current?.destroy) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }
  }, [blog]);
  
  const { mutate: DeleteBlog, isPending: DeletingBlog } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blog/delete/${id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Request failed");
        }

        const data = await res.json();
        setBlog(data.message);

        navigate("/")

        return data;
      } catch (e) {
        toast.error(e.message);
        throw e;
      }
    },
  });
  
  function HandeleteBolg() {
    if (DeletingBlog) return toast.error("Deleting is in Process")
    DeleteBlog()
  }

  if (FetchingBlog) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (<>
     {blog ? (    <div className="max-w-3xl mx-auto p-4">
      {/* Banner Image */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-6">
        <img src={blog?.banner} alt="Banner" className="w-full h-64 object-cover" />
      </div>

      {/* Author Info */}
      <div className="flex justify-between items-center mb-6 text-sm text-gray-600">
        <Link
          to={`/profile/${blog?.author?.personal_info?.username}`}
          className="flex items-center gap-3"
        >
          <img
            src={blog?.author.personal_info.profile_img}
            alt="Author"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-semibold">{blog?.author.personal_info.username}</p>
            <p className="text-xs">{blog?.author.personal_info.email}</p>
          </div>
        </Link>
        <span>{formatPostDate(blog?.publishedAt)}</span>
      </div>

      {/* Edit Button */}
      {isBlogAuthor && (
        <div className="flex gap-2.5 justify-center mb-4">
          <Link to={`/editor/${blog?.blog_id}`} className="px-4 py-2 bg-gray-100 text-gray-600 rounded">Edit</Link>
          
          <button  onClick={HandeleteBolg} className="px-4 py-2 bg-gray-100 text-gray-600 rounded">{DeletingBlog ? "deleting..": "Delete"}</button>
          
        </div>
      )}
      
      <div>
      <BlogLikeAndShareComponent blog={blog} />
      </div>

      {/* Blog Title */}
      <h1 className="text-3xl font-bold mb-2">{blog?.title}</h1>

      {/* Blog Description */}
      <p className="bg-gray-50 rounded-lg text-base text-gray-700 p-4 mb-4 break-words whitespace-pre-wrap">
        {blog?.des}
      </p>

      {/* Blog Content */}
      <div
        id="ReadorElement"
        className="prose prose-lg max-w-none bg-white rounded-lg shadow p-4 min-h-[200px]"
      />
    </div>) : <div className=" m-2 bg-gray-100 rounded-lg text-gray-600 p-5"> blog not found</div>}
    </>
  );
}
