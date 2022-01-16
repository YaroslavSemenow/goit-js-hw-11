import { fetchImages } from './fetchImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');

form.addEventListener('submit', OnSubmitForm);

function OnSubmitForm(e) {
  e.preventDefault();

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  fetchImages(searchQuery)
    .then(res => {
      galleryEl.innerHTML = '';

      const arrImg = res.hits;

      if (arrImg.length === 0) {
        return Notify.failure(
          '"Sorry, there are no images matching your search query. Please try again."',
        );
      }

      const markup = arrImg
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => {
          return `
        <a class="photo-card" href='${largeImageURL}'>
          <img class="gallery-img"
              src="${webformatURL} width="277" height="194""
              alt="${tags}"
              loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes</b>
              <span>${likes}</span>
            </p>
            <p class="info-item">
              <b>Views</b>
              <span>${views}</span>
            </p>
            <p class="info-item">
              <b>Comments</b>
              <span>${comments}</span>
            </p>
            <p class="info-item">
              <b>Downloads</b>
              <span>${downloads}</span>
            </p>
          </div>
        </a>
        `;
        })
        .join('');

      galleryEl.insertAdjacentHTML('beforeend', markup);

      let gallery = new SimpleLightbox('.gallery a');
      gallery.on('show.simplelightbox', function () {
        gallery.options.captionsData = 'alt';
        gallery.options.captionDelay = 250;
      });
    })
    .catch(error => console.log(error));
}
