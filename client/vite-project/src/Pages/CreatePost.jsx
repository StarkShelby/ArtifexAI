import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { preview } from '../assets'
import { getRandomPrompts } from '../utils'
import { FormField, Loader } from '../Components'
import { mockImages } from '../assets/mockImages'
import { convertImageUrlToBase64 } from '../utils/index.js'
import { convertFileToBase64 } from '../utils'

function CreatePost() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  })

  const [generatingImg, setGeneratingImg] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompts(form.prompt)
    setForm({ ...form, prompt: randomPrompt })
  }
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await convertFileToBase64(file);
      setForm({ ...form, photo: base64 });
    }
  }


  const generateImage = async () => {
    if (!form.prompt.trim()) {
      return alert('Please enter a prompt')
    }

    setGeneratingImg(true)

    try {
      const response = await fetch('https://artifexai-server.onrender.com/api/v1/openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: form.prompt }),
      })

      const contentType = response.headers.get('content-type')

      if (!contentType?.includes('application/json')) {
        const errorText = await response.text()
        throw new Error(`Unexpected response: ${errorText.slice(0, 100)}`)
      }

      const data = await response.json()

      if (data.photo) {
        setForm({ ...form, photo: data.photo })
      } else {
        throw new Error('API did not return photo')
      }

    } catch (error) {
      console.warn('⚠️ API failed, using mock image:', error.message)
      const fallbackImage = mockImages[Math.floor(Math.random() * mockImages.length)]
      // 🔁 Convert mock image URL to base64 before setting it
      const base64Image = await convertImageUrlToBase64(fallbackImage)
      setForm({ ...form, photo: base64Image })
    } finally {
      setGeneratingImg(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.prompt && form.photo) {
      setLoading(true)

      try {
        let photoToSend = form.photo

        // 🔍 If it's a URL (mock image), convert it to base64
        if (form.photo.startsWith('http')) {
          photoToSend = await convertImageUrlToBase64(form.photo)
        }

        const response = await fetch("https://artifexai-server.onrender/api/v1/post", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...form,
            photo: photoToSend
          })
        })

        await response.json()
        navigate('/')
      } catch (error) {
        alert(error.message)
      } finally {
        setLoading(false)
      }
    } else {
      alert('Please enter a prompt and generate or upload an image')
    }
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <div>
        <h1 className='text-black text-3xl font-bold'>
          The Community Showcase
        </h1>
        <p className='text-gray-500 text-sm mt-2 max-w-xl'>
          Create a vibrant gallery of AI-generated artwork through the power of OpenAI. Imagine. Create. Share.
        </p>
      </div>

      <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-5'>
          <FormField
            label="Your Name"
            type="text"
            name="name"
            placeholder="John Doe"
            value={form.name}
            handleChange={handleChange}
          />

          <FormField
            label="Prompt"
            type="text"
            name="prompt"
            placeholder="A plush toy robot sitting against a yellow wall"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          {/* Upload Image */}
          <div className='flex flex-col gap-2'>
            <label className='text-gray-700 text-sm font-medium'>Upload Your Own Image (.jpg/.png)</label>
            <input
              type='file'
              accept='image/*'
              onChange={handleImageUpload}
              className='border border-gray-300 p-2 rounded-md'
            />
          </div>

          {/* Image Preview */}
          <div className='relative w-100 h-80 bg-gray-100 border border-gray-300 rounded-lg p-3'>
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className='w-full h-full object-cover rounded-md'
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className='w-9/12 h-9/12 object-contain opacity-40 mx-auto mt-6'
              />
            )}

            {generatingImg && (
              <div className='absolute inset-0 flex justify-center items-center bg-black bg-opacity-50 rounded-lg'>
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className='mt-5 flex gap-5'>
          <button
            type='button'
            onClick={generateImage}
            className='text-white bg-green-700 hover:bg-green-800 font-medium rounded-md text-sm px-5 py-2 w-full sm:w-auto'
          >
            {generatingImg ? 'Generating...' : 'Generate with AI'}
          </button>
        </div>

        <div className='mt-2 text-sm text-gray-500'>
          <p>Created something awesome? Share it with the community.</p>
        </div>

        <div className='mt-6'>
          <button
            type='submit'
            className='text-white bg-[#6469ff] hover:bg-blue-700 font-medium rounded-md text-sm px-5 py-2 w-full sm:w-auto'
          >
            {loading ? 'Sharing...' : 'Share with the community'}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CreatePost
