export { fetchImages, incrementPage, setQuery, resetPage, getQuery };

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '25274192-4013926bd09e77e2599d4477f';
const QUERY_PARAMETERS = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = 'per_page=40';
let searchQuery = '';
let page = 1;

function fetchImages(searchQuery) {
  return fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&${QUERY_PARAMETERS}&page=${page}&${PER_PAGE}`,
  ).then(res => {
    if (!res.ok) {
      throw new Error(res.status);
    }
    return res.json();
  });
}

function getQuery() {
  return searchQuery;
}

function setQuery(newQuery) {
  searchQuery = newQuery;
}

function incrementPage() {
  page += 1;
}

function resetPage() {
  page = 1;
}
