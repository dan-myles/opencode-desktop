import { cn } from "@/app/lib/utils"

interface CodeBoxProps {
  children: React.ReactNode
  className?: string
}

export function CodeBox({ children, className }: CodeBoxProps) {
  return (
    <code 
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-mono",
        "bg-muted text-muted-foreground",
        "dark:bg-muted dark:text-muted-foreground",
        className
      )}
    >
      {children}
    </code>
  )
}