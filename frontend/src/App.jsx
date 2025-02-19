/* eslint-disable no-unused-vars */
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import UserProtectedWrapper from './protectedroutes/UserProtectedWrapper'
import NavBar from './components/NavBar'


const App = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={
          <UserProtectedWrapper>
            <Dashboard />
          </UserProtectedWrapper>
        } />
      </Routes>

    </>
  )
}

export default App