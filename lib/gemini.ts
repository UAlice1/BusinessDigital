import axios from 'axios'

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? ''
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`

export interface BusinessSuggestion {
  name: string
  sector: string
  location: string
  address: string
  country: string
  website?: string
  description?: string
}

export async function searchBusinessesWithGemini(query: string): Promise<BusinessSuggestion[]> {
  const prompt = `You are a business directory assistant. The user is searching for: "${query}"

Return a JSON array of up to 6 REAL, well-known businesses that match this search query.
These must be REAL businesses that actually exist globally (not made up).
Include businesses from anywhere in the world — not just Rwanda.

For each business return:
- name: exact official business name
- sector: one of [Food & Beverage, Retail, Healthcare, Education, Finance, Technology, Hospitality, Real Estate, Agriculture, Manufacturing, Beauty & Personal Care, Automotive, Logistics, Telecommunications, Energy, Media & Entertainment]
- location: city and country (e.g. "Kigali, Rwanda" or "Nairobi, Kenya" or "New York, USA")
- address: known street address or area (e.g. "KG 9 Ave, Kiyovu, Kigali")
- country: country name
- website: official website URL if known (or null)
- description: one short sentence about what the business does

IMPORTANT:
- Only return businesses you are confident actually exist
- Do NOT invent or fabricate businesses
- If the query matches a famous company (MTN, Coca-Cola, Samsung, Apple, etc.) include their real offices/branches
- If the query is a local Rwandan/African business, include real ones you know about
- Return ONLY valid JSON array, no markdown, no extra text

Example for query "MTN":
[
  {"name":"MTN Rwanda","sector":"Telecommunications","location":"Kigali, Rwanda","address":"KG 9 Ave, Kiyovu, Kigali","country":"Rwanda","website":"https://www.mtn.co.rw","description":"Rwanda's leading mobile network operator offering voice, data and mobile money services."},
  {"name":"MTN Uganda","sector":"Telecommunications","location":"Kampala, Uganda","address":"22 Hannington Rd, Kampala","country":"Uganda","website":"https://www.mtn.co.ug","description":"Uganda's largest telecom provider."}
]`

  const response = await axios.post(
    GEMINI_URL,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 1024,
      },
    },
    { headers: { 'Content-Type': 'application/json' } }
  )

  const text: string = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '[]'

  // Strip markdown fences if present
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  const results = JSON.parse(jsonMatch[0]) as BusinessSuggestion[]
  return Array.isArray(results) ? results : []
}
