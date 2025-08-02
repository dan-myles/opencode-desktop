import { lazy, memo, Suspense, useMemo } from "react"
import Markdown from "react-markdown"
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

import { useTheme } from "@/app/components/providers/theme.provider"
import { cn } from "@/app/lib/utils"

// Lazy load SyntaxHighlighter for better performance
const SyntaxHighlighter = lazy(() =>
  import("react-syntax-highlighter").then((module) => ({
    default: module.Prism,
  })),
)

// Simple hash function for content caching
const createContentHash = (content: string) => {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return hash.toString()
}

// Cache for markdown parsing results
const markdownCache = new Map<string, JSX.Element>()

interface MarkdownRendererProps {
  children: string
  className?: string
}

export const MarkdownRenderer = memo(
  ({ children, className }: MarkdownRendererProps) => {
    const { theme } = useTheme()
    const isDark = theme === "dark"

    // Create cache key from content and theme
    const cacheKey = useMemo(
      () => `${createContentHash(children)}-${theme}`,
      [children, theme],
    )

    // Memoized theme styles
    const themeStyles = useMemo(
      () => ({
        syntaxStyle: isDark ? oneDark : oneLight,
        isDark,
      }),
      [isDark],
    )

    // Check cache first
    const cachedMarkdown = useMemo(() => {
      if (markdownCache.has(cacheKey)) {
        return markdownCache.get(cacheKey)!
      }

      // Pre-configured components for better performance
      const components = {
        code(props: any) {
          const { children, className, node, ...rest } = props
          const match = /language-(\w+)/.exec(className || "")

          return match ? (
            <Suspense
              fallback={
                <pre className="bg-muted rounded p-3 text-sm">
                  <code>{String(children).replace(/\n$/, "")}</code>
                </pre>
              }
            >
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={themeStyles.syntaxStyle}
                customStyle={{
                  margin: 0,
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            </Suspense>
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
        pre({ children }: any) {
          return <div>{children}</div>
        },
        blockquote(props: any) {
          return (
            <blockquote
              {...props}
              className="border-border mt-6 border-l-2 pl-6 italic"
            />
          )
        },
        table(props: any) {
          return (
            <div className="my-6 w-full overflow-y-auto">
              <table {...props} className="w-full" />
            </div>
          )
        },
        th(props: any) {
          return (
            <th
              {...props}
              className="border-border border px-4 py-2 text-left font-bold
                [&[align=center]]:text-center [&[align=right]]:text-right"
            />
          )
        },
        td(props: any) {
          return (
            <td
              {...props}
              className="border-border border px-4 py-2
                [&[align=center]]:text-center [&[align=right]]:text-right"
            />
          )
        },
        ul(props: any) {
          return <ul {...props} className="my-6 ml-6 list-disc [&>li]:mt-2" />
        },
        ol(props: any) {
          return (
            <ol {...props} className="my-6 ml-6 list-decimal [&>li]:mt-2" />
          )
        },
        li(props: any) {
          return <li {...props} className="leading-7" />
        },
        h1(props: any) {
          return (
            <h1
              {...props}
              className="scroll-m-20 text-4xl font-extrabold tracking-tight
                lg:text-5xl"
            />
          )
        },
        h2(props: any) {
          return (
            <h2
              {...props}
              className="border-border scroll-m-20 border-b pb-2 text-3xl
                font-semibold tracking-tight first:mt-0"
            />
          )
        },
        h3(props: any) {
          return (
            <h3
              {...props}
              className="scroll-m-20 text-2xl font-semibold tracking-tight"
            />
          )
        },
        h4(props: any) {
          return (
            <h4
              {...props}
              className="scroll-m-20 text-xl font-semibold tracking-tight"
            />
          )
        },
        p(props: any) {
          return (
            <p {...props} className="leading-7 [&:not(:first-child)]:mt-6" />
          )
        },
        a(props: any) {
          return (
            <a
              {...props}
              className="text-primary font-medium underline underline-offset-4"
            />
          )
        },
        strong(props: any) {
          return <strong {...props} className="font-semibold" />
        },
        em(props: any) {
          return <em {...props} className="italic" />
        },
      }

      const rendered = (
        <Markdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={components}
        >
          {children}
        </Markdown>
      )

      // Cache the result
      markdownCache.set(cacheKey, rendered)

      // Limit cache size to prevent memory leaks
      if (markdownCache.size > 100) {
        const firstKey = markdownCache.keys().next().value
        markdownCache.delete(firstKey)
      }

      return rendered
    }, [cacheKey, children, themeStyles])

    return (
      <div
        className={cn("prose prose-lg dark:prose-invert max-w-none", className)}
      >
        {cachedMarkdown}
      </div>
    )
  },
  (prevProps, nextProps) => {
    // Only re-render if content or className changed
    return (
      prevProps.children === nextProps.children &&
      prevProps.className === nextProps.className
    )
  },
)
