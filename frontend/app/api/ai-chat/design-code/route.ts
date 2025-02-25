// /app/api/ai-chat/design-code/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { designCodeCategories, designCodeDivisions, designCodeSections } from "@/utils/constants/designCodes";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

interface NextStepRequest {
  requestCategoryList?: boolean;
  requestDivisionsFor?: string[];
  requestSectionsFor?: {
    category: string;
    division: string;
  };
}

interface CategoryResponse {
  categoryCodes?: string[];
  reasoning: string;
  questions?: string[];
  elements?: { description: string; id: string }[];
  confirmedFacts?: ConfirmedFacts;
  resolvedContradictions?: string[];
  nextStep?: NextStepRequest;
}

interface DivisionResponse {
  divisionCodes?: string[];
  reasoning: string;
  questions?: string[];
  confirmedFacts?: ConfirmedFacts;
  resolvedContradictions?: string[];
  nextStep?: NextStepRequest;
}

interface SectionResponse {
  sectionCodes?: string[];
  reasoning: string;
  questions?: string[];
  confirmedFacts?: ConfirmedFacts;
  resolvedContradictions?: string[];
  nextStep?: NextStepRequest;
}

interface DesignElement {
  id: string;
  description: string;
  categoryCodes?: string[];
  categoryReasoning?: string;
  divisionCodes?: string[];
  divisionReasoning?: string;
  sectionCodes?: string[];
  sectionReasoning?: string;
  fullCodes?: string[];
  completed: boolean;
  confirmedDetails?: {
    visualAppearance?: string[];
    shape?: string[];
    arrangement?: string[];
    color?: string[];
    otherElements?: string[];
  };
}

interface ConversationState {
  elements: DesignElement[];
  currentElementId?: string;
  categoryCode?: string;
  confirmedFacts?: ConfirmedFacts;
  lastRequest?: {  // Track what the LLM last requested
    type: "category" | "division" | "section";
    categoryCode?: string;
    divisionCode?: string;
  };
}

interface Classification {
  categoryCode: string;
  categoryReasoning: string;
  divisionCodes: string[];
  divisionReasoning: string;
  sectionCodes: string[];
  sectionReasoning: string;
  fullCodes: string[];
}

interface ConfirmedFacts {
  shapes?: string[];
  arrangement?: string[];
  colors?: string[];
  otherDetails?: string[];
  lastUpdated: string;  // Timestamp of last update
}

interface ApiResponse {
  status: "need_more_info" | "complete" | "error";
  questions?: string[];
  state?: ConversationState;
  stateMessage?: string;
  categoryCode?: string;
  categoryReasoning?: string;
  classification?: Classification;
  confirmedFacts?: ConfirmedFacts;
}

// Add interface for conversation messages
interface ConversationMessage {
  role: string;
  content: string;
}

// Add helper function to format conversation history with proper types
function formatConversationHistory(context: ConversationMessage[]): string {
  // Remove any JSON state data from assistant messages
  const cleanedContext = context.map((msg: ConversationMessage) => ({
    role: msg.role,
    content: msg.role === "assistant" 
      ? msg.content.split("\n\n__STATE__:")[0].trim()
      : msg.content
  }));

  return cleanedContext.map((msg: ConversationMessage) => {
    return `${msg.role.toUpperCase()}: ${msg.content}\n\n`;
  }).join("");
}

// Add validation function at the top level
function validateAndFormatCode(
  categoryCode: string | undefined,
  divisionCode: string | undefined,
  sectionCode: string | undefined
): string {
  if (!categoryCode || !divisionCode || !sectionCode) {
    throw new Error("Missing required code components");
  }
  
  // Ensure each part is exactly 2 digits
  const category = categoryCode.padStart(2, '0').slice(-2);
  const division = divisionCode.padStart(2, '0').slice(-2);
  const section = sectionCode.padStart(2, '0').slice(-2);
  
  const fullCode = `${category}${division}${section}`;
  
  // Validate final code
  if (!/^\d{6}$/.test(fullCode)) {
    console.error("❌ Invalid code format:", { categoryCode, divisionCode, sectionCode, fullCode });
    throw new Error(`Invalid code format: ${fullCode}`);
  }
  
  return fullCode;
}

// Function to sanitize AI response and extract valid JSON
function sanitizeAndParseJSON(text: string) {
  // console.log("🔍 Raw AI Response:", text);
  
  // Remove code fences and any extra text
  const sanitized = text
    .replace(/```json\s*([\s\S]*?)\s*```/g, '$1')
    .replace(/```\s*([\s\S]*?)\s*```/g, '$1')
    .trim();

  // console.log("🧹 Sanitized Response:", sanitized);

  try {
    const parsed = JSON.parse(sanitized);
    // console.log("✅ Parsed JSON:", parsed);
    return parsed;
  } catch (err) {
    console.error("❌ JSON Parse Error:", { raw: text, sanitized });
    throw new Error("Failed to parse AI response as JSON");
  }
}

// Update getStateFromContext to remove level references
function getStateFromContext(context: Array<{ role: string; content: string }>): ConversationState {
  console.log("�� Processing Context");

  // Try to parse stored state from the context
  const stateMessage = [...context]
    .reverse()
    .find(msg => 
      msg.role === "assistant" && 
      msg.content.includes("__STATE__:")
    );

  if (stateMessage) {
    try {
      const stateJson = stateMessage.content
        .split("__STATE__:")[1]
        .trim();
      const parsedState = JSON.parse(stateJson);
      // console.log("📦 Restored State:", parsedState);
      return parsedState;
    } catch (error) {
      console.error("❌ State Parse Error:", error);
    }
  }

  // Default to minimal state if no valid state found
  const defaultState: ConversationState = {
    elements: [],
    currentElementId: undefined
  };
  console.log("🆕 Created Default State");
  return defaultState;
}

// Replace the three separate interfaces with a unified response interface
interface UnifiedResponse {
  status: "researching" | "complete";
  currentStep: "category" | "division" | "section";
  reasoning: string;
  responseToUser: string;  // Natural conversation response
  confirmedFacts?: ConfirmedFacts;
  classification?: {
    categoryCode?: string;
    categoryReasoning?: string;
    divisionCodes?: string[];
    divisionReasoning?: string;
    sectionCodes?: string[];
    sectionReasoning?: string;
    fullCodes?: string[];
  };
  nextStep: {
    requestCategoryList?: boolean;
    requestDivisionsFor?: string[];
    requestSectionsFor?: {
      category: string;
      division: string;
    };
  };
}

// Unified classification function
async function classifyDesign(
    description: string,
    state: ConversationState,
    context: ConversationMessage[]
  ): Promise<UnifiedResponse> {
    console.log("🎯 Design Classification Started");
  
    // Track what has been retrieved in this conversation
    const retrievedDivisions: Record<string, boolean> = {};
    const retrievedSections: Record<string, Record<string, boolean>> = {};
  
    // Check context to populate retrievedDivisions and retrievedSections
    context.forEach((msg) => {
      if (msg.role === "user") {
        const divisionsRegex = /AVAILABLE DIVISIONS FOR CATEGORY (\d+)/g;
        const sectionsRegex = /AVAILABLE SECTIONS FOR DIVISION (\d+\.\d+)/g;
        let match;
  
        while ((match = divisionsRegex.exec(msg.content)) !== null) {
          retrievedDivisions[match[1]] = true;
        }
  
        while ((match = sectionsRegex.exec(msg.content)) !== null) {
          const [_, fullDivisionCode] = match;
          const [category, division] = fullDivisionCode.split(".");
          if (!retrievedSections[category]) {
            retrievedSections[category] = {};
          }
          retrievedSections[category][division] = true;
        }
      }
    });
  
    // Get current element if exists
    const currentElement = state.currentElementId
      ? state.elements.find((e) => e.id === state.currentElementId)
      : undefined;
  
    const confirmedDetailsSection = currentElement?.confirmedDetails
      ? `
  CONFIRMED DETAILS (DO NOT RE-ASK ABOUT THESE):
  ${Object.entries(currentElement.confirmedDetails)
        .filter(([_, value]) => value)
        .map(([key, value]) =>
          `- ${key}: ${Array.isArray(value) ? value.join(", ") : value
          }`
        )
        .join("\n")}`
      : "";
  
    const conversationHistory = formatConversationHistory(context);
  
    // Base prompt (without availableOptions)
    const basePrompt = `You are a design code classification expert responsible for the complete classification process. Your task is to guide the conversation through all stages of classification (category, division, and section) to identify the relevant design codes. The codes should be selected in a way that allows the user to conduct a search that retrieves designs that may be considered similar, meaing BROAD selections are priotized over NARROW selections. If it seems that the user is describing a design that probably fits in a section or division, then AT LEAST assign that entire division. This aligns with our goal of getting design codes that the user can use to search and pull all designs that might appear similar. Once you have a broad basis, you can delve into deriving more specific sections by asking the user questions about the design.
  
  ABOUT DESIGN CODES:
  design search code is a numerical classification index that codifies design figurative elements into categories, divisions and sections. The design search codes act as the equivalent of a filing system for paper records. Each design element in a specific category is assigned a six-digit number. The first two numbers indicate the category; the second group of two-digit numbers indicates the division; and the third group of two-digit numbers indicates the section.
  For example, a five-pointed star would be coded in category 01 (celestial bodies, natural phenomena and geographical maps), division 01 (stars, comets) and section 03 (stars with five points). The complete design code is 01.01.03.
  The design code manual also contains explanatory notes and specific guidelines that provide instructions for specific code sections, cross-reference notes which direct users to other code categories, sections and divisions, and notes describing elements that are included or excluded from a code section.
  
  You must look at the designs from two aspects. First, you should look at the mark as if he were going to search that particular mark. Then you should identify the significant design elements and assign the appropriate codes. Second, you should use the description and think, if I was searching for another mark, what elements in the subject mark would be considered significant. Those elements should be coded. Although the first and second perspective will often coincide, there are many instances where the second perspective will dictate more comprehensive coding.
  Some marks contain more than one design figurative element, only the significant elements should be coded.
  
  Borders and carrier designs - Geometric shapes that merely serve to carry the mark are coded as carriers or borders in category 26. A geometric shape forming a border or carrier does not create a significant commercial impression, it holds or borders the design or textual matter.
  
  Coding the parts versus the whole - Certain design elements contain component parts. A component part is one which is integral to the design element as a whole.
  Where a design element contains a nondistinctive component part, the entire design, and not the component part, is coded. Generally, realistic representations of component parts are considered nondistinctive.
  A building might be coded as 07.03.06 (commercial establishments). The roof and the windows are not coded separately because they are not distinctive components; they merely form part of the entire building
  
  Where design elements contain distinctive component parts, both the design element as a whole and its distinctive components) are coded. For example a mark is coded with 02.09.15 (humans playing musical instruments) and 22.01.06 (guitars) because the guitar is a distinctive element in the mark.
  
  Code in all relevant sections - Design elements that may fall into more than one section are coded in all pertinent sections.
  
  - First two digits: category (XX.__.__)
  - Middle two digits: division (__.XX.__)
  - Last two digits: section (__.__.XX)
  
  If the specific item you are looking for is not listed, there may be a synonym or related item that will direct you to the appropriate code. For example, if the term flip-flops is not in the index, you should look for the terms sandals or shoes.
  
  Example: A five-pointed star would be coded as 01.01.03:
  - Category 01: Celestial bodies, natural phenomena and geographical maps
  - Division 01: Stars, comets
  - Section 03: Stars with five points
  
  CLASSIFICATION APPROACH:
  The individual coders for design trademarks have been instructed to look at the designs from two aspects:
  1. First, look at the mark as if you were going to search for that particular mark. Identify the significant design elements and assign the appropriate codes.
  2. Second, look at the subject mark and think: if I was searching for another mark, what elements in the subject mark would be considered significant? Those elements should be coded.
  Although these perspectives often coincide, there are many instances where the second perspective will dictate more comprehensive coding.
  
  
  CLASSIFICATION PRINCIPLES:
  1. Each design element MUST be classified with ALL applicable codes
  2. Include ANY codes that might help attorneys find similar designs during clearance searches
  3. Use full code format (XX.XX.XX) in explanations.Even when describing division or section codes, use the full code format (e.g, 26.07.XX when discussing division 07 within category 26)
  4. Base decisions on literal code descriptions
  5. Ask specific questions about uncertain features
  6. NEVER exceed 7 total codes for a design
  7. Design codes can be combined to find documents with more than one design in the mark
  
  Let's walk through the information flow:
  Initially, you only see the AVAILABLE CATEGORIES section in the prompt, because no category or division has been selected yet.
  Only after you select a category and include requestDivisionsFor in your nextStep, will the next prompt include the AVAILABLE DIVISIONS section for that specific category.
  Similarly, only after you select both a category and division and include requestSectionsFor in your nextStep, will the next prompt include the AVAILABLE SECTIONS for that specific division.
  
  
  DETAILED INSTRUCTIONS FOR EACH LEVEL:
  
  FOR CATEGORIES:
  1. Review ALL categories that could possibly apply
  2. For EACH potentially relevant category:
     - Quote its full description
     - Explain SPECIFIC features that make it relevant (not just general possibilities)
     - Ask about any uncertain features before proceeding
  3. When suggesting codes:
     - Use full code format (XX.XX.XX) in explanations
     - Point out SPECIFIC features that match each code
     - Ask the user to confirm the final code once determined
If you need to see divisions to help you decide the appropriate category:
   - Use the nextStep field and set requestDivisionsFor to an array of the category codes.
   - Your response to the user should be a segue into the next step, explaining to them that you will retreve the neccesary information. You must not ask clarifying questions until you receive the descriptions.
  
  FOR DIVISIONS:
  1. Review ALL divisions that could possibly apply
  2. For EACH potentially relevant division:
     - Quote its full description and guidelines
     - Explain SPECIFIC features that make it relevant
     - Ask about any uncertain features before proceeding
  3. When suggesting codes, and you are explaining your reasoning for selecting a division:
     - Point out SPECIFIC features that match each code
     - Ask the user to confirm the final code once determined
  4. If you need to see sections to help you decide the appropriate division:
     - Use the nextStep field and set requestSectionsFor with the category and division
     - Once ready to move on to the sections you can ask the user if they are ready to proceed. Dont ask clarifying questions about the sections until you have received the sections. Remember, you cannot see the requested sections until the next resposne arrives, so don't ask the user to describe more details after divisions have been narrowed until results arrive.
  5. For searching remember, you don't necesarily need to narrow down a field to sections if the division is specific enough for searching to retrieve relevant marks given the description. 
     The nextStep field must be used to request divisions or sections.

  FOR SECTIONS:
  1. Review ALL sections that could possibly apply
  2. For EACH potentially relevant section:
     - Quote its full description and guidelines
     - Consider both included and excluded elements
     - DO NOT ASK CLARIFYING QUESTIONS ABOUT THE SECTIONS UNTIL YOU HAVE RECEVIED THE SECTIONS
  3. When suggesting codes:
     - Provide entire description for the user to verify
     - Point out SPECIFIC features that match each code
     - Ask for confirmation once the entire code is determined
     - Spot check the codes you are citing

     The nextStep field must be used to request sections.
  
  CONVERSATION HISTORY:
  ${conversationHistory}
  
  The user's latest input: "${description}"
  
  CURRENT PROGRESS:
  ${state.elements.map(elem =>
        `- ${elem.description}: ${elem.completed
            ? `Classified with codes: ${elem.fullCodes?.join(", ")}`
            : "Not yet classified"
        }`
    ).join("\n")}
  
  ${confirmedDetailsSection}
  
  HANDLING MULTI-STEP REQUESTS:
  You will need to request additional information (divisions or sections) before providing a complete response to the user. Here's how to handle that:
  
  1. If you need divisions or sections, include the requestDivisionsFor or requestSectionsFor in your nextStep as usual.
  2. The requested information in the next turn. In the meantime, your response to the user should merely inform them of your intent to acquire the necessary information. Since, it takes one turn for you to receive the information, you CANNOT ask the user clarifying questions with respect to the divisions or sections because your questions must be directly based on the descriptions to be fetched. Once you have the neccesary data, you can begin using them to ask the user questions with the descriptions as basis.
  3. Once you have received the divisions or sections (retrievedDivisions has true) then DO NOT request those divisions or sections agian. Instead, use the divisions or sections as your data as basis for your goal of identifying the appropriate codes based on the user's description. Use the retreived descriptions to get the answers you need, the divisions or sections only need to be retrieved one time. After that, move on from requesting divisions or sections.
  
  CRITICAL INSTRUCTIONS:
  1. Maintain awareness of which classification step you're on (category, division, or section)
  2. Before proceeding to the next step, ensure current step is complete
  3. Before asking questions:
     - Check if you have enough information for the current step
     - Verify if answers would materially change the codes
     - Ensure questions are based on code descriptions
  4. At the end of your response, include a bullet list of currently confirmed facts:
     - List SPECIFIC shapes, arrangements, colors (not general categories)
     - Update any facts that have changed based on user input
     - Your response to the user should be a segue into the next step, explaining to them that you will retreve the neccesary information. You must not ask clarifying questions until you receive the descriptions.
  
  
  IMPORTANT FORMAT INSTRUCTIONS:
  - When returning division codes, use ONLY the two-digit division part (e.g., "01", "05", "07")
  - DO NOT include the category number in the division code
  - Example: For division "XX.07", return just "07" in the divisionCodes array
  - Do not use backslashes to continue lines. Output each field on one line or separate them with literal newlines.
  - No need to repeat the user's message back to them
  
  
  Your response must be valid JSON matching this structure:
  {
    "status": "researching" | "complete",
    "currentStep": "category" | "division" | "section",
    "reasoning": string,
    "responseToUser": string,
    "confirmedFacts": {
      "shapes": string[],
      "arrangement": string[],
      "colors": string[],
      "otherDetails": string[],
      "lastUpdated": string
    },
    "classification": {
      "categoryCode": string,
      "categoryReasoning": string,
      "divisionCodes": string[],
      "divisionReasoning": string,
      "sectionCodes": string[],
      "sectionReasoning": string,
      "fullCodes": string[]
    },
    "nextStep": {
      "requestCategoryList"?: boolean,
      "requestDivisionsFor"?: string[],
      "requestSectionsFor"?: {
        "category": string,
        "division": string
      }
    }
  }
  
  IMPORTANT NOTE ABOUT FORMATTING:
  - Template variables should ONLY be used inside the JSON response
  
  CRITICAL REMINDERS:
  - Return ONLY valid JSON
  - When explaining your reasoning for choosing divisions, use the format "XX.XX". When explaining the final full code, ALWAYS use full code format (XX.XX.XX) in explanations
  - Focus on specific features, not general possibilities
  - Base your responses on the literal code descriptions
  - Maintain a natural conversation flow with the user
  - the nextStep field must be used to request divisions or sections.
  - Before asking new questions, ask yourself:
    1. "Do I have enough information for this step?"
    2. "Are these questions necessary based on the literal descriptions?"
    3. "Am I asking relevant questions that will help me determine the retrieved design codes?"
    4. "If I need to see divisions or sections before proceeding, have I used the nextStep field to request them? Have I received the descriptions yet?"
  - Return ONLY valid JSON
  - Once you have determined the final codes, remember that the section codes include the division codes and the category codes. (CC.DD.SS). So you may not need to repeat all of them to the user.
    `;
  
    try {
      let currentResponse: UnifiedResponse = {
        status: "researching",
        currentStep: "category",
        reasoning: "",
        responseToUser: "",
        nextStep: { requestCategoryList: true },
      };
  
      // Reset available options for each turn
      let availableOptions = `
AVAILABLE CATEGORIES:
${Object.entries(designCodeCategories)
          .map(([code, category]) => `${code}: ${category.description}`)
          .join("\n")}`;

      // Construct the prompt
      let updatedPrompt = `${basePrompt}\n${availableOptions}\n
CONVERSATION HISTORY:
${conversationHistory}

The user's latest input: "${description}"

CURRENT PROGRESS:
${state.elements.map(elem =>
        `- ${elem.description}: ${elem.completed
          ? `Classified with codes: ${elem.fullCodes?.join(", ")}`
          : "Not yet classified"
        }`
      ).join("\n")}

${confirmedDetailsSection}`;

      console.log("\n🔍 FULL CONTEXT OF LLM INTERACTION:\n");
      console.log("📤 SENDING TO MODEL:");
      console.log("=".repeat(100));
      console.log(updatedPrompt);
      console.log("=".repeat(100));

      try {
        const result = await model.generateContent({
          contents: [{ role: "user", parts: [{ text: updatedPrompt }] }],
        });
        const response = await result.response;
        const text = response.text();
        
        console.log("\n📥 COMPLETE MODEL RESPONSE:");
        console.log("=".repeat(100));
        console.log(text);
        console.log("=".repeat(100));
        
        const parsed = sanitizeAndParseJSON(text) as UnifiedResponse;
        console.log("\n🔄 PARSED RESPONSE DETAILS:", {
          status: parsed.status,
          currentStep: parsed.currentStep,
          reasoning: parsed.reasoning,
          hasNextStep: !!parsed.nextStep,
          nextStepDetails: JSON.stringify(parsed.nextStep, null, 2),
          hasClassification: !!parsed.classification,
          classificationDetails: parsed.classification ? JSON.stringify(parsed.classification, null, 2) : "none",
          confirmedFacts: parsed.confirmedFacts ? JSON.stringify(parsed.confirmedFacts, null, 2) : "none",
          fullResponseLength: parsed.responseToUser.length
        });
        
        currentResponse = parsed;

        if (parsed.nextStep?.requestDivisionsFor || parsed.nextStep?.requestSectionsFor) {
          console.log("🤔 Processing Division or Section Request");

          let newDescription = `${description}\n\n---\n\n${parsed.responseToUser}`;

          if (parsed.nextStep.requestDivisionsFor) {
            // Filter out already retrieved divisions
            const divisionsToFetch = parsed.nextStep.requestDivisionsFor.filter(
              (categoryCode) => !retrievedDivisions[categoryCode]
            );

            if (divisionsToFetch.length > 0) {
              console.log("⤹ Fetching divisions:", divisionsToFetch);
              newDescription += `\n\n\n\n`;

              for (const categoryCode of divisionsToFetch) {
                const relevantDivisions = Object.entries(designCodeDivisions)
                  .filter(([_, div]) => div.category === categoryCode);

                if (relevantDivisions.length > 0) {
                  newDescription += `\n`
                  newDescription += `\n \nDivisions for category ${categoryCode}:\n`;
                  relevantDivisions.forEach(([divCode, div]) => {
                    newDescription += `\n${divCode}: ${div.description}\n`;
                    if (div.guidelines) {
                      newDescription += div.guidelines.map(g => `    * ${g}`).join("\n") + "\n";
                    }
                  });
                }
              }
            } else {
              console.log("⏩ Divisions already retrieved:", parsed.nextStep.requestDivisionsFor);
            }
          }

          if (parsed.nextStep.requestSectionsFor) {
            if (Array.isArray(parsed.nextStep.requestSectionsFor)) {
              console.log("⤹ Fetching sections for multiple divisions");
              newDescription += `\n`;

              for (const sectionRequest of parsed.nextStep.requestSectionsFor) {
                const { category, division } = sectionRequest;

                if (category && division) {
                  const fullDivisionCode = `${category}.${division}`;

                  if (!retrievedSections[category]?.[division]) {
                    console.log("⤹ Fetching sections for:", fullDivisionCode);

                    const relevantSections = Object.entries(designCodeSections)
                      .filter(([_, section]) => section.division === fullDivisionCode);

                    if (relevantSections.length > 0) {
                      newDescription += `\n`
                      newDescription += `\n \n Sections for division ${fullDivisionCode}.XX:\n`;
                      relevantSections.forEach(([sectionCode, section]) => {
                        newDescription += `  - ${sectionCode}: ${section.description}\n`;
                        if (section.guidelines && Array.isArray(section.guidelines)) {
                          newDescription += section.guidelines.map((g: string) => `    * ${g}`).join("\n") + "\n";
                        }
                        if (section.excludes && Array.isArray(section.excludes)) {
                          newDescription += `    Excludes:\n` + section.excludes.map((e: string) => `    * ${e}`).join("\n") + "\n";
                        }
                      });

                      // Mark this section as retrieved
                      if (!retrievedSections[category]) {
                        retrievedSections[category] = {};
                      }
                      retrievedSections[category][division] = true;
                    }
                  } else {
                    console.log("⏩ Sections already retrieved for:", fullDivisionCode);
                  }
                } else {
                  console.log("⚠️ Invalid requestSectionsFor format:", parsed.nextStep.requestSectionsFor);
                }
              }
            } else {
              console.log("⚠️ Invalid requestSectionsFor is not an array:", parsed.nextStep.requestSectionsFor);
            }
          }

          // Return a new response instead of making a recursive call
          return {
            status: "researching",
            currentStep: parsed.currentStep,
            reasoning: parsed.reasoning,
            responseToUser: newDescription,
            confirmedFacts: parsed.confirmedFacts,
            classification: parsed.classification,
            nextStep: {} // Indicate that no further action is needed
          };
        }

        // No more requests for divisions/sections, return the final response
        console.log("✅ Classification complete");
        return currentResponse;
      } catch (error) {
        console.error("❌ Design Classification Error:", error);
        throw error;
      }
    } catch (error) {
      console.error("❌ Design Classification Error:", error);
      throw error;
    }
  }
  
  // Update validation function to check for questions when researching
  function validateLLMResponse(
    response: any,
    previousFacts: ConfirmedFacts | undefined,
    userInput: string
  ): { isValid: boolean; reason?: string; needsClarification?: boolean } {
    console.log("🔍 Validating LLM Response:", {
      hasNextStep: !!response.nextStep,
      responseKeys: Object.keys(response)
    });
  
    // Check for incomplete responses
    if (!response.nextStep) {
      return { 
        isValid: false, 
        reason: "Response is missing the nextStep object" 
      };
    }
  
    return { isValid: true };
  }
  
  export async function POST(request: Request) {
    try {
      const body = await request.json() as { description: string; context: ConversationMessage[] };
      const { description, context } = body;
  
      console.log("�� Request Started:", {
        descriptionLength: description.length,
        contextMessageCount: context.length,
        lastUserMessage: context.filter(msg => msg.role === "user").pop()?.content
      });
  
      // Get current state from context
      const state = getStateFromContext(context);
      console.log("🔄 Current State:", {
        lastRequest: state.lastRequest,
        hasCurrentElement: !!state.currentElementId,
        elementCount: state.elements.length
      });
  
      // Classify the design using unified approach
      const result = await classifyDesign(description, state, context);

      // If the result indicates that divisions/sections were fetched,
      // update the context and send a new response to the client
      if (result.status === "researching" && result.responseToUser) {
        // Prepare an interim response to the client
        const interimResponse: ApiResponse = {
          status: "need_more_info",
          questions: [result.responseToUser], // Include the new user input in the response
          state: state,
          stateMessage: `${result.responseToUser}\n\n__STATE__:${JSON.stringify(state)}`,
          classification: result.classification ? {
            categoryCode: result.classification.categoryCode || "",
            categoryReasoning: result.classification.categoryReasoning || "",
            divisionCodes: result.classification.divisionCodes || [],
            divisionReasoning: result.classification.divisionReasoning || "",
            sectionCodes: result.classification.sectionCodes || ["01"],
            sectionReasoning: result.classification.sectionReasoning || "",
            fullCodes: result.classification.fullCodes || []
          } : undefined,
          confirmedFacts: result.confirmedFacts
        };
        return NextResponse.json(interimResponse);
      }
  
      // Update state based on result
      if (result.nextStep?.requestDivisionsFor) {
        state.lastRequest = {
          type: "division",
          categoryCode: result.nextStep.requestDivisionsFor[0] // Take first category if multiple
        };
      } else if (result.nextStep?.requestSectionsFor) {
        state.lastRequest = {
          type: "section",
          categoryCode: result.nextStep.requestSectionsFor.category,
          divisionCode: result.nextStep.requestSectionsFor.division
        };
      }
  
      // Prepare API response
      const response: ApiResponse = {
        status: result.status === "complete" ? "complete" : "need_more_info",
        questions: result.responseToUser ? [result.responseToUser] : undefined,
        state: state,
        classification: result.status === "complete" && result.classification ? {
          categoryCode: result.classification.categoryCode || "",
          categoryReasoning: result.classification.categoryReasoning || "",
          divisionCodes: result.classification.divisionCodes || [],
          divisionReasoning: result.classification.divisionReasoning || "",
          sectionCodes: result.classification.sectionCodes || ["01"],
          sectionReasoning: result.classification.sectionReasoning || "",
          fullCodes: result.classification.fullCodes || []
        } : undefined
      };
  
      // Update state message
      response.stateMessage = `${result.responseToUser}\n\n__STATE__:${JSON.stringify(state)}`;
  
      return NextResponse.json(response);
    } catch (error: any) {
      return NextResponse.json(
        {
          status: "error",
          error: "Failed to process request",
          details: error.message,
          type: error.name,
        },
        { status: 500 }
      );
    }
  }