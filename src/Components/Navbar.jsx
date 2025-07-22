import React from 'react'

const Navbar = () => {
  return (
    <>
   <div className='flex justify-between bg-blue-300 py-4 rounded-md my-2 mx-3 '>
    <div className="logo">
        <span className='mx-8 font-bold text-xl'>M#TODO</span>
    </div>
    <ul className='flex gap-8 px-4'>
        <li className='cursor-pointer hover:font-bold transition-all'>Home</li>
        <li className='cursor-pointer hover:font-bold transition-all'>About</li>
        <li className='cursor-pointer hover:font-bold transition-all'>Contact</li>
    </ul>
   </div>
    
    
    </>
  )
}

export default Navbar
