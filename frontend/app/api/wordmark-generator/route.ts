import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: Request) {
  try {
    const { term, optionsCount = 12 } = await request.json()

    if (!term) {
      return NextResponse.json(
        { error: 'Term is required' },
        { status: 400 }
      )
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = `

        You are a query generator for the USPTO trademark search service. Your task is to generate a maximum of **${optionsCount} relevant alternate terms** for the provided trademark term.

        ### **Guidelines for Generating Variations:**

        1. **Alternate Spellings (Letter Prepending & Phonetic Adjustments)**  
        - Add letters to the beginning of the term to form valid variations.  
            _(e.g., "Xtreme" → "Extreme")_  
        - Apply common letter substitutions:
            - "F" ↔ "Ph"  _(e.g., "Foto" → "Photo")_
            - "C" ↔ "K"  _(e.g., "Kool" → "Cool")_
            - "Z" ↔ "S"  _(e.g., "Zoom" → "Soom")_

        2. **Variations that are Relevant but Not Spelled the Same**  
        - Adjust words while preserving the original **brand identity**.  
            _(e.g., "The Wrapper Company" → "Wrapper LLC")_

        3. **Synonyms & Related Terms**  
        - Replace words with **similar meanings**.  
            _(e.g., "Fast" → "Rapid", "AI" → "Artificial Intelligence")_

        4. **Abbreviations & Acronyms**  
        - Expand or contract acronyms where relevant.  
            _(e.g., "LLM" → "Large Language Model", "USA" → "United States")_

        5. **Removing Non-Critical Words while Retaining Core Words**  
        - Identify and **preserve core words** (the **unique, brand-defining** terms).  
        - Remove **generic descriptors** (e.g., "Solutions," "Systems," "Group," "Inc.," "Co.," "Hub," "Labs," "Services").  
        - If multiple non-critical words exist, **retain at least one meaningful descriptor**.  
        - Ensure **meaningful variations** by keeping the term concise.

        6. **Homophones (Sound-Alike Words)**  
        - Generate phonetically similar words.  
            _(e.g., "Write" ↔ "Right", "Four" ↔ "For", "See" ↔ "Sea")_

        7. **Handling Special Characters & Numbers**  
        - Convert numbers/symbols to words where relevant:  
            _(e.g., "4U" → "For You", "100X Tech" → "HundredX Tech")_

        --
        Last step: remove terms that merely add or subtract a space

        ### **Output Format:**
        - **Respond ONLY with a JSON array of strings**, nothing else.  

        ---

        **Term:** "${term}"
        `

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Remove any markdown code block formatting if present
    text = text.replace(/```json\n?|\n?```/g, '').trim()
    
    // Parse the response as JSON array and add the original term
    const aiSuggestions = JSON.parse(text)
    const suggestions = [term.trim(), ...aiSuggestions]

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error in wordmark generator:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions' },
      { status: 500 }
    )
  }
} 