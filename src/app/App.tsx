import { ThemeProvider } from "@/app/components/theme-provider"

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex h-full flex-col">hi</div>
    </ThemeProvider>
  )
}
