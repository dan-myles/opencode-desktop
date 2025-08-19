import { motion } from "motion/react"

interface ShimmerContainerProps {
  isAnimating: boolean
  children: React.ReactNode
  className?: string
}

export function ShimmerContainer({
  isAnimating,
  children,
  className,
}: ShimmerContainerProps) {
  return (
    <motion.div
      className={className}
      animate={
        isAnimating
          ? {
              backgroundPosition: ["200% 0", "-200% 0"],
            }
          : {}
      }
      transition={{
        duration: 2,
        repeat: isAnimating ? Infinity : 0,
        ease: "linear",
      }}
      style={{
        backgroundImage: isAnimating
          ? "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)"
          : "none",
        backgroundSize: "200% 100%",
      }}
    >
      {children}
    </motion.div>
  )
}
