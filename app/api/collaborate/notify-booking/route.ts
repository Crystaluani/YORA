import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { artistEmail, artistName, requesterName, requesterEmail, eventType, eventDate, eventLocation, budget, message } = await req.json()

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: "YORA <onboarding@resend.dev>",
        to: [artistEmail],
        subject: `New booking request from ${requesterName}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
          </head>
          <body style="margin:0;padding:0;background:#080808;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
            <div style="max-width:560px;margin:0 auto;padding:40px 20px;">

              <!-- Logo -->
              <div style="margin-bottom:32px;">
                <span style="font-size:24px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">
                  YOR<span style="color:#d4af37;">A</span>
                </span>
              </div>

              <!-- Card -->
              <div style="background:#0f0f0f;border:1px solid #1a1a1a;border-radius:16px;padding:32px;">

                <!-- Header -->
                <div style="border-bottom:1px solid #1a1a1a;padding-bottom:20px;margin-bottom:24px;">
                  <p style="font-size:12px;color:#d4af37;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 8px;">New Booking Request</p>
                  <h1 style="font-size:22px;font-weight:700;color:#ffffff;margin:0;line-height:1.3;">
                    Hey ${artistName}, someone wants to book you!
                  </h1>
                </div>

                <!-- Requester -->
                <p style="font-size:15px;color:#888;margin:0 0 24px;line-height:1.6;">
                  <strong style="color:#fff;">${requesterName}</strong> has sent you a booking request via YORA.
                </p>

                <!-- Details grid -->
                <div style="background:#080808;border-radius:12px;padding:20px;margin-bottom:24px;">
                  ${[
                    { label: "Event Type", value: eventType },
                    { label: "Event Date", value: eventDate },
                    { label: "Location",   value: eventLocation },
                    { label: "Budget",     value: budget || "Not specified" },
                    { label: "Contact",    value: requesterEmail },
                  ].map(item => `
                    <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #111;">
                      <span style="font-size:12px;color:#555;text-transform:uppercase;letter-spacing:0.08em;">${item.label}</span>
                      <span style="font-size:13px;color:#aaa;text-align:right;max-width:60%;">${item.value}</span>
                    </div>
                  `).join("")}
                </div>

                <!-- Message -->
                ${message ? `
                  <div style="background:#080808;border-left:3px solid #d4af37;padding:14px 16px;border-radius:0 8px 8px 0;margin-bottom:24px;">
                    <p style="font-size:13px;color:#666;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em;">Their message</p>
                    <p style="font-size:14px;color:#888;margin:0;line-height:1.65;">"${message}"</p>
                  </div>
                ` : ""}

                <!-- CTA -->
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://yoraapp.vercel.app"}/dashboard"
                   style="display:block;background:#d4af37;color:#000;font-weight:700;font-size:15px;text-align:center;padding:14px 24px;border-radius:12px;text-decoration:none;margin-bottom:16px;">
                  View & Respond in Dashboard
                </a>

                <p style="font-size:12px;color:#444;text-align:center;margin:0;">
                  Reply directly to ${requesterEmail} to discuss details.
                </p>

              </div>

              <!-- Footer -->
              <p style="font-size:11px;color:#333;text-align:center;margin-top:24px;line-height:1.6;">
                You received this because you have a profile on YORA.<br/>
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://yoraapp.vercel.app"}" style="color:#555;text-decoration:none;">yoraapp.vercel.app</a>
              </p>

            </div>
          </body>
          </html>
        `
      })
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
