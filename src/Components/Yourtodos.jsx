import React from 'react'

const Yourtodos = (props) => {
    return (
        <div className='flex gap-4 '>
            <div className='w-3/4 bg-white rounded-md'>
                {props.todo}
            </div>
            <div className='flex gap-3'>
                <button type="button" className='w-10 h-9 rounded-md  bg-blue-500  hover:font-bold'>Edit</button>
                <button type="button" className='w-14 h-9 rounded-md bg-blue-500  hover:font-bold'>Delete</button>
            </div>



        </div>
    )
}

export default Yourtodos
