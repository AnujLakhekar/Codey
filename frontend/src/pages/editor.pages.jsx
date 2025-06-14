import {queryClient} from "../main.jsx"
import React from "react"
import {Navigate,  Link, useNavigate} from "react-router-dom"
import PublishEditor from "../components/publish-form.component.jsx"
import BlogEditor from "../components/blog-editor.component.jsx"
import OldBlogEdit from "../components/OldBlog-editor.component.jsx"
import {useParams} from "react-router-dom"
import { toast } from "react-hot-toast";
import {createContext} from "react"

let blog_structure = {
  title: '',
  banner: '',
  content: [],
  tags: [],
  des: '',
  author: {
    personal_info: {}
  },
  draft: false,
}

export const EditorContext = createContext({})

export function Editor({ state }) {
  const [authUser, setAuthUser] = React.useState(null);
  const [isBannerUploaded, setIsBannerUploaded] = React.useState(false);
  const {id} = useParams()
  const [blog, setBlog] = React.useState(blog_structure);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [editorstate, setEditorState] = React.useState(state || "publish");
  const [textEditor, setTextEditor] = React.useState({ isReady: false });

  const user = queryClient.getQueryData(["authUser"]);
  
  const navigate = useNavigate()

  React.useEffect(() => {
    if (!user || !user.user) return;

    setAuthUser(user);
    setBlog(prev => ({
      ...prev,
      author: {
        personal_info: {
          username: user.user.personal_info.username || "",
          email: user.user.personal_info.email || "",
          profile_img: user.user.personal_info.profile_img || "",
          createdAt: new Date().toISOString(),
        },
      },
    }));
  }, [user]);



  return (
    <EditorContext.Provider
      value={{
        editorstate,
        setEditorState,
        blog,
        setBlog,
        textEditor,
        setTextEditor,
        isBannerUploaded,
        setIsBannerUploaded,
        isUpdating, 
        setIsUpdating
      }}
    >
      {authUser ? (
        editorstate === "editor" ? (
          <BlogEditor />
        ) : editorstate === "publish" ? (
          <PublishEditor />
        ) : (
         <OldBlogEdit />
        )
      ) : editorstate === state ? (
        <OldBlogEdit />
      ) : (
          <BlogEditor />
      )}
    </EditorContext.Provider>
  );
}
