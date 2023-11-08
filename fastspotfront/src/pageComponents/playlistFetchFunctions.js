// Fetching user, calling server where api calls are done
export const fetchUser = async () => {
    try {
        const userApiData = await fetch(`api/fetchUser` ,{
            credentials: 'include',
        });
        if (userApiData.ok) {
            const userData = await userApiData.json();
            return userData;
        }
        throw new Error(`Error fetching user! Status: ${userApiData.status}`)
    } catch (error) {
        console.error("Error fetching user:", error);
        return null;
    }
};

// Fetching liked songs, calling server where api calls are done
export const fetchLiked = async () => {
    try{
        const likedTracksApiData = await fetch(`api/fetchLiked/50` ,{
            credentials: 'include',
        });
        if (likedTracksApiData.ok) {
            const data = await likedTracksApiData.json();
            console.log(data);
            return data;
        } else {
            throw new Error(`Error fetching data`);
        }
    }catch (error){
        console.error("Error fetching liked:", error);
        return null;
    }
};

// Fetching playlists, calling server where api calls are done
export const fetchPlaylists = async () => {
    try {
        const playlistApiData = await fetch(`api/fetchPlaylists`, {
            credentials: 'include'
        });
        if (playlistApiData.ok) {
            const playlistData = await playlistApiData.json();
            console.log(playlistData);
            return playlistData;
        }
        throw new Error(`Error fetching playlists! Status: ${playlistApiData.status}`);

    } catch (error) {
        console.error("Error fetching playlists", error);
        return null;
    }
};

// Fetching playlists tracks, calling server where api calls are done
export const fetchPlaylistTracks = async (playlistId, newTracksAdded=false) => {
    try{
        const playlistTrackApiData = await fetch(`api/fetchPlaylistTracks/${playlistId}/${newTracksAdded}`,{
            credentials: 'include'
        });
        if(playlistTrackApiData.ok){
            const playlistTrackData = await playlistTrackApiData.json();
            console.log(playlistTrackApiData);
            return playlistTrackData;       
        }
        throw new Error(`Error fetching playlist tracks! Status: ${playlistTrackApiData.status}`);
    }catch(error){
        console.error("Error fetching playlist tracks", error);
        return null;
    }   
}

