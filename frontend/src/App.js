import logo from './logo.svg';
import './App.css';
import {useState, useRef} from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import ImagesDisplay from './components/ImagesDisplay';
import UploadImages from './components/UploadImages';


function App() {

  return(
  <BrowserRouter>
    <Routes>
      <Route path='/upload-images' element={<UploadImages/ >}></Route>
      <Route path='images-display' element={<ImagesDisplay />}></Route>
    </Routes>
  </BrowserRouter>
)

}

export default App;
