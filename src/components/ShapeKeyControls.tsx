import type { CSSProperties } from 'react'

type ShapeKeyControlsProps = {
  shapeKeys: string[]
  values: Record<string, number>
  onChange: (name: string, value: number) => void
}

export function ShapeKeyControls({
  shapeKeys,
  values,
  onChange,
}: ShapeKeyControlsProps) {
  if (shapeKeys.length === 0) {
    return null
  }

  return (
    <div className="controls">
      <div className="controlsHeader">
        <div className="controlsTitle">
          <span className="controlsIcon" aria-hidden="true"></span>
          <div>
            <strong>Shape Keys</strong>
            <small>Facial controls</small>
          </div>
        </div>
        <span className="controlsCount">{shapeKeys.length}</span>
      </div>
      <div className="controlsGrid">
        {shapeKeys.map((name) => {
          const value = values[name] ?? 0

          return (
            <label key={name} className="control">
            <span className="controlLabel">
              <span>{name}</span>
              <span className="controlValue">{value.toFixed(2)}</span>
            </span>
            <input
              className="controlSlider"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={value}
              style={{ '--progress': `${value * 100}%` } as CSSProperties}
              onChange={(event) => onChange(name, Number(event.target.value))}
            />
            </label>
          )
        })}
      </div>
    </div>
  )
}
