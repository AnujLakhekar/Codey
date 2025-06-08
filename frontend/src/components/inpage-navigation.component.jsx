import React, {useState, useRef, useEffect} from "react"

export default function PageNavigation({routes, defaultHidden,defaultActiveTabIndex = 0, children}) {
  const activeTabLineRef = useRef(null)
  const activeTab = useRef(null)
  
  const [pageNavigationIndex, setPageNavigationIndex] = useState(defaultActiveTabIndex)
  
  function ChangePageState(btn, i) {
    let {offsetWidth, offsetLeft } = btn;
    
    activeTabLineRef.current.style.width = offsetWidth + "px"
    activeTabLineRef.current.style.left = offsetLeft + "px"
    
    setPageNavigationIndex(i)
  }
  
  useEffect(() => {
    ChangePageState(activeTab.current, 0)
  }, [])
  
  return (<>
    <div className="relative ml-2 mr-2 bg-white mb-8 border-b border-gray-100 flex flex-nowrap overflow-x-auto">
     {routes.map((route, i) => {
       return (
         <button
         ref={i == defaultActiveTabIndex ? activeTab : null}
         onClick={(e) => ChangePageState(e.target, i) }
         className={"p-4 px-5 capitalize " + (pageNavigationIndex == i ? "text-black " : "text-gray-300 ") + (defaultHidden.includes(route) ? "md:hidden" : "") } key={i}>
          {route}
         </button>
         )
     })}
     
     <hr ref={activeTabLineRef} className="absolute border border-black bottom-0 duration-300" />
    </div>
    
    {Array.isArray(children) ? children[pageNavigationIndex] : children}
    
    </>
    )
}