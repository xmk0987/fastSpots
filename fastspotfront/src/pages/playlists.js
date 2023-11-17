import React, { useState, useEffect, useRef, useCallback} from "react";
import { FcLike } from 'react-icons/fc';
import {BsFillLightningFill} from 'react-icons/bs'

import { fetchUser, fetchLiked, fetchPlaylistTracks, fetchPlaylists } from '../pageComponents/playlistFetchFunctions';


const Playlist = (props) => {
    // Useful states
    const [user, setUser] = useState('');
    const [playlists, setPlaylists] = useState(null);
    const [likedTracks, setLikedTracks] = useState(null);
    const [currentPlaylistTracks, setCurrentPlaylistTracks] = useState(null);
    const [editorPlaylistTracks, setEditorPlaylistTracks] = useState(null);

    // Helper states
    const [checkedBoxes, setCheckedBoxes] = useState([]);
    const [filteredCurrent, setFilteredCurrent] = useState(null);
    const [filteredEditor, setFilteredEditor] = useState(null);
    const [currentTitle, setCurrentTitle] = useState(null);
    const [editorTitle, setEditorTitle] = useState("Playlist Editor");
    const [editorPlaylistId, setEditorPlaylistId] = useState(null);
    const [selected, setSelected] = useState('false');
    const [playlistsUpdated, setPlaylistsUpdated] = useState(false);
    const [likedLoading, setLikedLoading] = useState(true);
    const [progressBarWidth, setProgressBarWidth] = useState(0);

    // Show popups
    const [showPlaylistCreation, setShowPlaylistCreation] = useState(false);
    const [showPlaylistOptions, setShowPlaylistOptions] = useState(false);
    const [showEditorPlaylist, setShowEditorPlaylist] = useState(false);

    const currentListRef = useRef(null);
    const baseURL = props.baseURL;



    // Fetch user and liked songs on first load
    useEffect(() => {
        const setPlaylistDefaults = async () => {
            try{
                scrollToTop();
                const userData = await fetchUser(baseURL);
                setLikedLoading(true);
                const likedData = await fetchLiked(baseURL);
                if(likedData && userData){
                    setUser(userData);
                    setLikedTracks(likedData);
                    setCurrentPlaylistTracks(likedData);
                    setFilteredCurrent(likedData);
                    setCurrentTitle("Liked Songs");
                    setLikedLoading(false);
                }else{
                    console.error("Error fetching user and liked data");
                    setLikedLoading(false);
                }


            } catch(err) {
                console.error("Error fetching user and liked")
            }
        }
        setPlaylistDefaults();

    }, [baseURL]);


    const move = useCallback(() => {
        if (progressBarWidth === 0) {
          let frameWidth = 1;
          let id = setInterval(() => {
            if (frameWidth >= 100) {
              clearInterval(id);
              setProgressBarWidth(0);
              move();
            } else {
              frameWidth++;
              setProgressBarWidth(frameWidth);
            }
          }, 10);
        }
      }, [progressBarWidth]);



    useEffect(() => {
        move();
    }, [move]);

    // Fetch playlists when user is fetched
    useEffect(() => {
        const getSetPlaylists = async () => {
            try{
                const playlistData = await fetchPlaylists(baseURL);
                if(playlistData){
                    setPlaylists(playlistData);
                }
            } catch(err){
                console.error(err);
            }
        }
        getSetPlaylists();


    }, [user,baseURL]);

        // Check box logic
    const handleCheckboxChange = useCallback((value) => {
        if (checkedBoxes.includes(value)) {
        // If the checkbox is already in the list, uncheck it (remove from state)
        setCheckedBoxes(checkedBoxes.filter((item) => item !== value));
        } else {
        // If the checkbox is not in the list, check it (add to state)
        setCheckedBoxes([...checkedBoxes, value]);
        }
    }, [checkedBoxes]);


    // Creating current list element, populating with tracks
    const createCurrentListElement = useCallback((trackName, artist, trackId) => {
        if(trackName && artist){
            return(
                <li key={trackId} id={trackId} className="currentListItem">
                    <label><input 
                                type="checkbox"
                                className="checkbox"
                                value={trackId}
                                checked={checkedBoxes.includes(trackId)}
                                onChange={(e) => handleCheckboxChange(e.target.value)}
                            />
                    {trackName} - {artist}</label>
                </li>
            );
        }else {
            return null;
        }
    }, 
    [checkedBoxes, handleCheckboxChange]);  

    // Populating editorplaylist
    useEffect(() => {
        if (editorPlaylistId && playlistsUpdated) {
            const fetchNewPlaylist = async () => {
                const newTracks = await fetchPlaylistTracks(editorPlaylistId);
                setEditorPlaylistTracks(newTracks);
                setFilteredEditor(newTracks);
                if(currentTitle === editorTitle){
                    setCurrentPlaylistTracks(newTracks);
                    setFilteredCurrent(newTracks);
                }
            };
    
            fetchNewPlaylist();
            setPlaylistsUpdated(false); 
        }
    }, [playlistsUpdated, currentTitle, editorPlaylistId, editorTitle, baseURL]);


//HANDLE CLICKS
// Handle when radio button changed in form
const handleRadioChange = (event) => {
    setSelected(event.target.value);
}

// Handle when a new playlist is chosen to show it as current list
const handlePlaylistButtonClick = async (playlistId) => {
    scrollToTop();
    if(playlistId === "likedSongs"){
        setFilteredCurrent(likedTracks);
        setCurrentPlaylistTracks(likedTracks);
        setCurrentTitle("Liked Songs");
    }
    
    else{
        const playlistName = playlists.items
            .filter((item) => item.id === playlistId)
            .map((filteredItem) => filteredItem.name);
        setCurrentTitle(playlistName[0]);
        const newTracks =  await fetchPlaylistTracks(playlistId, baseURL);
        setCurrentPlaylistTracks(newTracks);
        setFilteredCurrent(newTracks);
    }
}

// Handles popup close
const handleCloseButton = () => {
    setShowPlaylistCreation(false);
    setShowPlaylistOptions(false);
    setShowEditorPlaylist(false);
}  

// BUTTONS LOGIC 
// Creates a new playlist, calls server to post it
const handleCreateNewPlaylist = async (event) => {
    event.preventDefault();
    try {
        const formData = new FormData(event.target);
        const formDataObject = {};

        formData.forEach((value, key) => {
            formDataObject[key] = value;
        });

        const playlistName = formDataObject["newName"];
        const playlistDescription = formDataObject["newDesc"];
        const publicState = formDataObject["publicState"];

        const url = `api/createPlaylist/${user.id}/${playlistName}/${playlistDescription}/${publicState}`;
        
        const response = await fetch(url, {
            credentials: 'include',
        });
        if (response.ok) {
            handleCloseButton();
            const newPlaylists = await fetchPlaylists(baseURL);
            setPlaylists(newPlaylists);

        } else {
            console.error('Failed to create playlist: ', response.status);
        }
    } catch (error) {
        console.error('Error creating playlist: ', error);
        return null;
    }
};

// Error check for adding and deleting. Checks if any songs are selected and is the user owner of playlist.
const checkIfSelectedAndOwner = (id) => {
    const playlistCreator = playlists.items
        .filter(item => item.id === id) 
        .map(item => {
        return item.owner.id;
    });
    if(checkedBoxes.length < 1){
        alert("No songs chosen");
    } else if(playlistCreator[0] !== user.id){
        alert("Can only change own playlists");
    } else{
        return true;
    }
};

// Add selected tracks to a playlist allows to add to multiple list by not deselecting songs
const addChosen = async (id) => {
    handleCloseButton();
    if(!checkIfSelectedAndOwner(id)){
        return;
    }
    else{
        const uriList = checkedBoxes.map((element) => `spotify:track:${element}`);
        const body = JSON.stringify({
            uris: uriList,
            position: 0,
        });
        const url = `api/addTracks/${id}`;
    
        try {
            const response = await fetch(url, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: body,
                credentials: 'include',
            });
    
            if (response.ok) {
                setPlaylistsUpdated(true);
            } else {
                console.error('Failed to add tracks: ', response.status);
            }
        } catch (error) {
            console.error('Error sending the request:', error);
            return null;
        }
    }
}


// Resets currently checked songs
const resetChecked = () => {
    checkedBoxes.forEach((item) => {
        handleCheckboxChange(item);
    })
    setCheckedBoxes([]);
}

// Delete selected tracks from a playlist
const deleteChecked = async () => {
    if(!checkIfSelectedAndOwner(editorPlaylistId)){
        return;
    }
    else if (!editorPlaylistId){
        alert("No playlist chosen");
    }
    else{
        const tracksToDelete = editorPlaylistTracks.filter((item) => {
            return checkedBoxes.includes(item.track.id);
        });
        if (tracksToDelete.length > 100){
            alert("Maximum 100 at a time");
        } 
        const uriList = tracksToDelete.map((element) => ({
            uri: `spotify:track:${element.track.id}`
        }));

        const body = JSON.stringify({
            tracks: uriList,
        });

        const url = `api/deleteTracks/${editorPlaylistId}`;
        try{
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                },
                body: body,
                credentials: 'include',
            });

            if(response.ok){
                setPlaylistsUpdated(true);
            } else{
                console.error("Failed to delete: ", response.status);
            }
        } catch(error){
            console.error('Error deleting tracks: ', error);
            return null;
        }
    } 
}

// Choose playlist to editor
const choosePlaylist = async (id) => {
    handleCloseButton();
    const chosenPlaylist = await fetchPlaylistTracks(id, baseURL);
    setEditorPlaylistTracks(chosenPlaylist);
    setFilteredEditor(chosenPlaylist);
    const playlistName = playlists.items
        .filter((item) => item.id === id)
        .map((filteredItem) => filteredItem.name);
    setEditorTitle(playlistName[0]);
    setEditorPlaylistId(id);
}

// Unfollow the current playlist in editor and update the editor and playlist lists
const unfollowPlaylist = async () => {
    if(!editorPlaylistId){
        alert("Can't unfollow nothing");
    } else{
        try{
            const url = `api/unfollowPlaylist/${editorPlaylistId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json', 
                },
                credentials: 'include',
            });
            if(response.ok){
                setEditorPlaylistTracks(null);
                setEditorPlaylistId(null);
                setEditorTitle("Playlist Editor");
                scrollToTop();
                const newPlaylists = await fetchPlaylists(baseURL);
                setPlaylists(newPlaylists);
            }
        } catch(error){
            console.error("Failed to unfollow");
            return null;
        }
    }

}


// FUNCTIONS
// Helper function to scroll back top
const scrollToTop = () => {
    if (currentListRef.current) {
      currentListRef.current.scrollTop = 0;
    }
}

// Filtering current list by query
const searchFilter = (event) => {
    const query = event.target.value.toLowerCase();
    const updatedList = currentPlaylistTracks.filter((item) => {
        return item.track.name.toLowerCase().includes(query) || item.track.artists[0].name.toLowerCase().includes(query);
    });
    setFilteredCurrent(updatedList);
}

// Filtering editor search
const searchEditorFilter = (event) => {
    const query = event.target.value.toLowerCase();
    const updatedList = editorPlaylistTracks.filter((item) => {
        return item.track.name.toLowerCase().includes(query) || item.track.artists[0].name.toLowerCase().includes(query);
    });
    setFilteredEditor(updatedList);
}

// CREATING ELEMENTS
// Creating playlist list element according to right type
const createListElement = (srcOrIcon, name, id, isIonIcon = false, type = "default") => {
    let functionToExecute = null;
    if (type === "add") {
        functionToExecute = addChosen; 
    } else if (type === "choose") {
        functionToExecute = choosePlaylist; 
    } else {
        functionToExecute = handlePlaylistButtonClick;
    }

    const handleFunctionCall= () => functionToExecute(id);

    return (
        <li key={id} >
            <button className="playlistButton" id={id} onClick={handleFunctionCall}>
                {isIonIcon ? (
                    <i className="ion-icon">{srcOrIcon}</i>
                ) : (
                    <img src={srcOrIcon} alt={`${name} playlist`} className="playlistImage" />
                )}
                <div>{name}</div>
            </button>
        </li>
    );
};
  
// Html for creating new list, showed when create new playlist pressed
const createNewPlaylist = (
    <div className="newPlaylistInfo">
        <div className="newPlaylistHeader">
            <h2 className="newPlaylistItem newPlaylistHeaderText">New Playlist</h2>
            <button className="closeButton" onClick={handleCloseButton}>X</button>

        </div>
        <form onSubmit={handleCreateNewPlaylist}>
            <div className="newPlaylistItem">
                <label htmlFor="newName">Name:</label><br/>
                <input type="text" id="newName" name="newName" className="nameInput" required/>
            </div>
            <div className="newPlaylistItem">
                <label htmlFor="newDesc">Description:</label><br/>
                <textarea type="textarea" id="newDesc" name="newDesc" className="newTextarea" rows="5" cols="50"></textarea>
            </div>
            <div className="newPlaylistItem radioItems">           
                <input type="radio" 
                       id="publicTrue" 
                       name="publicState" 
                       className="radioItem" 
                       value="true"
                       checked={selected === 'true'}
                       onChange={handleRadioChange}
                 />
                <label htmlFor="publicTrue" className="radioItem">Public</label>
                <input type="radio" 
                       id="publicFalse" 
                       name="publicState" 
                       className="radioItem" 
                       value="false"
                       checked={selected === 'false'}
                       onChange={handleRadioChange}
                 />
                <label htmlFor="publicFalse" className="radioItem">Private</label>
            </div>
            <div className="submitButton">
                <input type="submit" className="newPlaylistSubmit editorOptionButton" value="Create"/>
            </div>
        </form>
    </div>
);

// Add chosen html, popups with add chosen button
const addChosenOptions = (
    <div className="addChosenPopupContainer">
        <h2>Add to playlist</h2>
        <button className="closeButton" onClick={handleCloseButton}>X</button>
        <ul className="addChosenList">
            {playlists && playlists.items.map((playlist) => {
                const imageUrl = playlist.images && playlist.images[0] ? playlist.images[0].url : null;
                return createListElement(imageUrl || <BsFillLightningFill/>, playlist.name, playlist.id, !imageUrl, "add"); 
            })}
        </ul>
    </div>
); 

// Open another playlist to view html, popups with add chosen button
const editorPlaylists = (
    <div className="addChosenPopupContainer" id="choosePlaylistPopup">
        <h2>Choose playlist to view</h2>
        <button className="closeButton" onClick={handleCloseButton}>X</button>
        <ul className="addChosenList">
            {playlists && playlists.items.map((playlist) => {
                const imageUrl = playlist.images && playlist.images[0] ? playlist.images[0].url : null;
                return createListElement(imageUrl || <BsFillLightningFill/>, playlist.name, playlist.id, !imageUrl, "choose"); 
            })}
        </ul>
    </div>
); 

// Creating currentList
const currentList = (
    <ul>
        {currentPlaylistTracks && filteredCurrent.map((item) => 
            createCurrentListElement(item.track.name, item.track.artists[0].name, item.track.id)
        )}  
    </ul>
)

// Progress bar html 
const progressBar = (
    <div className="progressBarContainer"> 
        <div id="myProgress">
            <p>Fetching liked songs...</p>
            <div
                id="myBar"
                className="progress-bar"
                style={{ width: `${progressBarWidth}%` }}
            ></div>
        </div>
    </div>
);

// Editor guide html, shows when editor doesn't have a playlist
const editorGuide = (
    <div className="editorGuideContainer">
        <div>
            <h3 className="guideMainHeader">Quick Guide</h3>
            <p>This website is made to help you add multiple songs to a playlist faster.</p>

        </div>
        <div className="left-column">
            <h4 className="guideSubHeader">Left Column</h4>
            <p>From the left column you can choose the playlist you want to see in the middle</p>
        </div>
        <div className="middle-column">
            <h4 className="guideSubHeader">Middle Column</h4>
            <p>Here you see the selected playlist. You can use this list to search and check the boxes of the songs you would like to add to a playlist.</p>
            <h5>Buttons:</h5>
            <p><span className="bold">CREATE NEW</span> - create a new playlist</p>
            <p><span className="bold">ADD CHOSEN</span> - add the checked boxes to a playlist that you can choose after pressing the button</p>
            <p><span className="bold">RESET CHOSEN</span> - reset all the checked boxes. They don't get reset after making a playlist in case you want to add same songs to another playlist also so REMEMBER TO UNCHECK IF YOU DON'T NEED THEM</p>
        </div>
        <div className="right-column">
            <h4 className="guideSubHeader">Right Column</h4>
            <p>This column is made so you can look at the playlist you are editing.</p>
            <h5>Buttons:</h5>
            <p><span className="bold">OPEN PLAYLIST / CHANGE PLAYLIST</span> - open/change the playlist in editor</p>
            <p><span className="bold">DELETE CHOSEN</span> - delete all the selected songs from the current playlist in editor.</p>
            <p><span className="bold">UNFOLLOW</span> - unfollow the current playlist in the editor</p>
        </div>
       
    </div>
)


// MAIN HTML CONTAINER FOR PLAYLIST
return(
    <div className="playlist-container">
        <div className="playlist-grid">
            <div className="playlist-list left">
                <div className="playlistHeaderContainer">
                    <div className="headerContainer">
                        <h2 className="mainHeader">Playlists</h2> 
                    </div>
                </div>
                <div className="playlist-list-container">
                    <ul id="playlist-list" className="playlists">
                        {/* CREATING PLAYLIST ELEMENTS */}
                        {/* ADDING LIKED SONGS AS FIRST ELEMENT IN LIST */}
                        {likedTracks && createListElement(<FcLike/>, "Liked Songs", "likedSongs", true)}
                        {playlists && playlists.items.map((playlist) => {
                            const imageUrl = playlist.images && playlist.images[0] ? playlist.images[0].url : null;
                            return createListElement(imageUrl || <BsFillLightningFill/>, playlist.name, playlist.id, !imageUrl );
                        })}
                    </ul>
                </div>
            </div>
            <div className="current-list-container mid" ref={currentListRef}>
                <div className="currentPlaylistHeaderContainer">
                    <div className="headerContainer" id="currentHeader">
                        <h2 >{currentTitle}</h2>
                    </div>
                    <div className="searchBar currentSearchBar">
                        <input type="text" id="filterValue" onChange={searchFilter} placeholder="Search" className="search currentSearch"/>
                    </div>
                </div>
                <div className="current-list">
                    {likedLoading ? progressBar : currentList}
                </div>
                <div className="playlistOptions">
                    <button className="optionButton currentOptionButton" onClick={() => {handleCloseButton(); setShowPlaylistCreation(true);}}>CREATE NEW PLAYLIST</button>
                    <button className="optionButton currentOptionButton" onClick={() => {handleCloseButton(); setShowPlaylistOptions(true);}}>ADD CHOSEN TO PLAYLIST</button>
                    <button className="optionButton currentOptionButton" onClick={resetChecked}>RESET CHOSEN</button>                   
                    {showPlaylistCreation && createNewPlaylist}
                    {showPlaylistOptions && addChosenOptions}
                 </div>
            </div>

            <div className="editorContainer right">
                <div className="editorHeaderContainer">
                    <div className="headerContainer">
                        <h2 className="viewPlaylistHeader">{editorTitle}</h2>
                    </div>
                    <div className="searchBar editorSearchBar">
                        <input type="text" id="filterValue" onChange={searchEditorFilter} placeholder="Search" className="search editorSearch"/>
                    </div>
                </div>
            
                <div className="editorListContainer">
                    {!editorPlaylistTracks ? editorGuide :  
                    <ul className="editorList">
                        {editorPlaylistTracks && filteredEditor.map((item) => 
                            createCurrentListElement(item.track.name, item.track.artists[0].name, item.track.id)
                        )}
                    </ul>}
                   
                </div>

                <div className="editorButtonsContainer ">
                    <button className="openEditorButton optionButton editorOptionButton" onClick={() => {handleCloseButton(); setShowEditorPlaylist(true);}}>{!editorPlaylistTracks ? 'OPEN PLAYLIST' : 'CHANGE PLAYLIST'}</button>
                    <button className="optionButton deleteTracksButton editorOptionButton" onClick={deleteChecked}>DELETE CHOSEN</button>
                    <button className="optionButton editorOptionButton" onClick={unfollowPlaylist}>UNFOLLOW PLAYLIST</button>
                    <button className="optionButton editorOptionButton" onClick={resetChecked}>RESET CHOSEN</button>
                    {showEditorPlaylist && editorPlaylists}
                </div>
            </div>
        </div>

    </div>
)
}

export default Playlist;

