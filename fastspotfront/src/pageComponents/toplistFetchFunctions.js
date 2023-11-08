// Create a reusable function for making API requests with credentials
const fetchWithCredentials = async (url) => {
  try {
    const response = await fetch(url, {
      credentials: 'include'
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`Error fetching data from ${url}`);
    }
  } catch (error) {
    console.error(error.message);
    return null;
  }
};

// Create a function to fetch top artists
export const fetchTopArtists = async ( maxArtists) => {
  return fetchWithCredentials(`api/top-artists/${maxArtists}`);
};

// Create a function to fetch top tracks
export const fetchTopTracks = async ( maxSongs) => {
  return fetchWithCredentials(`api/top-tracks/${maxSongs}`);
};
