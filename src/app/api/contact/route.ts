import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const bodySchema = z.object({
  intent: z.enum(['project', 'training', 'partnership']),
  details: z.string().min(10),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const result = bodySchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json({ error: 'Validation failed', issues: result.error.issues }, { status: 422 })
  }

  const { intent, details, name, email, phone, company } = result.data

  // ── Resend integration ────────────────────────────────────────────────────
  // When RESEND_API_KEY is set in environment, emails will be dispatched.
  // Install: npm install resend
  //
  // import { Resend } from 'resend'
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'no-reply@aerovyn.com',
  //   to: 'hello@aerovyn.com',
  //   subject: `New ${intent} enquiry from ${name}`,
  //   text: [
  //     `Intent: ${intent}`,
  //     `Name: ${name}`,
  //     `Email: ${email}`,
  //     phone ? `Phone: ${phone}` : '',
  //     company ? `Organisation: ${company}` : '',
  //     `\nDetails:\n${details}`,
  //   ].filter(Boolean).join('\n'),
  // })
  // ─────────────────────────────────────────────────────────────────────────

  // Structured log for monitoring / serverless log drain
  console.log('[contact]', JSON.stringify({ intent, name, email, phone, company, detailsLength: details.length }))

  return NextResponse.json({ ok: true })
}
