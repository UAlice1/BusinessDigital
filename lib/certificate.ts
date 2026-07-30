import puppeteer from 'puppeteer'

export interface CertificateData {
  businessName: string
  sector: string
  location: string
  userName: string
  initialScore: number
  scoreBreakdown: Record<string, number>
  aiRecommendations: {
    recommendations: Array<{
      priority: string
      action: string
      impact: string
      estimatedCost: string
      timeline: string
      tools: string[]
    }>
  }
  createdAt: string
  certificateId: string
}

function getScoreColor(score: number): string {
  if (score >= 70) return '#16a34a'
  if (score >= 40) return '#ca8a04'
  return '#dc2626'
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Digital Leader'
  if (score >= 60) return 'Digitally Active'
  if (score >= 40) return 'Digitally Emerging'
  return 'Digital Beginner'
}

function buildHTML(data: CertificateData): string {
  const {
    businessName,
    sector,
    location,
    userName,
    initialScore,
    scoreBreakdown,
    aiRecommendations,
    createdAt,
    certificateId,
  } = data

  const scoreColor = getScoreColor(initialScore)
  const scoreLabel = getScoreLabel(initialScore)
  const date = new Date(createdAt).toLocaleDateString('en-RW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const dimensionLabels: Record<string, string> = {
    website: 'Website Quality',
    social: 'Social Media Presence',
    payment: 'Online Payment Methods',
    customerEngagement: 'Customer Engagement',
    digitalPresence: 'Digital Presence',
  }

  const breakdownRows = Object.entries(scoreBreakdown)
    .map(([key, val]) => {
      const pct = (val / 20) * 100
      return `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
        <span style="font-size:11px;color:#6b7280;width:170px;flex-shrink:0;">${dimensionLabels[key] ?? key}</span>
        <div style="flex:1;background:#e5e7eb;border-radius:4px;height:8px;">
          <div style="width:${pct}%;background:#3b82f6;height:8px;border-radius:4px;"></div>
        </div>
        <span style="font-size:11px;font-weight:600;color:#374151;width:36px;text-align:right;">${val}/20</span>
      </div>`
    })
    .join('')

  const top3 = (aiRecommendations?.recommendations ?? []).slice(0, 3)
  const recRows = top3
    .map(
      (r, i) => `
    <div style="display:flex;gap:12px;padding:10px;background:#eff6ff;border-radius:8px;border:1px solid #bfdbfe;margin-bottom:8px;">
      <span style="font-weight:700;color:#1d4ed8;font-size:13px;flex-shrink:0;">${i + 1}.</span>
      <div>
        <p style="margin:0;font-size:12px;font-weight:600;color:#1f2937;">${r.action}</p>
        <p style="margin:4px 0 0;font-size:11px;color:#6b7280;">${r.timeline} · Cost: ${r.estimatedCost}</p>
      </div>
    </div>`
    )
    .join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; background: #f9fafb; padding: 24px; }
    .cert {
      background: white;
      max-width: 740px;
      margin: 0 auto;
      border-radius: 16px;
      overflow: hidden;
      border: 4px solid #f59e0b;
      box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    }
    .header {
      background: linear-gradient(135deg, #1d4ed8, #4338ca);
      color: white;
      padding: 28px 32px;
      text-align: center;
    }
    .header .label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #bfdbfe; }
    .header h1 { font-size: 22px; font-weight: 800; margin: 6px 0 4px; }
    .header p { font-size: 13px; color: #bfdbfe; }
    .score-band {
      background: #fffbeb;
      border-bottom: 1px solid #fde68a;
      padding: 20px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .biz-name { font-size: 22px; font-weight: 800; color: #1f2937; }
    .biz-sub { font-size: 13px; color: #6b7280; margin-top: 2px; }
    .score-num { font-size: 52px; font-weight: 900; color: ${scoreColor}; line-height: 1; }
    .score-label { font-size: 13px; font-weight: 700; color: ${scoreColor}; text-align: center; margin-top: 4px; }
    .score-denom { font-size: 11px; color: #9ca3af; text-align: center; }
    .body { padding: 24px 32px; }
    .issued-row { display: flex; justify-content: space-between; font-size: 13px; color: #6b7280; margin-bottom: 20px; }
    .section-title {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #374151;
      margin-bottom: 12px;
    }
    .footer {
      border-top: 1px solid #e5e7eb;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .footer .cert-id { font-size: 10px; color: #9ca3af; }
    .footer .brand { font-size: 12px; font-weight: 700; color: #6b7280; }
    .footer .powered { font-size: 10px; color: #9ca3af; }
  </style>
</head>
<body>
<div class="cert">
  <div class="header">
    <div class="label">PryroDigital</div>
    <h1>Digital Transformation Certificate</h1>
    <p>Business Digitalization Assessment</p>
  </div>

  <div class="score-band">
    <div>
      <div style="font-size:11px;color:#9ca3af;margin-bottom:4px;">This certifies that</div>
      <div class="biz-name">${businessName}</div>
      <div class="biz-sub">${sector} · ${location}</div>
    </div>
    <div style="text-align:center;">
      <div class="score-num">${initialScore}</div>
      <div class="score-denom">/ 100</div>
      <div class="score-label">${scoreLabel}</div>
    </div>
  </div>

  <div class="body">
    <div class="issued-row">
      <span>Issued to: <strong>${userName}</strong></span>
      <span>Date: <strong>${date}</strong></span>
    </div>

    <div style="margin-bottom:20px;">
      <div class="section-title">Score Breakdown</div>
      ${breakdownRows}
    </div>

    ${
      top3.length > 0
        ? `<div>
      <div class="section-title">Top 3 Recommendations</div>
      ${recRows}
    </div>`
        : ''
    }
  </div>

  <div class="footer">
    <div>
      <div class="cert-id">Certificate ID: ${certificateId}</div>
      <div class="cert-id" style="margin-top:2px;">Verify at: pryrodigital.rw/verify/${certificateId}</div>
    </div>
    <div style="text-align:right;">
      <div class="brand">PryroDigital</div>
      <div class="powered">Powered by AI</div>
    </div>
  </div>
</div>
</body>
</html>`
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  const html = buildHTML(data)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const page = await browser.newPage()
    await page.setContent(html, { waitUntil: 'networkidle0' })
    await page.setViewport({ width: 800, height: 1100 })

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', bottom: '20px', left: '20px', right: '20px' },
    })

    return Buffer.from(pdf)
  } finally {
    await browser.close()
  }
}
