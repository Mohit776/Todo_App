import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';

function Navbar({ activeView, setActiveView, pendingCount }) {
  return (
    <nav className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Todo Master
        </h1>
        
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          <div className="bg-violet-700 px-3 py-1 rounded-full text-sm">
            {pendingCount} pending
          </div>
          <div className="flex space-x-2 bg-violet-800 p-1 rounded-lg">
            <button 
              className={`px-3 py-1 rounded-md transition-colors ${activeView === 'list' ? 'bg-white text-violet-700' : 'text-white'}`}
              onClick={() => setActiveView('list')}
            >
              List
            </button>
            <button 
              className={`px-3 py-1 rounded-md transition-colors ${activeView === 'calendar' ? 'bg-white text-violet-700' : 'text-white'}`}
              onClick={() => setActiveView('calendar')}
            >
              Calendar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function CalendarView({ todos, onDateSelect }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getTodosForDate = (date) => {
    const dateString = date.toISOString().split('T')[0];
    return todos.filter(todo => todo.date === dateString);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(newDate);
    if (onDateSelect) {
      onDateSelect(newDate);
    }
  };

  const changeMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDayOfMonth = getFirstDayOfMonth(currentDate);
    const days = [];

    // Previous month days
    const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const daysInPrevMonth = getDaysInMonth(prevMonth);
    for (let i = 0; i < firstDayOfMonth; i++) {
      const day = daysInPrevMonth - firstDayOfMonth + i + 1;
      days.push(
        <div key={`prev-${i}`} className="p-2 text-center text-gray-400">
          {day}
        </div>
      );
    }

    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateString = date.toISOString().split('T')[0];
      const dayTodos = getTodosForDate(date);
      const isToday = today.toDateString() === date.toDateString();
      const isSelected = selectedDate && selectedDate.toDateString() === date.toDateString();
      const hasPendingTodos = dayTodos.some(todo => !todo.isCompleted);
      const hasCompletedTodos = dayTodos.some(todo => todo.isCompleted);
      
      days.push(
        <div 
          key={`current-${day}`} 
          className={`p-2 text-center cursor-pointer rounded-lg border-2 transition-all flex flex-col items-center justify-center min-h-16 ${
            isToday ? 'bg-violet-100 border-violet-400' : 'border-transparent'
          } ${isSelected ? 'bg-violet-200 border-violet-600 shadow-md' : ''}`}
          onClick={() => handleDateClick(day)}
        >
          <div className={`font-medium ${isToday ? 'text-violet-700 font-bold' : ''} ${isSelected ? 'text-violet-800' : ''}`}>
            {day}
          </div>
          {dayTodos.length > 0 && (
            <div className="flex justify-center mt-1 space-x-1">
              {hasPendingTodos && <div className="w-2 h-2 rounded-full bg-red-500"></div>}
              {hasCompletedTodos && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
            </div>
          )}
        </div>
      );
    }

    // Next month days
    const totalCells = 42; // 6 weeks * 7 days
    const remainingCells = totalCells - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push(
        <div key={`next-${i}`} className="p-2 text-center text-gray-400">
          {i}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-violet-800 mb-4 md:mb-0">Calendar View</h2>
        <div className="flex space-x-2">
          <button 
            onClick={goToToday}
            className="bg-violet-600 text-white px-4 py-2 rounded-lg hover:bg-violet-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Today
          </button>
          <div className="flex bg-violet-100 rounded-lg p-1">
            <button 
              onClick={() => changeMonth(-1)}
              className="text-violet-600 hover:text-violet-800 font-bold p-2 rounded-md hover:bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 className="text-lg font-semibold text-violet-700 px-2 py-2">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button 
              onClick={() => changeMonth(1)}
              className="text-violet-600 hover:text-violet-800 font-bold p-2 rounded-md hover:bg-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="p-2 text-center font-semibold text-violet-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderCalendar()}
      </div>

      <div className="mt-6 p-4 bg-violet-50 rounded-lg">
        <h3 className="font-semibold text-violet-800 mb-2">
          Todos for {selectedDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </h3>
        {getTodosForDate(selectedDate).length === 0 ? (
          <p className="text-gray-600 py-4 text-center">No todos for this date</p>
        ) : (
          <ul className="space-y-2">
            {getTodosForDate(selectedDate).map(todo => (
              <li key={todo.id} className={`p-3 rounded-md flex items-center ${todo.isCompleted ? 'bg-green-100' : 'bg-white border border-violet-100'}`}>
                <div className={`flex-shrink-0 w-4 h-4 rounded-full mr-3 ${todo.isCompleted ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={todo.isCompleted ? 'line-through text-gray-600' : 'text-gray-800'}>
                  {todo.todo}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TodoListView({ todos, onEdit, onDelete, onCheckbox, sortBy, setSortBy, filter, setFilter }) {
  const calculateTimeLeft = (dateString) => {
    const now = new Date();
    const targetDate = new Date(dateString);
    const timeDiff = targetDate - now;
    
    if (timeDiff <= 0) {
      return { overdue: true, text: "Overdue!" };
    }
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return { overdue: false, text: `${days} day${days !== 1 ? 's' : ''} ${hours} hr${hours !== 1 ? 's' : ''}` };
    } else {
      return { overdue: false, text: `${hours} hour${hours !== 1 ? 's' : ''}` };
    }
  };

  const sortedTodos = [...todos].sort((a, b) => {
    if (sortBy === "date") {
      return new Date(a.date) - new Date(b.date);
    } else {
      const timeLeftA = new Date(a.date) - new Date();
      const timeLeftB = new Date(b.date) - new Date();
      return timeLeftA - timeLeftB;
    }
  });

  const filteredTodos = sortedTodos.filter(todo => {
    if (filter === "active") return !todo.isCompleted;
    if (filter === "completed") return todo.isCompleted;
    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-violet-800 mb-4 md:mb-0">Task List</h2>
        
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center bg-violet-100 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
            <select 
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-violet-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="date">Sort by Date</option>
              <option value="timeLeft">Sort by Time Left</option>
            </select>
          </div>
          
          <div className="flex items-center bg-violet-100 rounded-lg p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-violet-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <select 
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-violet-700"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Tasks</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-violet-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <div className="text-violet-500 text-lg font-medium mb-2">No tasks found</div>
          <p className="text-gray-600 max-w-md mx-auto">Try adding a new task or changing the filter settings</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {filteredTodos.map(item => {
            const timeLeft = calculateTimeLeft(item.date);
            return (
              <div key={item.id} className={`flex items-start justify-between p-4 rounded-xl border ${item.isCompleted ? 'bg-green-50 border-green-200' : 'bg-white border-violet-100'} ${timeLeft.overdue && !item.isCompleted ? 'bg-rose-50 border-rose-200' : ''} shadow-sm hover:shadow-md transition-shadow`}>
                <div className="flex items-start gap-3 flex-grow">
                  <label className="inline-flex items-center mt-1">
                    <input 
                      type="checkbox" 
                      checked={item.isCompleted} 
                      onChange={(e) => onCheckbox(e, item.id)}
                      className="h-5 w-5 text-violet-600 rounded focus:ring-violet-500"
                    />
                  </label>
                  <div className="flex-grow">
                    <div className={item.isCompleted ? "line-through text-gray-600" : "text-gray-800 font-medium"}>
                      {item.todo}
                    </div>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <div className="text-sm text-violet-600 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Due: {new Date(item.date).toLocaleDateString()}
                      </div>
                      <div className={`text-sm font-medium flex items-center ${timeLeft.overdue && !item.isCompleted ? 'text-rose-600' : 'text-violet-600'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {timeLeft.overdue && !item.isCompleted ? 'Overdue! ' : ''}
                        {!item.isCompleted ? timeLeft.text : 'Completed'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex gap-2 ml-4'>
                  <button 
                    type="button" 
                    className='px-3 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors text-sm flex items-center disabled:opacity-50 disabled:cursor-not-allowed' 
                    onClick={(e) => onEdit(e, item.id)}
                    disabled={item.isCompleted}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button 
                    type="button" 
                    className='px-3 py-1 rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors text-sm flex items-center' 
                    onClick={(e) => onDelete(e, item.id)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function App() {
  const [todo, setTodo] = useState("");
  const [todoDate, setTodoDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [filter, setFilter] = useState("all");
  const [activeView, setActiveView] = useState("list");

  useEffect(() => {
    const todostring = localStorage.getItem("todos");
    if (todostring) {
      const savedTodos = JSON.parse(todostring);
      setTodos(savedTodos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleAdd = () => {
    if (!todo.trim()) return;
    
    const newTodo = { 
      id: uuidv4(), 
      todo, 
      date: todoDate || new Date().toISOString().split('T')[0],
      isCompleted: false,
      createdAt: new Date().toISOString()
    };
    
    setTodos([...todos, newTodo]);
    setTodo("");
    setTodoDate("");
  };

  const handleEdit = (e, id) => {
    const todoToEdit = todos.find(item => item.id === id);
    setTodo(todoToEdit.todo);
    setTodoDate(todoToEdit.date);
    
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
  };

  const handleDelete = (e, id) => {
    const newTodos = todos.filter(item => item.id !== id);
    setTodos(newTodos);
  };

  const handleCheckbox = (e, id) => {
    const updatedTodos = todos.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    );
    setTodos(updatedTodos);
  };

  const pendingCount = todos.filter(todo => !todo.isCompleted).length;

  return (
    <>
      <Navbar activeView={activeView} setActiveView={setActiveView} pendingCount={pendingCount} />
      <div className="min-h-screen bg-gradient-to-br from-violet-50 to-indigo-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Add Todo Card */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-violet-800 mb-2 text-center">Task Manager</h1>
            <p className="text-gray-600 text-center mb-6">Organize your tasks with due dates and priorities</p>
            
            <div className="flex flex-col md:flex-row gap-4 mb-2">
              <div className="flex-grow">
                <label htmlFor="todo-input" className="block text-sm font-medium text-violet-700 mb-1">Task Description</label>
                <input 
                  id="todo-input"
                  placeholder='What needs to be done?' 
                  type="text" 
                  className='w-full px-4 py-3 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500'  
                  onChange={(e) => setTodo(e.target.value)} 
                  value={todo} 
                />
              </div>
              <div className="md:w-48">
                <label htmlFor="todo-date" className="block text-sm font-medium text-violet-700 mb-1">Due Date</label>
                <input 
                  id="todo-date"
                  type="date" 
                  className='w-full px-4 py-3 border border-violet-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500' 
                  value={todoDate}
                  onChange={(e) => setTodoDate(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button 
                  className='bg-violet-600 text-white font-semibold rounded-lg px-6 py-3 hover:bg-violet-700 transition-colors disabled:bg-gray-400 w-full md:w-auto flex items-center justify-center' 
                  onClick={handleAdd}
                  disabled={!todo.trim()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Task
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content View */}
          {activeView === "calendar" ? (
            <CalendarView todos={todos} />
          ) : (
            <TodoListView 
              todos={todos} 
              onEdit={handleEdit} 
              onDelete={handleDelete} 
              onCheckbox={handleCheckbox}
              sortBy={sortBy}
              setSortBy={setSortBy}
              filter={filter}
              setFilter={setFilter}
            />
          )}
          
          {/* Summary Card */}
          <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
            <h3 className="font-medium text-violet-800 mb-4 text-lg">Task Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-violet-50 rounded-lg">
                <div className="text-2xl font-bold text-violet-600">
                  {todos.length}
                </div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {pendingCount}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {todos.filter(todo => todo.isCompleted).length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;