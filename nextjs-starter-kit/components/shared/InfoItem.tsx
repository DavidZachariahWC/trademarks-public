import React from 'react'

interface InfoItemProps {
  label: string
  value: string | number | null | undefined
  className?: string
  labelClassName?: string
  valueClassName?: string
}

export default function InfoItem({ 
  label, 
  value, 
  className = 'mb-2',
  labelClassName = 'font-semibold',
  valueClassName = ''
}: InfoItemProps) {
  return (
    <p className={className}>
      <span className={labelClassName}>{label}:</span>{' '}
      <span className={valueClassName}>{value ?? 'N/A'}</span>
    </p>
  )
} 