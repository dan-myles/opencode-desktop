export function Shorcut({ label, kbd }: { label: string; kbd: string }) {
  return (
    <div className="flex items-center gap-2">
      <span>{label}</span>
      <kbd
        className="bg-muted text-muted-foreground pointer-events-none
          inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono
          text-[10px] font-medium opacity-100 select-none"
      >
        <span className="text-xs">⌘</span>
        <span>{kbd}</span>
      </kbd>
    </div>
  )
}
