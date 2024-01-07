import React from 'react'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className='p-3'>
      <button className=' bg-green-400 rounded-xl py-2 px-4 hover:bg-green-600 transition-colors self-end
       text-gray-400 shadow-md'>
        <Link to="/login">ورود به سایت</Link>
      </button>
      <button className=' bg-zinc-500-400 rounded-xl py-2 px-4 hover:bg-zinc-600 transition-colors self-end
       text-gray-400 shadow-md'>
        <Link to="/getusers">پنل ادمین</Link>
      </button>
    </div>
  )
}

export default Home