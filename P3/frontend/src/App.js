import logo from './logo.svg';
import './App.css';
import Calendar from './components/Calendar'
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div class="container">
        <Navbar />

        <div class="content-container">

          <Routes>
            <Route path='/calendar' element={<Calendar />} />
            // can add more routes here with <Route />
          </Routes>

        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
