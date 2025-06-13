import {AnimationWraper} from "../common/page-animation.jsx"

export default function AlertBox({color, text}) {
  return (
    <AnimationWraper >
    <div className={`p-2 z-50 duration-300 ease-in hidden opacity-0 group-hover:flex group-hover:opacity-100 absolute bg-black rounded-lg m-2.5 text-white ${color && `text-${color}` } `}>{text}</div>
    </AnimationWraper>
    )
}