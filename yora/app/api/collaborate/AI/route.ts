import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { prompt, type } = await req.json()

  let systemPrompt = ""

  // 🔥 Different AI modes
  if (type === "project") {
    systemPrompt = `
You are a creative assistant.

Generate:
1. Project title
2. Short description
3. 5 relevant hashtags

Return in JSON:
{
  "title": "",
  "description": "",
  "hashtags": []
}
`
  }

  if (type === "caption") {
    systemPrompt = `
Write a short engaging social media caption.
Keep it clean and creative.
`
  }

  if (type === "growth") {
    systemPrompt = `
Give actionable growth advice for a creator.
Be specific and practical.
`
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: prompt }
    ],
  })

  return Response.json({
    result: completion.choices[0].message.content
  })
}