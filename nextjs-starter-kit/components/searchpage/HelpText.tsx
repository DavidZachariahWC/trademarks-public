import React from 'react'
import { Info } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'

interface HelpTextProps {
  text: string
}

export default function HelpText({ text }: HelpTextProps) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button className="inline-flex items-center justify-center w-4 h-4 ml-1 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Help</span>
            <Info className="w-4 h-4" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="max-w-xs px-3 py-2 text-sm leading-tight text-white bg-gray-900 rounded-lg shadow-lg"
            sideOffset={5}
          >
            {text}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}

