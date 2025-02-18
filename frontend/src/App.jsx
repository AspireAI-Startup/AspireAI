import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import NavBar from './components/NavBar'


const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/register' element={<Register />} />
      </Routes>

    </>
  )
}

export default App