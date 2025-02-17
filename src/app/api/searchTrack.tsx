const BASEURL = "https://api.spotify.com/v1"

export const getTracks = async (SearchQuery:string, token:string) =>{
    try {
        let response =  await fetch(`${BASEURL}/search?q=${SearchQuery}&type=track&limit=50`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.json();
    } catch (error) {
        console.log(error);
    }
}