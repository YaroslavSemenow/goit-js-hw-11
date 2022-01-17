import { fetchImages, incrementPage, setQuery, resetPage, getQuery } from './fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let gallery = new SimpleLightbox('.gallery a');

form.addEventListener('submit', OnSubmitForm);
loadMoreBtn.addEventListener('click', fetchNextPage);

function OnSubmitForm(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('visually-hidden');

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  setQuery(searchQuery);
  resetPage();

  fetchImages(searchQuery)
    .then(res => {
      Notify.success(`Hooray! We found ${res.totalHits} images.`);
      galleryEl.innerHTML = '';

      const arrImg = res.hits;

      if (arrImg.length === 0) {
        return Notify.failure(
          '"Sorry, there are no images matching your search query. Please try again."',
        );
      }

      renderCard(arrImg);
      runSimpleLightBox();
      loadMoreBtn.classList.remove('visually-hidden');
    })
    .catch(error => console.log(error));
}

function renderCard(arrImg) {
  const markup = arrImg
    .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
      return `
        <a class="photo-card" href='${largeImageURL}'>
          <img src="${webformatURL} width="295" height="195""
               alt="${tags}"
               loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b class="info-title">Likes</b>
              <span>${likes}</span>
            </p>
            <p class="info-item">
              <b class="info-title">Views</b>
              <span>${views}</span>
            </p>
            <p class="info-item">
              <b class="info-title">Comments</b>
              <span>${comments}</span>
            </p>
            <p class="info-item">
              <b class="info-title">Downloads</b>
              <span>${downloads}</span>
            </p>
          </div>
        </a>
        `;
    })
    .join('');

  galleryEl.insertAdjacentHTML('beforeend', markup);
}

function fetchNextPage() {
  incrementPage();

  const searchQuery = getQuery();

  fetchImages(searchQuery)
    .then(res => {
      const arrImg = res.hits;
      if (arrImg.length === 0) {
        return Notify.info("We're sorry, but you've reached the end of search results.");
      }

      renderCard(res.hits);
      refreshSimpleLightBox();
    })
    .catch(error => console.log(error));
}

function runSimpleLightBox() {
  gallery.on('show.simplelightbox', function () {
    gallery.options.captionsData = 'alt';
    gallery.options.captionDelay = 250;
  });
}

function refreshSimpleLightBox() {
  gallery.refresh();
}
