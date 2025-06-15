import express from 'express'
import fetch from 'node-fetch'
import * as dotenv from 'dotenv'

dotenv.config()
const router = express.Router()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_IMAGE_URL = "https://api.openai.com/v1/images/generations"

router.post('/', async (req, res) => {
  try {
    const { prompt } = req.body
    if (!prompt?.trim()) {
      return res.status(400).json({ error: 'Prompt is required' })
    }

    console.log('🧠 Prompt received:', prompt)

    const response = await fetch(OPENAI_IMAGE_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: "512x512"
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error("❌ OpenAI Error:", data.error)
      return res.status(500).json({ error: data.error.message || 'Image generation failed' })
    }

    const imageUrl = data.data?.[0]?.url
    if (!imageUrl) {
      return res.status(500).json({ error: 'No image returned' })
    }

    res.status(200).json({ photo: imageUrl })

  } catch (error) {
    console.error('❌ Server Error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router
