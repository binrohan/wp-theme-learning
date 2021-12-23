import $ from 'jquery';

class Search {
  constructor() {
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

    this.typingTimer = setTimeout(this.getResults.bind(this), 2000);

    this.previousValue = this.search.val();
  }

  getResults(e) {
    this.results.html(this.previousValue);
    this.isLoading = false;
  }

  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active');
    $('body').addClass('body-no-scroll');
    this.overlayIsOpen = true;
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
}

export default Search;
