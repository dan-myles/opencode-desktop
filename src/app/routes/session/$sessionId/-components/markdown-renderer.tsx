/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { memo, useMemo } from "react"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

import { cn } from "@/app/lib/utils"
import { useThemeStore } from "@/app/stores/theme.store"

interface MarkdownRendererProps {
  children: string
  className?: string
}

export const MarkdownRenderer = memo(
  ({ children, className }: MarkdownRendererProps) => {
    const { resolvedTheme } = useThemeStore()
    const isDark = resolvedTheme === "dark"

    const syntaxStyle = useMemo(() => (isDark ? oneDark : oneLight), [isDark])

    const components = useMemo(
      () => ({
        code(props: any) {
          const { children, className, ...rest } = props
          const match = /language-(\w+)/.exec(className || "")

          return match ? (
            <SyntaxHighlighter
              PreTag="div"
              language={match[1]}
              style={syntaxStyle}
              customStyle={{
                margin: 0,
                borderRadius: "0.5rem",
                fontSize: "0.875rem",
                lineHeight: "1.5",
              }}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code
              {...rest}
              className={cn(
                `bg-muted text-muted-foreground relative rounded-md px-2 py-1
                  font-mono text-sm font-medium`,
                className,
              )}
            >
              {children}
            </code>
          )
        },
        pre({ children }: any) {
          return <div className="my-4">{children}</div>
        },
        blockquote(props: any) {
          return (
            <blockquote
              {...props}
              className="border-primary/30 bg-muted/50 text-muted-foreground
                my-4 border-l-4 py-2 pl-4 italic"
            />
          )
        },
        table(props: any) {
          return (
            <div className="my-6 w-full overflow-x-auto">
              <table {...props} className="w-full border-collapse" />
            </div>
          )
        },
        th(props: any) {
          return (
            <th
              {...props}
              className="border-border bg-muted/50 text-foreground border px-4
                py-3 text-left font-semibold [&[align=center]]:text-center
                [&[align=right]]:text-right"
            />
          )
        },
        td(props: any) {
          return (
            <td
              {...props}
              className="border-border text-foreground border px-4 py-3
                [&[align=center]]:text-center [&[align=right]]:text-right"
            />
          )
        },
        ul(props: any) {
          return (
            <ul
              {...props}
              className="text-foreground my-4 ml-6 list-disc space-y-2"
            />
          )
        },
        ol(props: any) {
          return (
            <ol
              {...props}
              className="text-foreground my-4 ml-6 list-decimal space-y-2"
            />
          )
        },
        li(props: any) {
          return <li {...props} className="leading-relaxed" />
        },
        h1(props: any) {
          return (
            <h1
              {...props}
              className="text-foreground mt-6 mb-4 scroll-m-20 text-3xl
                font-bold tracking-tight first:mt-0"
            />
          )
        },
        h2(props: any) {
          return (
            <h2
              {...props}
              className="border-border text-foreground mt-6 mb-3 scroll-m-20
                border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
            />
          )
        },
        h3(props: any) {
          return (
            <h3
              {...props}
              className="text-foreground mt-6 mb-3 scroll-m-20 text-xl
                font-semibold tracking-tight first:mt-0"
            />
          )
        },
        h4(props: any) {
          return (
            <h4
              {...props}
              className="text-foreground mt-4 mb-2 scroll-m-20 text-lg
                font-semibold tracking-tight first:mt-0"
            />
          )
        },
        h5(props: any) {
          return (
            <h5
              {...props}
              className="text-foreground mt-4 mb-2 scroll-m-20 text-base
                font-semibold tracking-tight first:mt-0"
            />
          )
        },
        h6(props: any) {
          return (
            <h6
              {...props}
              className="text-foreground mt-4 mb-2 scroll-m-20 text-sm
                font-semibold tracking-tight first:mt-0"
            />
          )
        },
        p(props: any) {
          return (
            <p
              {...props}
              className="text-foreground mb-4 leading-relaxed
                [&:not(:first-child)]:mt-4"
            />
          )
        },
        a(props: any) {
          return (
            <a
              {...props}
              className="text-primary hover:text-primary/80 font-medium
                underline underline-offset-2 transition-colors"
            />
          )
        },
        strong(props: any) {
          return <strong {...props} className="text-foreground font-semibold" />
        },
        em(props: any) {
          return <em {...props} className="text-foreground italic" />
        },
        hr(props: any) {
          return (
            <hr {...props} className="border-border my-6 border-0 border-t" />
          )
        },
      }),
      [syntaxStyle],
    )

    return (
      <div className={cn("prose-custom max-w-none", className)}>
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={components}
        >
          {children}
        </Markdown>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.children === nextProps.children &&
      prevProps.className === nextProps.className
    )
  },
)
