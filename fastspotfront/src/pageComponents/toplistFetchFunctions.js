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
export const fetchTopArtists = async (baseUrl, maxArtists) => {
  return fetchWithCredentials(`${baseUrl}/top-artists/${maxArtists}`);
};

// Create a function to fetch top tracks
export const fetchTopTracks = async (baseUrl, maxSongs) => {
  return fetchWithCredentials(`${baseUrl}/top-tracks/${maxSongs}`);
};
