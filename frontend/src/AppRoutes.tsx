import React from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './Pages/HomePage/HomePage'
import SearchPage from './Pages/SearchPage'
import FilmPage from './Pages/FilmPage'

type Props = {}

const AppRoutes = (props: Props) => {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/add' element={<SearchPage/>}/>
      <Route path="/film/:id" element={<FilmPage />} />
    </Routes>
  )
}

export default AppRoutes