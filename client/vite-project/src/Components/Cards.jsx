import React from 'react'
import { download } from '../assets'
import { downloadImage } from '../utils'

function Cards({ _id, prompt, photo, name }) {
  return (
    <div className='rounded-xl group relative shadow-card hover:shadow-cardhover card overflow-hidden'>
      {/* FIXED HEIGHT AND OBJECT-COVER */}
      <img
        className='w-full h-64 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105'
        src={photo}
        alt={prompt}
      />

      {/* OVERLAY */}
      <div className='absolute bottom-0 left-0 right-0 bg-[#10131f] bg-opacity-80 text-white p-4 opacity-0 group-hover:opacity-100 transition duration-300'>
        <p className='text-sm overflow-y-auto max-h-24'>{prompt}</p>
        <div className='mt-3 flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <div className='w-7 h-7 rounded-full bg-green-700 flex justify-center items-center text-white text-sm font-semibold'>
              {name[0]}
            </div>
            <p className='text-sm font-light'>{name}</p>
          </div>
          <button type='button' onClick={() => downloadImage(_id, photo)}>
            <img src={download} alt='download' className='w-6 h-6 object-contain invert' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default Cards
