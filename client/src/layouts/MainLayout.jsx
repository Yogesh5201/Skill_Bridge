import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MainLayout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <main className="flex-grow pt-16">
        <Outlet /> 
      </main>
    </div>
  )
}