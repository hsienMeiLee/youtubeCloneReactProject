import React, { useState } from 'react'
import Navbar from './Components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home/Home';
import Video from './Pages/Video/Video';

const App = () => {

  const [sidebar, setSidebar] = useState(true);
  const [videos, setVideos] = useState([]);
  const [searchItem, setSearchItem] = useState('');
  const handleSearchResults = (fetchedVideos, term) => {
    setVideos(fetchedVideos);
    setSearchItem(term);
  }

  return (
    <div>
      <Navbar handleSearchResults = {handleSearchResults} setSidebar={setSidebar} />
      <Routes>
        <Route path='/' element={<Home videos={videos} searchItem={searchItem} sidebar={sidebar}/>} />
        <Route path='/video/:categoryId/:videoId' element={<Video/>} />
      </Routes>
    </div>
  )
}

export default App