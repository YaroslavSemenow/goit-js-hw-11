export { imagesAPIService };

const imagesAPIService = {
  BASE_URL: 'https://pixabay.com/api',
  API_KEY: '25274192-4013926bd09e77e2599d4477f',
  QUERY_PARAMETERS: 'image_type=photo&orientation=horizontal&safesearch=true',
  PER_PAGE: '40',
  searchQuery: '',
  page: 1,

  async fetchImages() {
    const res = await fetch(
      `${this.BASE_URL}/?key=${this.API_KEY}&q=${this.searchQuery}&${this.QUERY_PARAMETERS}&page=${this.page}&per_page=${this.PER_PAGE}`,
    );

    if (!res.ok) {
      throw new Error(res.status);
    }

    return await res.json();
  },

  getQuery() {
    return this.searchQuery;
  },

  setQuery(newQuery) {
    this.searchQuery = newQuery;
  },

  incrementPage() {
    this.page += 1;
  },

  resetPage() {
    this.page = 1;
  },
};
