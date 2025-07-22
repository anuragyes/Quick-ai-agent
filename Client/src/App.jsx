 import React from 'react'
import Home from './pages/Home'
import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import Dashboard from './pages/Dashboard'
import WriteArticles from './pages/WriteArticals'

import Generateimage from './pages/Generateimage'
import RemoveBackground from './pages/RemoveBackground'
import RemoveObject from './pages/RemoveObject'
import ReviewResume from './pages/ReviewResume'
import { Toaster } from 'react-hot-toast'
import Blog from './pages/Blog'
import Community from './pages/Community'




const App = () => {

  
  return (
    <>

      <div>
        <Toaster />
        <Routes>

          <Route path='/' element={<Home />} />
          <Route path='/ai' element={<Layout />} >


            <Route index element={<Dashboard />} />

            <Route path='write-article' element={<WriteArticles />} />

            <Route path='blog' element={<Blog/>} />
            <Route path='generateimage' element={<Generateimage />} />

            <Route path='removebackground' element={<RemoveBackground />} />


            <Route path='removeobject' element={<RemoveObject />} />

            <Route path='reviewresume' element={<ReviewResume />} />
            <Route path='community' element={<Community/>}/>
          </Route>

        </Routes>
      </div>


    </>
  )
}

export default App