import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button } from './components/ui/button'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'
import Menu from './pages/Menu'
import Orders from './pages/Orders';
import Overview from './pages/Overview'
import Suggestions from './pages/Suggestions'
import Stock from './pages/Stock'

function App() {

  const routes = [
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/dashboard",
      element: <Dashboard />
    },
    {
      path: "/menu",
      element: <Menu />
    },
    {
      path: "/orders",
      element: <Orders />
    },
    {
      path: "/",
      element: <Overview />
    },
    {
      path: "/suggestions",
      element: <Suggestions />
    },
    {
      path: "/stock",
      element: <Stock />
    }
  ]

  return (
    <>
      <div className='font-fira'>
        <div className='sticky top-0 z-50'>
          <Navbar/>
        </div>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </div>
    </>
  )
}

export default App
