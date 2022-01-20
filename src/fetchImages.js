export { fetchImages, incrementPage, setQuery, resetPage, getQuery };

const BASE_URL = 'https://pixabay.com/api';
const API_KEY = '25274192-4013926bd09e77e2599d4477f';
const QUERY_PARAMETERS = 'image_type=photo&orientation=horizontal&safesearch=true';
const PER_PAGE = '40';
let searchQuery = '';
let page = 1;

async function fetchImages(searchQuery) {
  const res = await fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${searchQuery}&${QUERY_PARAMETERS}&page=${page}&per_page=${PER_PAGE}`,
  );

  if (!res.ok) {
    throw new Error(res.status);
  }

  return await res.json();
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
