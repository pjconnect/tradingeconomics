import './App.css'
import { Route, Routes } from 'react-router'
import About from './pages/About'
import Home from './pages/Home'
import Layout from './Layout'
import Search from './pages/Search'

function App() {

  return (
    <Routes>
      <Route index element={<Layout><Home /></Layout>} />
      <Route path="search" element={<Layout><Search /></Layout>} />
      <Route path="about" element={<Layout><About /></Layout>} />
    </Routes>
  )
}

export default App
