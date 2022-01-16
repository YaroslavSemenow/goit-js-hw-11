export { fetchImages };

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '25274192-4013926bd09e77e2599d4477f';
const QUERY_PARAMETERS = 'image_type=photo&orientation=horizontal&safesearch=true';

function fetchImages(searchQuery) {
  return fetch(`${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&${QUERY_PARAMETERS}`).then(res => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
}
