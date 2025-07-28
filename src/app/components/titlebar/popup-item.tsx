interface PopupItemProps {
  submenu?: Electron.MenuItemConstructorOptions[]
}

export function PopupItem({ submenu }: PopupItemProps) {
  return (
    <div className="menu-popup">
      {submenu?.map((menuItem, menuItemIndex) => {
        if (menuItem.type === "separator") {
          return (
            <div
              key={`menu_${menuItemIndex}_popup_item_${menuItemIndex + 1}`}
              className="popup-item-separator"
            />
          )
        }

        return (
          <button
            key={`menu_${menuItemIndex}_popup_item_${menuItemIndex + 1}`}
            className="menu-popup-item"
            onMouseDown={(e) => e.preventDefault()}
            onKeyDown={(e) => e.preventDefault()}
            type="button"
            tabIndex={0}
          >
            <div className="popup-item-name">{menuItem.label}</div>
            <div className="popup-item-shortcut">{menuItem.accelerator}</div>
          </button>
        )
      })}
    </div>
  )
}

