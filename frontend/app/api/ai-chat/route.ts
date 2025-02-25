// /app/api/ai-chat/route.ts newly rewritten
import { NextResponse } from "next/server"
import { formatCaseForAI } from "@/utils/formatCaseForAI"

export async function POST(request: Request) {
  try {
    // Extract payload from the client request
    const { message, caseData, context } = await request.json()

    // Validate required fields on the client side
    if (!message || !caseData) {
      return NextResponse.json(
        { error: "Missing required fields: message and caseData are required." },
        { status: 400 }
      )
    }

    // Format the case data with the utility
    const formattedCaseData = formatCaseForAI(caseData)

    // Build payload for the backend
    const payload = {
      message,             // User's latest message
      caseData: formattedCaseData,  // Already formatted case data
      context: context || [] // Conversation history, if any
    }

    // Forward the payload to the backend endpoint
    const backendResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ai_chat_eb`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    // Forward the backend response back to the client
    const result = await backendResponse.json()
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Error in route.ts POST:", error)
    return NextResponse.json(
      { error: "Internal client error", details: error.message },
      { status: 500 }
    )
  }
}
