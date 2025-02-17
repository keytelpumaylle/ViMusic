export const getToken = async(): Promise<string | null> =>{

    const url = 'https://accounts.spotify.com/api/token';
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'Reemplaza con tu CLIENT ID de spotify',
      client_secret: 'Reemplaza con tu CLIENT_SECRET de spotify',
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
  
      if (!response.ok) throw new Error('Failed to fetch token');
  
      const data = await response.json();
      const token = data.access_token;
      sessionStorage.setItem("tokenSpotify", token);
      console.log('Token obtenido exitosamente');
      window.location.reload();
      return token;

    } catch (error) {
      console.error('Error fetching Spotify token:', error);
      return null;
    }
};