import React from 'react'
import About from './About'

const Navbar = () => {
  return (
    <>
   <div className='flex justify-between bg-blue-300 py-4 rounded-md my-2 mx-3 '>
    <div className="logo">
        <span className='mx-8 font-bold text-xl'>Mohit's Todo List</span>
    </div>
    <ul className='flex gap-8 px-4'>
   
       <a href='/'> <li className='cursor-pointer hover:font-bold transition-all hover:underline'>Home</li></a>
       <a href='/Todo'> <li className='cursor-pointer hover:font-bold transition-all hover:underline'>Todo</li></a>
       <a href='/Canlender'> <li className='cursor-pointer hover:font-bold transition-all hover:underline'>Calender</li></a>
        <a href='/sign'> <li className='cursor-pointer hover:font-bold transition-all hover:underline'>Sign in </li></a>
          
        <li className='cursor-pointer hover:font-bold transition-all hover:underline'>Contact</li>
    </ul>
   </div>
    
    
    </>
  )
}

export default Navbar
