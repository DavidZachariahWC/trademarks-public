import React from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

interface InfoItemProps {
  label: string
  value: string | number | null | undefined
  className?: string
  labelClassName?: string
  valueClassName?: string
  tooltip?: string
}

export default function InfoItem({ 
  label, 
  value, 
  className = 'mb-2',
  labelClassName = 'font-semibold',
  valueClassName = '',
  tooltip
}: InfoItemProps) {
  const labelContent = tooltip ? (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger className="cursor-help">
          {label}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-xs px-3 py-2 text-sm leading-tight text-white bg-gray-900 rounded-lg shadow-lg"
            sideOffset={5}
          >
            {tooltip}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  ) : (
    label
  );

  return (
    <p className={className}>
      <span className={labelClassName}>
        {labelContent}
      </span>{' '}
      <span className={valueClassName}>{value ?? 'N/A'}</span>
    </p>
  )
} 