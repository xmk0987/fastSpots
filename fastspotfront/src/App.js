import { Routes, Route } from 'react-router-dom';
import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';

import './stylesheets/App.css';
import './stylesheets/Navbar.css';
import './stylesheets/Login.css';
import './stylesheets/TopList.css';
import './stylesheets/Playlists.css'
import './stylesheets/MediaQueries.css';


import Login from './pages/login';
import TopLists from './pages/topLists';
import Navbar from './pages/navbar';
import Playlist from './pages/playlists';

//const BASE_FETCH_URL = "https://fastspotapi.onrender.com/api";
const BASE_FETCH_URL = "https://fastspots.net/api"
//const BASE_FETCH_URL = "http://localhost:8888/api";

function App() {
   const navigate = useNavigate();

    // CHECKING IF ACCESS TOKEN IS PRESENT AND REDIRECTING ACCORDING
    useEffect(() => {
      const checkAccessToken = async () => {
         try {
           const response = await fetch(`${BASE_FETCH_URL}/check-access-token`, {
             credentials: 'include',
           });
           const data = await response.json();
           const isAccessTokenPresent = data.isAccessTokenPresent;
           if (!isAccessTokenPresent) {
            navigate("/login");
           } 
           else if(window.location.pathname === '/'){
            navigate("/top-lists");
           }
         } catch (error) {
           console.error("Network error:", error);
         }
       };
     
       checkAccessToken(); 
    
    }, [navigate]);


    return (
      <div className='app-container'>
        {window.location.pathname !== '/login' && <Navbar baseURL={BASE_FETCH_URL}/>}
        <Routes>
           <Route path="/login" element={<Login baseURL={BASE_FETCH_URL}/>} />
           <Route path="/top-lists" element={<TopLists baseURL={BASE_FETCH_URL}/>} />
           <Route path='/playlist' element={<Playlist baseURL={BASE_FETCH_URL} />} />
        </Routes> 
      </div>
    );
}

export default App;
    