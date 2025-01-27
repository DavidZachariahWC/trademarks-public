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
      className="mt-2 w-full"
    >
      <MessageSquare className="w-4 h-4 mr-2" />
      Chat with AI about this case
    </Button>
  )
} 