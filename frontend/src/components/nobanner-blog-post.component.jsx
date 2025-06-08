import {formatPostDate} from "../common/date.jsx"
import {Link} from "react-router-dom"


export default function MinimalBlogPost({content, index}) {
  const {title, tags, des, publishedAt, banner, activity: {total_reads, total_likes}, blog_id:id } = content;
  const {username, fullname, email, profile_img} = content.author.personal_info;
  return (
    <Link className="flex  gap-5 mb-4 items-center border-b border-gray-100 justify-start " to={`/blog/${id}`}>
      <div>
        <h1 className="m-5 font-bold text-gray-400 flex items-center">{index <= 10 ? "0" + (index+1) : index }</h1>
      </div>
      
      <div className="flex flex-col justify-center items-start">
       <div className="flex justify-start
      gap-5  p-5 " >
       <img className="w-6 h-6 border border-gray-100 border-[1px] rounded-full" src={profile_img} />
       <div className="flex gap-2 justify-start items-center">
       <p className="line-clamp-1">{fullname} @{username}</p>
       <p className="min-w-fit">{formatPostDate(publishedAt)}</p>
       </div>
      </div>
    <h1 className="font-bold mx-4 pb-2">{title}</h1>
      </div>

    </Link>
    )
}