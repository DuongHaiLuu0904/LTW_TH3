
async function fetchModel(url) {
  const baseUrl = 'http://localhost:8081'; 
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  try {
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`fetchModel error: ${error}`);
    throw error;
  }
}

export default fetchModel;
