import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'


const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
    </Routes>
    
    </>
  )
}

export default App