/* eslint-disable no-unused-vars */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
<<<<<<< HEAD
import NavBar from './components/NavBar'
=======
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserProtectedWrapper from './protectedroutes/UserProtectedWrapper'
>>>>>>> 7a3ac8b676efa00123be78513d77e6c57b1bd534


const App = () => {
  return (
    <>
<<<<<<< HEAD
      <NavBar />
      <Routes>
        <Route path='/register' element={<Register />} />
=======
      <Navbar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={
          <UserProtectedWrapper>
            <Dashboard />
          </UserProtectedWrapper>
        } />
>>>>>>> 7a3ac8b676efa00123be78513d77e6c57b1bd534
      </Routes>

    </>
  )
}

export default App