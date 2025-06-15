import React from 'react'
import { Link, BrowserRouter, Routes, Route } from 'react-router-dom'
import { logo } from './assets'
import { Home, CreatePost } from './Pages'

function App() {

  return (
    <BrowserRouter>
      <header className="w-full px-4 sm:px-8 py-4  text-white shadow-md border-b border-b-[#e6ebf4] flex items-center justify-between">
        <Link to={"/"}>
          <img src={logo} alt="logo" className='w-28 object-contain' />
        </Link>
        <Link to={"/CreatePost"} className='font-medium bg-[#6469ff] py-2 px-4 rounded-md text-white '>
          Create
        </Link>
      </header>
      <main className='w-full sm:p-8 py-8 px-4 bg-gray-100 min-h-[calc(100vh-73px)]'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/CreatePost' element={<CreatePost />} />
        </Routes>

      </main>

    </BrowserRouter>


  )
}

export default App