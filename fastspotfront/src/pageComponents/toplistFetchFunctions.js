
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

export const fetchTopArtists = async (maxArtists) => {
  return fetchWithCredentials(`/api/top-artists/${maxArtists}`);
};

export const fetchTopTracks = async (maxSongs) => {
  return fetchWithCredentials(`/api/top-tracks/${maxSongs}`);
};