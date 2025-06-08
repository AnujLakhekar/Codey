import {AnimatePresence, motion} from "framer-motion"

export function AnimationWraper({children, initial = {opacity : 0}, animate={opacity: 1}, keyValue, transition={duration: 1}, className}) {
  return (
    <AnimatePresence>
    <motion.div
    className={className}
    key={keyValue}
    initial={initial}
    animate={animate}
    transition={transition}
    >
     {children}
    </motion.div>
    </AnimatePresence>
    )
}