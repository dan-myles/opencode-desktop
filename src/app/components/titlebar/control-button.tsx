import type React from "react"
import classNames from "classnames"

type ControlButtonProps = {
  name: string
  onClick:
    | React.MouseEventHandler<HTMLButtonElement>
    | React.KeyboardEventHandler<HTMLButtonElement>
  path: string
}

export function ControlButton({ name, onClick, path }: ControlButtonProps) {
  const className = classNames("control", name)
  const title = name[0].toUpperCase() + name.substring(1)

  return (
    <button
      type="button"
      aria-label={name}
      className={className}
      onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
      onKeyDown={onClick as React.KeyboardEventHandler<HTMLButtonElement>}
      title={title}
      tabIndex={0}
    >
      <svg aria-hidden="true" version="1.1" width="10" height="10">
        <path fill="currentColor" d={path} />
      </svg>
    </button>
  )
}
