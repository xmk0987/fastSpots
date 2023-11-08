import React, { useState, useEffect } from "react";

import { fetchTopArtists, fetchTopTracks } from '../pageComponents/toplistFetchFunctions';

const TopLists = (props) => {
  const [topArtists, setTopArtists] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [maxSongs, setMaxSongs] = useState(5);
  const [maxArtists, setMaxArtists] = useState(5);
  const [isSongAccordionOpen, setIsSongAccordionOpen] = useState(false);
  const [isArtistAccordionOpen, setIsArtistAccordionOpen] = useState(false);


  const baseURL = props.baseURL;

  // FETCHING TOP ARTISTS AND TRACKS AND POPULATING STATE
  useEffect(() => {
    console.log("Päästään tänne top listoihin");
    
    const setTopLists = async () => {
        try{
            const tracks = await fetchTopTracks(baseURL, maxSongs);
            const artists = await fetchTopArtists(baseURL, maxArtists);
            if(tracks.items.length > 0 && artists.items.length >0){
                setTopTracks(tracks);
                setTopArtists(artists);

            }else{
                console.error("Error in fetching artists and lists");
            }
        } catch(error){
            console.error("Error fetching user top tracks and artists");
            return null;
        }
    };

    setTopLists();

  }, [maxSongs, maxArtists, baseURL]);


  // HANDLE SONG CHANGE
  const handleMaxSongChange = async (event) => {
    const newMaxSongs = event.target.value;
    setMaxSongs(newMaxSongs);
    setIsSongAccordionOpen(!isSongAccordionOpen);
  };

  // HANDLE ARTIST CHANGE
  const handleMaxArtistsChange = async (event) => {
    const newMaxArtists = event.target.value;
    setMaxArtists(newMaxArtists);
    setIsArtistAccordionOpen(!isArtistAccordionOpen);
  };


  return (
    <div className="top-list-container">
      <div className="top-songs-container top-container">
        <div className="top-container-header">
          <h2>TOP SONGS</h2>
          {/* CREATING ACCORDION BUTTON*/}
          <div className="accordion-container">
            <button className="accordion-btn" onClick={() => setIsSongAccordionOpen(!isSongAccordionOpen)}>
              {isSongAccordionOpen ? "LESS" : "MORE"}
            </button>
            {isSongAccordionOpen && (
              <div className="panel open">
                <p>TOP:</p>
                <select
                  id="song-amount"
                  className="select-amount"
                  value={maxSongs}
                  onChange={handleMaxSongChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            )}
          </div>
        </div>
        {/* POPULATING WITH TOP SONGS */}
        <ol className="top-list" id="song-top-list">
          {topTracks.items && topTracks.items.slice(0, maxSongs).map((song, index) => (
            <li key={index}>{song.name}</li>
          ))}
        </ol>

      </div>
      <div className="top-artists-container top-container">
        <div className="top-container-header">
          <h2>TOP ARTISTS</h2>
          {/* CREATING ACCORDION BUTTON*/}
          <div className="accordion-container" id="artist-btn">
            <button className="accordion-btn" onClick={() => setIsArtistAccordionOpen(!isArtistAccordionOpen)}>
              {isArtistAccordionOpen ? "LESS" : "MORE"}
            </button>
            {isArtistAccordionOpen && (
              <div className="panel open">
                <p>TOP:</p>
                <select
                  id="artist-amount"
                  className="select-amount"
                  value={maxArtists}
                  onChange={handleMaxArtistsChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>
            )}
          </div>
        </div>
        {/* POPULATING WITH TOP ARTISTS */}
        <ol className="top-list" id="artists-top-list">
          {topArtists.items && topArtists.items.slice(0, maxArtists).map((artist, index) => (
            <li key={index}>{artist.name}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default TopLists;