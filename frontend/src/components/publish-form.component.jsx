import React, { useContext, useRef } from "react";
import {useNavigate, useParams} from "react-router-dom"
import { IoMdCloseCircle } from "react-icons/io";
import { AnimationWraper } from "../common/page-animation.jsx";
import { EditorContext } from "../pages/editor.pages.jsx";
import Tag from "../components/tags.component.jsx";
import AlertBox from "../components/AlertBox.commponent.jsx"
import { toast } from "react-hot-toast";
import { MdGeneratingTokens } from "react-icons/md";
import { useMutation } from "@tanstack/react-query";

export default function PublishEditor() {
  const maxCharacters = 200;
  const tagLimit = 25;
  const {id} = useParams()
  const charCountRef = useRef(null);
  const tagInputRef = useRef(null);
  const navigate = useNavigate()
  const {
    blog,
    setBlog,
    setEditorState,
    isUpdating, 
    setIsUpdating
  } = useContext(EditorContext);
  
  let  { banner, title, des, tags } = blog || {} ;

  const handleClose = () => setEditorState("editor");

  const handleTitleChange = (e) => {
    setBlog({ ...blog, title: e.target.value });
  };

  const handleDescriptionChange = (e) => {
    const newText = e.target.value;
    setBlog({ ...blog, des: newText });

    if (charCountRef.current) {
      const charsLeft = maxCharacters - newText.length;
      charCountRef.current.style.color = charsLeft <= 0 ? "red" : "gray";
    }
  };

  const handleDescriptionKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      const input = e.target;
      input.style.height = "auto";
      input.style.height = input.scrollHeight + 20 + "px";
    }
  };



  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = e.target.value.trim();
      console.log(tag)
      if (!tag) return;

      if (tags.includes(tag)) {
        toast.error("Tag already exists");
      } else if (tags.length >= tagLimit) {
        toast.error("Tag limit reached");
      } else {
        setBlog((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],}));

        e.target.value = "";
        
        console.log(blog)
      }
    }
  };
  
  function handleCloseTag(tag) {
    setBlog((prev) => ({
      ...prev,
      tags: tags.filter((t) => t !== tag)
    }))
  }
  
  const {mutate:PublishBlog, isPending:isBlogPublishing} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/blog/createNew`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog),
            credentials: "include",
          }
        );

        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.message || "Login failed");
        }

        const data = await res.json();
        toast.success("Blog uploaded")
        navigate("/")
        return data;
      } catch (e) {
        toast.error(e.message)
        throw e;
      }
    },
  })
  
  
  
  function handlePublishEvent(e) {
    e.preventDefault();
    
    if (isBlogPublishing) return toast.error("Current request is pending")
    
    PublishBlog()
    
  }
  
  function handlePublishDraftEvent(e) {
     e.preventDefault();
     
     setBlog((prev) => ({
       ...prev,
       draft: true,
     }))
    
    if (isBlogPublishing) return toast.error("Current request is pending")

    
    PublishBlog()
  }

 const {mutate:UpdateBlog, isPending:isUpdatingBlog} = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/blog/update/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(blog),
          credentials: "include",
        }
      );
      
      const data = await res.json()
      
      toast.success("Blog Updated")
      setTimeout(() => {
        navigate(`/blog/${id}`)
      }, 2000)
      return data
      } catch (e) {
        toast.error(e.message)
      }
    }
  })


 async function handleUpdateEvent() {
   if (isUpdatingBlog) return toast.error("updating..")
   UpdateBlog()
 }

  return (
    <AnimationWraper className="w-full flex flex-col justify-center items-start">
      {/* Close Button */}
      <div className="relative w-full">
        <button
          onClick={handleClose}
          className="absolute flex gap-2 items-center bg-white/40 rounded-full p-2 top-4 right-5 backdrop-blur-md"
        >
          <IoMdCloseCircle size={24} />
          <p>Preview</p>
        </button>
      </div>

      {/* Banner */}
      <div className="w-[340px] m-2 bg-gray-100 flex justify-center items-center h-[180px] rounded-lg p-2">
        {banner && (
          <img
            src={banner}
            alt="Banner"
            className="h-full w-auto object-cover rounded-lg"
          />
        )}
      </div>

      {/* Title & Description */}
      <div className="p-2 w-screen">
        <h1 className="font-bold text-xl mb-4">{title}</h1>

        <div className="w-full bg-white p-4 rounded-lg flex flex-col gap-4">
          {/* Title Input */}
          <div className="w-full">
            <label className="text-gray-600 block mb-1">Blog Title</label>
            <input
              type="text"
              className="w-full p-2 rounded-lg bg-gray-100 outline-none hover:bg-white border border-transparent focus:border-black transition"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter blog title"
            />
          </div>

          {/* Description Input */}
          <div className="flex p4 items-center flex-col relative">
          <div className="flex items-center w-full rounded-lg gap-2.5">
            <label className="text-gray-600 block mb-1">Blog Description</label>
            <div className="group p-1 flex justify-center items-center rounded-full m-2 "><MdGeneratingTokens  size={24} color="green" />
           <div className="hidden group-hover:flex">
           <AlertBox color="green-600" text="Creates discription with AI" />
           </div>
            </div>
          </div>
        <textarea
              className="w-full p-2 rounded-lg bg-gray-100 outline-none hover:bg-white border border-transparent focus:border-black transition resize-none"
              maxLength={maxCharacters}
              value={des}
              onChange={handleDescriptionChange}
              onKeyDown={handleDescriptionKeyDown}
              placeholder="Write a short description (max 200 characters)"
              rows={3}
            />
            <p
              ref={charCountRef}
              className="absolute bottom-[-25px] p-4 right-0 text-sm text-right m-4 flex float-right text-gray-500 mt-1"
            >
              {maxCharacters - des.length} characters left
            </p>
            
          </div>

          {/* Tag Input */}
          <div className={`${tags.length ? "bg-gray-100" : "bg-white"} p-2 rounded-lg flex flex-col gap-2.5`}>
            <label className="text-gray-600 block mb-1">Tags</label>
            <input
              ref={tagInputRef}
              className="w-full p-2
              z-50 rounded-lg bg-gray-200 outline-none hover:bg-white border border-transparent focus:border-black transition"
              placeholder="Type a tag and press Enter or comma"
              onKeyDown={handleTagKeyDown}
            />
            <div className={`${tags.length ? "flex" : "hidden"} relative z-10 top-[-5px] flex w-full  flex-wrap gap-2 pt-2 p-2  rounded-b-lg`}>
              {tags.map((tag, index) => (
               <div className="flex justify-center items-center bg-white p-1 rounded-lg" key={index}> <Tag  tag={tag} />
               <IoMdCloseCircle onClick={() => handleCloseTag(tag)} />
               </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    <div className="flex w-full justify-center items-center gap-2.5">
     {isUpdating ? <button onClick={handleUpdateEvent} className="btn-dark p-2 m-2 " >{isUpdatingBlog ? "updating" : "update"}</button> : <button onClick={handlePublishEvent} className="btn-dark p-2 m-2 " >Publish Now</button>  }
     <button onClick={handlePublishDraftEvent} className="btn-light p-2 m-2 " >Save as draft</button>
    </div>
      
    </AnimationWraper>
  );
}
