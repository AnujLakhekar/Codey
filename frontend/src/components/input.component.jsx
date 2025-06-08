import { FaPen } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

import React from "react"

export default function InputBox({type , placeholder, id, name, Icon, color}) {
  
  const [isPasswordEyeChanged, SetisPasswordEyeChanged] = React.useState(false)
  
  return (
    <div className="m-3">
     <div className="flex gap-2.5 bg-gray-200 p-2 rounded-lg  justify-start items-center">
      <Icon size={20} color={color || "gray"} />
      <input className="bg-transparent outline-none placeholder:text-gray-600 " type={type == "password" ?  isPasswordEyeChanged ? "text" : "password" : type} name={name} placeholder={placeholder} id={id} />
      
      {type == "password" && 
      <div onClick={() => SetisPasswordEyeChanged(!isPasswordEyeChanged)}>
      {isPasswordEyeChanged ?   <FaEye size={20} color="gray" /> :  <FaEyeSlash size={20} color="gray" />  }
      </div>}
      
     </div>
    </div>
    )
}