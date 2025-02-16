import React from 'react'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'


const App = () => {
  return (
    <>
    <Navbar/>
    <Routes>
      <Route path='/register' element={<Register/>}/>
    </Routes>
    
    </>
  )
}

export default App