import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export interface BusinessSuggestion {
  name: string; sector: string; location: string; address: string
  country: string; website?: string; description?: string
}

export async function searchBusinessesWithGroq(query: string): Promise<BusinessSuggestion[]> {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a business directory assistant. Always respond with a valid JSON array only, no markdown, no extra text.' },
      { role: 'user', content: `Search for businesses matching: "${query}". Return a JSON array of up to 6 REAL businesses. Each object: { name, sector, location, address, country, website, description }. Only real businesses. No fabrication.` },
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
  breakdown: { website: number; social: number; payment: number; customerEngagement: number; digitalPresence: number }
  currentState: string
  keyStrengths: string[]
  gaps: string[]
}

export async function analyzeBusinessDigitalization(
  businessName: string, sector: string, location: string,
  additionalData: Record<string, unknown> = {}
): Promise<DigitalAnalysis> {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a business digitalization expert for African SMEs. Always respond with valid JSON only, no markdown.' },
      { role: 'user', content: `Analyze digitalization for:
Business: ${businessName}
Sector: ${sector}
Location: ${location}
Data: ${JSON.stringify(additionalData)}

Rate 0-20 each: website quality, social media, online payments, customer engagement, digital presence.

Respond with ONLY this JSON:
{
  "overallScore": <sum 0-100>,
  "breakdown": { "website": <0-20>, "social": <0-20>, "payment": <0-20>, "customerEngagement": <0-20>, "digitalPresence": <0-20> },
  "currentState": "<2-3 sentence summary>",
  "keyStrengths": ["<s1>","<s2>","<s3>"],
  "gaps": ["<g1>","<g2>","<g3>","<g4>"]
}` },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.3,
    max_tokens: 1024,
  })
  const content = completion.choices[0]?.message?.content ?? '{}'
  const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON from Groq: ' + cleaned.slice(0, 200))
  return JSON.parse(match[0]) as DigitalAnalysis
}

// ─── Full report types ───────────────────────────────────────────────────────

export interface RoadmapItem {
  action: string
  why: string
  howTo: string
  effort: 'Low' | 'Medium' | 'High'
  estimatedCost: 'Low' | 'Medium' | 'High'
  timeline: string
  tools: string[]
}

export interface GrowthAction {
  action: string
  detail: string
  estimatedImpact: string
}

export interface FullReport {
  // Section A — Digitalization Roadmap
  sectionA: {
    quickWins: RoadmapItem[]      // 0-3 months
    mediumTerm: RoadmapItem[]     // 3-6 months
    longTerm: RoadmapItem[]       // 6-12 months
  }
  // Section B — Growth & Visibility Strategy
  sectionB: {
    visibilityScore: number       // 1-10
    digitalizationScore: number   // 1-10
    currentReach: string
    potentialReach: string
    revenueIncreaseEstimate: string
    seoTips: GrowthAction[]
    socialMediaStrategy: GrowthAction[]
    localMarketing: GrowthAction[]
    customerRetention: GrowthAction[]
  }
  // Legacy flat list for backwards compat
  recommendations: Array<{
    priority: 'High' | 'Medium' | 'Low'
    action: string
    impact: string
    estimatedCost: 'Low' | 'Medium' | 'High'
    timeline: string
    tools: string[]
  }>
}

export async function generateFullReport(
  businessName: string, sector: string, location: string,
  initialScore: number, answers: Record<string, string | string[]>,
  description?: string
): Promise<FullReport> {
  const answersText = Object.entries(answers)
    .map(([q, a]) => `- ${q}: ${Array.isArray(a) ? a.join(', ') : a}`)
    .join('\n')

  const completion = await groq.chat.completions.create({
    messages: [
      { role: 'system', content: 'You are a business digitalization consultant for African SMEs. Always respond with valid JSON only, no markdown.' },
      { role: 'user', content: `Generate a full digital transformation report for:

Business: ${businessName}
Sector: ${sector}
Location: ${location}
${description ? `Description: ${description}` : ''}
Digital Score: ${initialScore}/100

Assessment answers:
${answersText}

Return ONLY this JSON structure (no markdown, no extra text):
{
  "sectionA": {
    "quickWins": [
      { "action": "", "why": "", "howTo": "", "effort": "Low", "estimatedCost": "Low", "timeline": "0-3 months", "tools": [] }
    ],
    "mediumTerm": [
      { "action": "", "why": "", "howTo": "", "effort": "Medium", "estimatedCost": "Low", "timeline": "3-6 months", "tools": [] }
    ],
    "longTerm": [
      { "action": "", "why": "", "howTo": "", "effort": "High", "estimatedCost": "Medium", "timeline": "6-12 months", "tools": [] }
    ]
  },
  "sectionB": {
    "visibilityScore": 5,
    "digitalizationScore": 4,
    "currentReach": "",
    "potentialReach": "",
    "revenueIncreaseEstimate": "",
    "seoTips": [{ "action": "", "detail": "", "estimatedImpact": "" }],
    "socialMediaStrategy": [{ "action": "", "detail": "", "estimatedImpact": "" }],
    "localMarketing": [{ "action": "", "detail": "", "estimatedImpact": "" }],
    "customerRetention": [{ "action": "", "detail": "", "estimatedImpact": "" }]
  },
  "recommendations": [
    { "priority": "High", "action": "", "impact": "", "estimatedCost": "Low", "timeline": "", "tools": [] }
  ]
}

Rules:
- quickWins: 3 items, effort Low/Medium, timeline 0-3 months
- mediumTerm: 3 items, timeline 3-6 months
- longTerm: 2 items, timeline 6-12 months
- seoTips: 3 items
- socialMediaStrategy: 3 items
- localMarketing: 2 items
- customerRetention: 2 items
- recommendations: 6 items (3 High, 2 Medium, 1 Low) for backwards compatibility
- Focus on affordable tools available in Rwanda/East Africa (MTN MoMo, Airtel, WhatsApp Business, Google My Business, Facebook, Irembo, etc.)` },
    ],
    model: 'llama-3.3-70b-versatile',
    temperature: 0.4,
    max_tokens: 4096,
  })

  const content = completion.choices[0]?.message?.content ?? '{}'
  const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('No JSON from Groq: ' + cleaned.slice(0, 200))
  return JSON.parse(match[0]) as FullReport
}

// Keep old function for backwards compat
export async function generateRecommendations(
  businessName: string, sector: string, location: string,
  initialScore: number, answers: Record<string, string | string[]>
): Promise<{ recommendations: FullReport['recommendations'] }> {
  const report = await generateFullReport(businessName, sector, location, initialScore, answers)
  return { recommendations: report.recommendations }
}
