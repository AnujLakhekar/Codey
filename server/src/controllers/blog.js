import cloudinary from 'cloudinary';
const { v2: cloudinaryV2 } = cloudinary;
import Blogs from "../Schema/Blog.js"
import User from "../Schema/User.js"

export async function upload(req, res) {
  try {
    const {banner} = req.body;
    
    const uploadedBanner = await cloudinary.uploader.upload(banner);
    
   if (uploadedBanner) {
     return res.status(200).json({
       message: {
         url : uploadedBanner.secure_url
       }
     })
   }
    
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}
export async function createBlog(req, res) {
  try {
    const {title, des, banner, tags, content, draft = false, author} = req.body;
    
    
    const cleanTitle = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")   
    .replace(/\s+/g, "-");
    
  const randomSuffix = Math.random().toString(36).substring(2, 7);
    
    let blog_id = `${cleanTitle}-${randomSuffix}`
    
    
    if (!title.length) {
      return res.status(400).json({
        message: "You must provided title"
      })
    }
    
    let isBlogFound = await Blogs.findOne({blog_id});
    
    if (isBlogFound) {
      return res.status(400).json({
        message: "Blog With this name or id found"
      })
    }
    
    
    if (!tags.length || tags.length < 5) {
      return res.status(400).json({
        message: `Minimum 5 tags are required you have currently ${tags.length}`
      })
    }
    
    
    const newBlog = new Blogs({
      blog_id,
      title,
      banner,
      des,
      content,
      tags,
      author: req.user._id,
      draft,
    })
    
    
    await newBlog.save()
    
    let incrementNumber = draft ? 0 : 1;
    
    await User.findOneAndUpdate({_id:req.user._id}, {$inc: {"account_info.total_posts": incrementNumber}, $push : {"blogs": newBlog._id }} )
    
    res.status(200).json({
      message: newBlog
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}
export async function deleteBlog(req, res) {
  try {
    const {url} = req.body;
    
    const parts = url.split('/');
    const fileNameWithExtension = parts[parts.length - 1]; // abc123.jpg
    const fileName = fileNameWithExtension.split('.')[0]; 

    const publicId = `${fileName}`;

    const result = await cloudinary.uploader.destroy(publicId);
    
    console.log('Deleted:', result);

    res.status(200).json({
      message: "done"
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}
export async function getBlogs(req, res) {
  try {
    let maxlimit = 5;
    
    const blogs = await Blogs.find({draft: false}).populate("author", "personal_info.fullname personal_info.email personal_info.username personal_info.profile_img").sort({"publishedAt": -1}).limit(maxlimit)
    
    
    
    res.status(200).json({
      message: blogs
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}
export async function getTrandingBlogs(req, res) {
  try {
    let maxlimit = 5;
    
    const blogs = await Blogs.find({draft: false}).populate("author", "personal_info.fullname personal_info.email personal_info.username personal_info.profile_img").sort({"activity.total_reads": -1, "activity.total_likes": -1}).limit(maxlimit)
    
    
    
    res.status(200).json({
      message: blogs
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export async function getBlogWithId(req, res) {
  try {

     const {id} = req.params;
     
    const blog = await Blogs.findOne({blog_id: id}).populate("author", "personal_info.fullname personal_info.email personal_info.username personal_info.profile_img")
    
    if (!blog) {
      return res.status(400).json({
        message: "blog not found"
      })
    }
  
    
    res.status(200).json({
      message: blog
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export async function getBlogWithIdAndUpdate(req, res) {
  try {
    const {title = null, des = null, banner = null, tags = null, content = null, draft = false, author = null} = req.body;
    
    const {id} = req.params;
    
   const blog = await Blogs.findOneAndUpdate({blog_id: id}, {$set: {
      title,
      des,
      banner,
      tags,
      content,
      draft,
   }},
   {new : true}
   )
  
    
    res.status(200).json({
      message: blog
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: "Internal server error"
    })
  }
}

export async function getUserBlogs(req, res) {
  try {
    const { id } = req.params;
    
   
    // Find blogs by the author's username
    
    console.log(id)
    const blogs = await Blogs.find().populate("author", "personal_info.fullname personal_info.email personal_info.username personal_info.profile_img")
    
    const filteredBlogs = blogs?.filter(
  (f) => f?.author?.personal_info?.username === id
) || [];


    if (!filteredBlogs || filteredBlogs.length === 0) {
      return res.status(404).json({ message: "No blogs found for this user" });
    }

    res.status(200).json({ message: filteredBlogs });
  } catch (error) {
    console.error("Error in getUserBlogs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

