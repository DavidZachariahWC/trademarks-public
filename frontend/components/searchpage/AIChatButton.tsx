import { Button } from "@/components/ui/button"
import { MessageSquare } from "lucide-react"

interface AIChatButtonProps {
  serialNumber: string
  markIdentification: string
}

export function AIChatButton({ serialNumber, markIdentification }: AIChatButtonProps) {
  const handleClick = () => {
    window.open(`/ai-chat/${serialNumber}`, '_blank')
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="sm"
      className="mt-2 w-full flex items-center justify-center space-x-2 min-h-[32px] min-w-[200px] px-5"
    >
      <MessageSquare className="w-4 h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">Chat with AI about this case</span>
    </Button>
  )
} 