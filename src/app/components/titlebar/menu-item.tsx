
import { PopupItem } from "./popup-item"

interface MenuItemProps {
  label: string
  submenu?: Electron.MenuItemConstructorOptions[]
  onMenuClick: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMenuMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => void
  onMenuMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => void
}

export function MenuItem({
  label,
  submenu,
  onMenuClick,
  onMenuMouseDown,
  onMenuMouseEnter,
}: MenuItemProps) {
  return (
    <div className="menu-item">
      <button
        className="menu-title"
        onClick={onMenuClick}
        onMouseEnter={onMenuMouseEnter}
        onMouseDown={onMenuMouseDown}
        onKeyDown={(e) => e.preventDefault()}
        type="button"
        tabIndex={0}
      >
        {label}
      </button>
      <PopupItem {...{ submenu }} />
    </div>
  )
}
