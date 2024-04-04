import logo from './logo.svg';
import './App.css';
import Calendar from './components/Calendar'
import Navbar from './components/Navbar'
import Register from './components/Register'
import { BrowserRouter, Route, Routes, useLocation} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div class="container">
        <HideOrShowNavbar>
          <Navbar />
        </HideOrShowNavbar>
        <div class="content-container">
          <Routes>
            <Route path='/calendar' element={<Calendar />} />
            <Route path = "/accounts/register" element={<Register />} />
            // can add more routes here with <Route />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

const HideOrShowNavbar = ({children}) => {

  const location = useLocation();
  let showBar= false;


  if (location.pathname === '/accounts/register'){
    showBar = false;
  } else{
    showBar = true;
  }

  return (
    (showBar && children)
  )
}

export default App;
