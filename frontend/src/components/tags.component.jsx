import { IoMdCloseCircle } from "react-icons/io";
import React from "react"

export default function Tag({tag}) {
  
  return (
    <div className={`p-2 flex items-center gap-2 bg-white rounded-lg`}>
    <div className="">{tag}</div>
    </div>
    )
}