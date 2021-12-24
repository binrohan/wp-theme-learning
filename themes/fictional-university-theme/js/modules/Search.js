import $ from 'jquery';

class Search {
  constructor() {
    this.addSearchHTML();

    this.openButton = $('.js-search-trigger');
    this.closeButton = $('.search-overlay__close');
    this.searchOverlay = $('.search-overlay');
    this.search = $('#search-term');
    this.results = $('#search-overlay__results');
    this.inputs = $('input, textarea');

    this.typingTimer;
    this.previousValue;
    this.overlayIsOpen = false;
    this.isLoading = false;

    this.events();
  }

  events() {
    this.openButton.on('click', this.openOverlay.bind(this));

    this.closeButton.on('click', this.closeOverlay.bind(this));

    $(document).on('keydown', this.keyPressDispatcher.bind(this));

    this.search.on('keyup', this.typingLogic.bind(this));
  }

  typingLogic(e) {
    if (this.search.val() === this.previousValue) return;

    clearTimeout(this.typingTimer);

    if (!this.search.val()) {
      this.results.html('');
      this.isLoading = false;
    } else if (!this.isLoading) {
      this.results.html('<div class="spinner-loader"></div>');
      this.isLoading = true;
    }

    this.typingTimer = setTimeout(this.getResults.bind(this), 750);

    this.previousValue = this.search.val();
  }

  getResults(e) {
    $.when(
      $.getJSON(
        universityData.root_url +
          '/wp-json/wp/v2/pages?search=' +
          this.search.val().trim()
      ),
      $.getJSON(
        universityData.root_url +
          '/wp-json/wp/v2/posts?search=' +
          this.search.val().trim()
      )
    ).then((posts, pages) => {
      var combinedResults = [...posts[0], ...pages[0]];
      this.results.html(
        `<h2 class="search-overlay__section-title">General Information</h2>
      ${
        combinedResults.length
          ? '<ul class="link-list min-list">'
          : '<p>No General information matches that search</p>'
      }
        ${combinedResults
          .map(
            (post) =>
              `<li>
            <a href="${post.link}">${post.title.rendered}</a>
          </li>`
          )
          .join('')}
      ${combinedResults.length ? '</ul>' : ''}
     `
      );
      this.isLoading = false;
    }, (error) => {
      this.results.html(`
        <p>Unexpected error; please try again.</p>
      `)
    });
  }

  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active');
    $('body').addClass('body-no-scroll');
    this.overlayIsOpen = true;
    setTimeout(() => {
      this.search.focus();
    }, 301);
    this.search.val('');
  }

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active');
    $('body').removeClass('body-no-scroll');
    this.overlayIsOpen = false;
  }

  keyPressDispatcher(e) {
    if (e.keyCode === 83 && !this.overlayIsOpen && !this.inputs.is(':focus')) {
      this.openOverlay();
    }

    if (e.keyCode === 27 && this.overlayIsOpen) {
      this.closeOverlay();
    }
  }

  addSearchHTML() {
    $('body').append(
      `
    <div class="search-overlay">
    <div class="search-overlay__top">
      <div class="container">
        <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
        <input type="text" name="" id="search-term" class="search-term" placeholder="What are you looking for" autocomplete="off">
        <i class="fa fa-window-close search-overlay__close" id="" aria-hidden="true"></i>
      </div>
    </div>
    <div class="container">
      <div id="search-overlay__results">
  
      </div>
    </div>
  </div>
  `
    );
  }
}

export default Search;
