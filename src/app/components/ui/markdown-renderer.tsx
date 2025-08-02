import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

import { useTheme } from "@/app/components/providers/theme.provider"
import { cn } from "@/app/lib/utils"

interface MarkdownRendererProps {
  children: string
  className?: string
}

export function MarkdownRenderer({
  children,
  className,
}: MarkdownRendererProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  return (
    <div
      className={cn("prose prose-lg dark:prose-invert max-w-none", className)}
    >
      <Markdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          code(props) {
            const { children, className, node, ...rest } = props
            const match = /language-(\w+)/.exec(className || "")

            return match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={isDark ? oneDark : oneLight}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            ) : (
              <code
                {...rest}
                className={cn(
                  `bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono
                    text-sm font-semibold`,
                  className,
                )}
              >
                {children}
              </code>
            )
          },
          pre({ children }) {
            return <div>{children}</div>
          },
          blockquote(props) {
            return (
              <blockquote
                {...props}
                className="border-border mt-6 border-l-2 pl-6 italic"
              />
            )
          },
          table(props) {
            return (
              <div className="my-6 w-full overflow-y-auto">
                <table {...props} className="w-full" />
              </div>
            )
          },
          th(props) {
            return (
              <th
                {...props}
                className="border-border border px-4 py-2 text-left font-bold
                  [&[align=center]]:text-center [&[align=right]]:text-right"
              />
            )
          },
          td(props) {
            return (
              <td
                {...props}
                className="border-border border px-4 py-2
                  [&[align=center]]:text-center [&[align=right]]:text-right"
              />
            )
          },
          ul(props) {
            return <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2" />
          },
          ol(props) {
            return (
              <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2" />
            )
          },
          li(props) {
            return <li {...props} className="leading-7" />
          },
          h1(props) {
            return (
              <h1
                {...props}
                className="scroll-m-20 text-4xl font-extrabold tracking-tight
                  lg:text-5xl"
              />
            )
          },
          h2(props) {
            return (
              <h2
                {...props}
                className="border-border scroll-m-20 border-b pb-2 text-3xl
                  font-semibold tracking-tight first:mt-0"
              />
            )
          },
          h3(props) {
            return (
              <h3
                {...props}
                className="scroll-m-20 text-2xl font-semibold tracking-tight"
              />
            )
          },
          h4(props) {
            return (
              <h4
                {...props}
                className="scroll-m-20 text-xl font-semibold tracking-tight"
              />
            )
          },
          p(props) {
            return (
              <p {...props} className="leading-7 [&:not(:first-child)]:mt-6" />
            )
          },
          a(props) {
            return (
              <a
                {...props}
                className="text-primary font-medium underline
                  underline-offset-4"
              />
            )
          },
          strong(props) {
            return <strong {...props} className="font-semibold" />
          },
          em(props) {
            return <em {...props} className="italic" />
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  )
}
