import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Sign from "./pages/Sign"
import Guide from './pages/Guide'
import { useCookies } from "react-cookie"

function App(){

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const authToken = cookies.AuthToken
  const userEmail = cookies.Email
  



  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/sign" element={<Sign/>}/>
        <Route path="/guia" element={<Guide/>}/>
      </Routes>
    </Router>
    
  )
}

export default App