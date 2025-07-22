import './App.css'
import Navbar from './Components/Navbar'
import { v4 as uuidv4 } from 'uuid';


import { useState, useEffect } from 'react'

function App() {
  const [todo, settodo] = useState("")
  const [todos, settodos] = useState([])

  useEffect(() => {
    let todostring = localStorage.getItem("todos")
    if (todostring) {
      let todos = JSON.parse(localStorage.getItem("todos"))
      settodos(todos)
    }
  }, [])




  const saveToLs = () => {
    localStorage.setItem("todos", JSON.stringify(todos))

  }



  const handleAdd = (params) => {
    settodos([...todos, { id: uuidv4(), todo, iscompleted: false }])
    settodo("")
    saveToLs()


  }
  const changeHandle = (e) => {
    settodo(e.target.value)

  }
  const handleEdit = (e, id) => {
    let t = todos.filter(item => {
      return item.id === id
    });
    settodo(t[0].todo)
    let newtodo = todos.filter(item => {
      return item.id !== id
    });
    settodos(newtodo)
    saveToLs()

  }



  const handleDelete = (e, id) => {

    let newtodo = todos.filter(item => {
      return item.id !== id
    });
    settodos(newtodo)
    saveToLs()
  }


  const Handlecheckbox = (e) => {
    let id = e.target.name

    let index = todos.findIndex(item => {
      return item.id === id
    })

    let newtodo = [...todos];
    newtodo[index].isCompleted = !newtodo[index].isCompleted;
    settodos(newtodo)
    saveToLs()

  }


  return (
    <>

      <Navbar />
      <div className="w-1/2 container bg-violet-100 py-4 rounded-md mx-auto p-5">
        <div className='flex justify-between'>
          <input placeholder='ADD A TODO' type="text" id="" className='w-96 px-4' onChange={changeHandle} value={todo} />
          <button className='add bg-blue-500  w-20 font-semibold rounded-md h-10 hover:font-bold' type="button" onClick={handleAdd}>Save</button>
        </div>
        <div className='yourtodo'>
          <h1 className='font-semibold my-3'>Your Todos</h1>
          <div className='todos'>
            {todos.map(item => {

              return <div key={item.id} className='flex justify-between w-full m-3'>
                <input name={item.id} onChange={Handlecheckbox} type="checkbox" value={todo.isCompleted} />

                <div className={item.isCompleted ? "line-through" : ""} >
                  {item.todo}

                </div>
                <div className='flex gap-3'>
                  <button type="button" className='w-10 h-9 rounded-md bg-blue-500  hover:font-bold' onClick={(e) => handleEdit(e, item.id)}>Edit</button>
                  <button type="button" className='w-14 h-9 rounded-md bg-blue-500  hover:font-bold' onClick={(e) => handleDelete(e, item.id)}>Delete</button>
                </div>



              </div>
            })}
          </div>


        </div>


      </div>
    </>
  )
}

export default App
