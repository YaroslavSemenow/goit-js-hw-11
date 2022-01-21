import { imagesAPIService } from './images_api_service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let gallery = new SimpleLightbox('.gallery a');

form.addEventListener('submit', OnSubmitForm);
loadMoreBtn.addEventListener('click', OnLoadMoreBtnClick);

function OnSubmitForm(e) {
  e.preventDefault();
  loadMoreBtn.classList.add('visually-hidden');

  const searchQuery = e.currentTarget.elements.searchQuery.value;

  fetchImages(searchQuery);
}

function OnLoadMoreBtnClick() {
  const seachQuery = imagesAPIService.getQuery();
  fetchImages(seachQuery);
}

async function fetchImages(searchQuery) {
  try {
    const savedsearchQuery = imagesAPIService.getQuery();

    if (savedsearchQuery !== searchQuery) {
      galleryEl.innerHTML = '';
      imagesAPIService.setQuery(searchQuery);
      imagesAPIService.resetPage();

      const imagesObj = await imagesAPIService.fetchImages();
      const arrImg = imagesObj.hits;
      const totalImg = imagesObj.totalHits;

      if (arrImg.length === 0) {
        return Notify.failure(
          '"Sorry, there are no images matching your search query. Please try again."',
        );
      }

      if (totalImg > imagesAPIService.PER_PAGE) {
        loadMoreBtn.classList.remove('visually-hidden');
      }

      renderCard(arrImg);
      runSimpleLightBox();
      Notify.success(`Hooray! We found ${totalImg} images.`);
      scrollToTopPage();
    } else {
      imagesAPIService.incrementPage();

      const imagesObj = await imagesAPIService.fetchImages();
      const arrImg = imagesObj.hits;

      if (arrImg.length === 0) {
        return Notify.info("We're sorry, but you've reached the end of search results.");
      }

      renderCard(arrImg);
      scrollToNextPage();
    }

    gallery.refresh();
  } catch (error) {
    console.log(error);
  }
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

function runSimpleLightBox() {
  gallery.on('show.simplelightbox', function () {
    gallery.options.captionsData = 'alt';
    gallery.options.captionDelay = 250;
  });
}

function scrollToNextPage() {
  setTimeout(() => {
    const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();

    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  }, 200);
}

function scrollToTopPage() {
  setTimeout(() => {
    galleryEl.scrollIntoView({
      behavior: 'smooth',
    });
  }, 100);
}
