import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IoMdCloseCircle } from "react-icons/io";
import { toast } from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import EditorJS from "@editorjs/editorjs";
import {useParams} from "react-router-dom"
import {queryClient} from "../main.jsx"
import logo from "../imgs/logo.png";
import defaultBanner from "../imgs/blog_banner.png";
import { tools } from "../components/tools.component.jsx";
import {useNavigate} from "react-router-dom"
import { AnimationWraper } from "../common/page-animation.jsx";
import { EditorContext } from "../pages/editor.pages.jsx";

export default function BlogEditor() {
  const bannerInputRef = useRef(null);
  const editorRef = useRef(null);
  const [editingOldBlog, setEditingOldBlog]  = useState(false)
  const {id} = useParams()
  const navigate = useNavigate()
  const {
    blog,
    blog: { title, banner, content },
    setBlog,
    setTextEditor,
    setEditorState,
    setIsBannerUploaded, 
    isBannerUploaded,
    isUpdating, 
    setIsUpdating
  } = useContext(EditorContext);
  
  
  const user = queryClient.getQueryData(["authUser"]);

  // Setup EditorJS instance
  useEffect(() => {
    const editor = new EditorJS({
      holder: "editorElement",
      tools,
      data: content || "",
      placeholder: "Write your Questions or story here",
    });

    editorRef.current = editor;
    setTextEditor(editor);

    return () => {
      editor.isReady
        .then(() => editor.destroy())
        .catch((e) => console.error("Editor destroy failed", e));
    };
  }, []);

  // Handle Banner Image Change
  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Img = event.target.result;
      setBlog((prev) => ({ ...prev, banner: base64Img }));
    };
    reader.readAsDataURL(file);
  };

  // Upload banner to backend
  const { mutate: uploadBanner, isPending: isUploading } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/upload/banner`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ banner }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Upload failed");
      }

      const data = await res.json();
      setBlog((prev) => ({ ...prev, banner: data.message.url }));
      
      setIsBannerUploaded(true)
      
      toast.success("Banner uploaded");
      return data;
    },
    onError: (err) => toast.error(err.message),
  });

  // Handle Title Change
  const handleTitleChange = (e) => {
    const input = e.target;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setBlog((prev) => ({ ...prev, title: input.value }));
  };

  // Prevent Enter key in title
  const preventEnter = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };

  // Handle Blog Publish
  const handlePublish = async () => {
    if (!banner) return toast.error("Banner is required");
    if (!title.trim()) return toast.error("Title is required");
    
    if (!isBannerUploaded) {
      return toast.error("Banner is not uploaded");
    }

    try {
      const savedContent = await editorRef.current.save();
      const finalBlog = { ...blog, content: savedContent };
      setBlog(finalBlog);
      setEditorState("publish");
      console.log("Blog ready to publish:", finalBlog);
    } catch (err) {
      toast.error("Failed to save blog content");
      console.error(err);
    }
  };


  const {mutate:DeleteUploadedUrl, isPending:isUploadedUrlDeleting} = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/delete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: banner }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Delete failed");
      }


      setBlog((prev) => ({ ...prev, banner: '' }));
      
      setIsBannerUploaded(false)
      
      toast.success("Banner Deleted");
      return data;
    },
  })

async  function deleteUpload() {
    if (isUploadedUrlDeleting) return toast.error("Currently deleting one banner")
    
    DeleteUploadedUrl()
  }
  
  
  async function FetchBlogWithId() {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/${id}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      
      const data = await res.json()
      const fetchedBlog = data.message;
      
  if (user?.user._id !== fetchedBlog?.author?._id) {
    toast.error("Unathorized")
     navigate("/")
  }
      
      
  const  blog_structure = {
      title: fetchedBlog?.title,
      banner: fetchedBlog?.banner,
      content: fetchedBlog?.content[0],
      tags: fetchedBlog?.tags,
       des: fetchedBlog.des,
      author: {
      personal_info: fetchedBlog?.author.personal_info
  },
      draft: fetchedBlog.draft,
}
      setBlog(blog_structure)
      
      editorRef.current.render(blog_structure.content)
      
      setIsUpdating(true)
      if (blog_structure.banner) {
        setIsBannerUploaded(true)
      }
      
    } catch (e) {
      toast.error(e.message)
    }
  }
  

  React.useEffect(() => {
    if (!id) return;
    FetchBlogWithId()
  }, [])

  return (<>
   {editingOldBlog ? "" : (<div>
      <nav className="w-full h-[60px] border-b border-gray-100 flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link to="/">
            <img src={logo} alt="Logo" className="w-7 h-7" />
          </Link>
          <p className="text-gray-400 hidden md:block">
            {title.length > 0 ? title : "New Blog"}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn-dark" onClick={handlePublish}>
            {isUpdating ? "Update" : "Publish"}
          </button>
        </div>
      </nav>

      <AnimationWraper>
        {/* Banner */}
        <div className="w-full p-4">
          {banner ? (
            <>
              <AnimationWraper
                keyValue="banner"
                className="group relative w-full  rounded-lg bg-gray-100 flex justify-center items-center"
              >
                <img
                  src={banner}
                  alt="Banner"
                  onClick={() =>{
                if (banner) return;
                    bannerInputRef.current.click()}}
                  className="h-[180px]  md:h-[280px] object-cover rounded-lg p-1 cursor-pointer"
                />
                <button
                  onClick={() =>
                    setBlog((prev) => ({ ...prev, banner: "" }))
                  }
                  className="absolute right-5 top-2 w-10 h-10 bg-white rounded-full hidden group-hover:flex justify-center items-center"
                >
                  <IoMdCloseCircle size={24} />
                </button>
              </AnimationWraper>
        {isBannerUploaded ?               <button
                onClick={deleteUpload}
                className="bg-black text-white mt-2 px-4 py-2 rounded-lg"
              >
                {isUploadedUrlDeleting ? "Deleting" : "Delete"}
              </button> :
              <button
                onClick={uploadBanner}
                disabled={isUploading}
                className="bg-black text-white mt-2 px-4 py-2 rounded-lg"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button> }
            </>
          ) : (
            <AnimationWraper keyValue="no-banner">
              <img
                src={defaultBanner}
                alt="Default Banner"
                onClick={() => {
                  bannerInputRef.current.click()}}
                className="w-full h-auto rounded cursor-pointer"
              />
            </AnimationWraper>
          )}

          <input
            type="file"
            ref={bannerInputRef}
            onChange={handleBannerChange}
            accept="image/png, image/jpeg"
            hidden
          />
        </div>

        {/* Title and Editor */}
        <div className="p-4">
          <textarea
            placeholder="Blog Title"
            value={title}
            onChange={handleTitleChange}
            onKeyDown={preventEnter}
            className="w-full border border-transparent hover:border-black resize-none outline-none text-2xl font-bold placeholder-gray-300"
          />
          <hr className="my-2 bg-gray-100" />
          <div id="editorElement" />
        </div>
      </AnimationWraper>
    </div>)}
   </>);
}
