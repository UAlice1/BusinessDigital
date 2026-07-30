import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export interface BusinessSuggestion {
  name: string
  sector: string
  location: string
  address: string
  country: string
  website?: string
  description?: string
}

export async function searchBusinessesWithGroq(query: string): Promise<BusinessSuggestion[]> {
  const prompt = `You are a business directory assistant. The user is searching for: "${query}"

Return a JSON array of up to 6 REAL, well-known businesses that match this search query.
These must be REAL businesses that actually exist (not made up).
Include businesses from anywhere in the world — especially Rwanda, Africa, and globally known brands.

For each business return:
- name: exact official business name
- sector: one of [Food & Beverage, Retail, Healthcare, Education, Finance, Technology, Hospitality, Real Estate, Agriculture, Manufacturing, Beauty & Personal Care, Automotive, Logistics, Telecommunications, Energy, Media & Entertainment, General Business]
- location: city and country (e.g. "Kigali, Rwanda" or "Nairobi, Kenya")
- address: known street address or area (e.g. "KG 9 Ave, Kiyovu, Kigali")
- country: country name
- website: official website URL if known (or null)
- description: one short sentence about what the business does

IMPORTANT:
- Only return businesses you are confident actually exist
- Do NOT invent or fabricate businesses
- If the query matches a famous company (MTN, Coca-Cola, Samsung, Apple, etc.) include their real offices/branches
- Return ONLY a valid JSON array, no markdown, no extra text

Example for query "MTN":
[
  {"name":"MTN Rwanda","sector":"Telecommunications","location":"Kigali, Rwanda","address":"KG 9 Ave, Kiyovu, Kigali","country":"Rwanda","website":"https://www.mtn.co.rw","description":"Rwanda's leading mobile network operator offering voice, data and mobile money services."},
  {"name":"MTN Uganda","sector":"Telecommunications","location":"Kampala, Uganda","address":"22 Hannington Rd, Kampala","country":"Uganda","website":"https://www.mtn.co.ug","description":"Uganda's largest telecom provider."}
]`

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: 'You are a business directory assistant. Always respond with a valid JSON array only, no markdown, no extra text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.1,
    max_tokens: 1024,
  })

  const text = completion.choices[0]?.message?.content ?? '[]'
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const jsonMatch = cleaned.match(/\[[\s\S]*\]/)
  if (!jsonMatch) return []

  const results = JSON.parse(jsonMatch[0]) as BusinessSuggestion[]
  return Array.isArray(results) ? results : []
}

export interface DigitalAnalysis {
  overallScore: number
  breakdown: {
    website: number
    social: number
    payment: number
    customerEngagement: number
    digitalPresence: number
  }
  currentState: string
  keyStrengths: string[]
  gaps: string[]
}

export interface Recommendation {
  priority: 'High' | 'Medium' | 'Low'
  action: string
  impact: string
  estimatedCost: 'Low' | 'Medium' | 'High'
  timeline: string
  tools: string[]
}

export interface RecommendationResult {
  recommendations: Recommendation[]
}

export async function analyzeBusinessDigitalization(
  businessName: string,
  sector: string,
  location: string,
  additionalData: Record<string, unknown> = {}
): Promise<DigitalAnalysis> {
  const prompt = `You are a business digitalization consultant for African markets.

Analyze the following business and rate their digitalization across 5 dimensions (0-20 each):

Business Name: ${businessName}
Sector: ${sector}
Location: ${location}
Additional Data: ${JSON.stringify(additionalData)}

Rate them on:
1. Website Quality (0-20): Do they have a website? How functional is it?
2. Social Media Presence (0-20): Are they on Facebook, Instagram, Twitter, LinkedIn?
3. Online Payment Methods (0-20): Do they accept mobile money, card payments, online payments?
4. Customer Engagement Tools (0-20): Do they use CRM, email marketing, chatbots?
5. Digital Presence Overall (0-20): Google Business, reviews, online visibility?

For a business with NO known digital data, give them a baseline score of 10-20 across dimensions based on typical businesses in their sector in Rwanda/East Africa.

Respond ONLY with valid JSON in exactly this format:
{
  "overallScore": <sum of all 5 scores>,
  "breakdown": {
    "website": <0-20>,
    "social": <0-20>,
    "payment": <0-20>,
    "customerEngagement": <0-20>,
    "digitalPresence": <0-20>
  },
  "currentState": "<2-3 sentence summary of current digital state>",
  "keyStrengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>", "<gap 3>", "<gap 4>"]
}`

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a business digitalization expert for African SMEs. Always respond with valid JSON only, no markdown, no extra text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 1024,
  })

  const content = completion.choices[0]?.message?.content ?? '{}'
  // Strip any markdown code fences if present
  const cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  // Extract first valid JSON object in case of extra text
  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq returned no JSON: ' + cleaned.slice(0, 200))
  return JSON.parse(jsonMatch[0]) as DigitalAnalysis
}

export async function generateRecommendations(
  businessName: string,
  sector: string,
  location: string,
  initialScore: number,
  answers: Record<string, string | string[]>
): Promise<RecommendationResult> {
  const answersText = Object.entries(answers)
    .map(([q, a]) => `- ${q}: ${Array.isArray(a) ? a.join(', ') : a}`)
    .join('\n')

  const prompt = `You are a business digitalization consultant for African markets, specializing in Rwanda and East Africa.

Business Profile:
- Name: ${businessName}
- Sector: ${sector}
- Location: ${location}
- Current Digital Score: ${initialScore}/100

Assessment Answers:
${answersText}

Based on this information, provide 6 specific, actionable digitalization recommendations.
Focus on affordable, practical solutions available in Rwanda/East Africa.
Consider tools like: MTN MoMo, Airtel Money, Irembo, RDB portal, WhatsApp Business, Facebook Page, Instagram, Google My Business, POS systems, inventory apps.

Respond ONLY with valid JSON in exactly this format:
{
  "recommendations": [
    {
      "priority": "High",
      "action": "<specific action to take>",
      "impact": "<expected business outcome>",
      "estimatedCost": "Low",
      "timeline": "1-2 weeks",
      "tools": ["<tool 1>", "<tool 2>"]
    }
  ]
}

Provide exactly 6 recommendations. Priority should be: 3 High, 2 Medium, 1 Low.
estimatedCost must be one of: "Low", "Medium", "High"`

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: 'system',
        content:
          'You are a business digitalization expert for African SMEs. Always respond with valid JSON only, no markdown, no extra text.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
    max_tokens: 2048,
  })

  const content = completion.choices[0]?.message?.content ?? '{}'
  const cleaned = content
    .replace(/```json\s*/gi, '')
    .replace(/```\s*/g, '')
    .trim()

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('Groq returned no JSON: ' + cleaned.slice(0, 200))
  return JSON.parse(jsonMatch[0]) as RecommendationResult
}
