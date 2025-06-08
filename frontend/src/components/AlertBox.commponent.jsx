

export default function AlertBox({text}) {
  return (
    <div className="p-2 z-50 duration-300 ease-in hidden opacity-0 group-hover:flex group-hover:opacity-100 absolute bg-black rounded-lg m-2.5 text-white">{text}</div>
    )
}