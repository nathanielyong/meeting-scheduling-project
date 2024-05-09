import logo from './logo.svg';
import './App.css';
import Calendar from './components/Calendar'
import Navbar from './components/Navbar'
import Register from './components/Register'
import Logout from './components/Logout'
import Login from './components/Login'
import Profile from './components/Profile'
import EditProfile from './components/EditProfile'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import ProtectedRoute from './utils/ProtectedRoute';


function App() {
  return (
    <BrowserRouter >
      <div className="container">
        <HideOrShowNavbar>
          <Navbar />
        </HideOrShowNavbar>
        <div className="content-container" style={{ marginLeft: "90px" }}>
          <Routes >
            <Route path='/calendar' element={<ProtectedRoute><Calendar /></ProtectedRoute>} />
            <Route path='/accounts/profile/view' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path='/accounts/profile/edit' element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
            <Route path="accounts/register" element={<Register />} />
            <Route path="accounts/login" element={<Login />} />
            <Route path="accounts/logout" element={<Logout />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

const HideOrShowNavbar = ({ children }) => {

  const location = useLocation();
  let showBar = false;


  if (location.pathname.includes('/register') || location.pathname.includes('/login')) {
    showBar = false;
  } else {
    showBar = true;
  }

  return (
    (showBar && children)
  )
}

export default App;
