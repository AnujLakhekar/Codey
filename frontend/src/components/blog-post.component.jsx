import {formatPostDate} from "../common/date.jsx"
import { CiHeart } from "react-icons/ci";
import {Link} from "react-router-dom"

export default function BlogPostCard({content, author}) {
  const {title, tags, des, publishedAt, banner, activity: {total_reads, total_likes}, blog_id:id } = content;
  const {username, fullname, email, profile_img} = author;
  return (
    <Link to={`/blog/${id}`} className="flex w-full items-center gap-8 border-b md:m-5 border-b-gray-100 pb-5 mb-4">
    <div className="w-full flex flex-col justify-center items-start p-2 overflow-hidden">
      <div className="flex gap-2 items-center mb-7" >
       <img className="w-6 h-6 border border-gray-100 border-[1px] rounded-full" src={profile_img} />
       <p className="line-clamp-1">{fullname} @{username}</p>
       <p className="min-w-fit">{formatPostDate(publishedAt)}</p>
      </div>
      <h1 className="font-bold mx-4">{title}</h1>
      <p className="my-3 flex justify-center items-center m-2 overflow-x-auto text-xl font-sans leading-7 max-sm:hidden md:block line-clamp-2">{des}</p>
      
      <div className="flex items-center">
       <div className="p-2 bg-gray-100 m-2 text-gray-700 rounded-lg">
        <h3>{tags[0]}</h3>
       </div>
       <div className="flex items-center">
        <CiHeart size={20} /> {total_likes}
       </div>
       <div>
        
       </div>
      </div>
    
      
    </div>
      
     <div className="h-28 w-28 rounded-lg aspect-square p-2">
       <img className="h-28 w-28 rounded-lg aspect-square object-cover" src={banner} alt={`${username}-banner`} />
      </div>
    </Link>
    )
}