import {queryClient} from "../main.jsx"
import React from "react"
import {Navigate} from "react-router-dom"
import PublishEditor from "../components/publish-form.component.jsx"
import BlogEditor from "../components/blog-editor.component.jsx"
import OldBlogEdit from "../components/OldBlog-editor.component.jsx"
import {createContext} from "react"

const blog_structure = {
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
  const [blog, setBlog] = React.useState(blog_structure);
  const [editorstate, setEditorState] = React.useState(state || "editor");
  const [textEditor, setTextEditor] = React.useState({ isReady: false });

  const user = queryClient.getQueryData(["authUser"]);

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
