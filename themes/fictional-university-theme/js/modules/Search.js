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
    $.getJSON(
      universityData.root_url +
        '/wp-json/university/v1/search?term=' +
        this.search.val().trim(),
      (results) => {
        this.results.html(`
            <div class="row">
              <div class="one-third">
                <h2 class="search-overlay__section-title">General Information</h2>
                ${
                  results.generalInfo.length
                    ? '<ul class="link-list min-list">'
                    : '<p>No General information matches that search</p>'
                }
                  ${results.generalInfo
                    .map(
                      (post) =>
                        `<li>
                      <a href="${post.permalink}">${post.title} </a>
                      ${post.postType === 'post' ? `by ${post.authorName}` : ''}
                    </li>`
                    )
                    .join('')}
                ${results.generalInfo.length ? '</ul>' : ''}
              </div>
              <div class="one-third">
                <h2 class="search-overlay__section-title">Programs</h2>
                ${
                  results.programs.length
                    ? '<ul class="link-list min-list">'
                    : `<p>No Programs matches that search</p> <a href="${universityData.root_url}/programs">View all programs</a>`
                }
                  ${results.programs
                    .map(
                      (post) =>
                        `<li>
                      <a href="${post.permalink}">${post.title} </a>
                    </li>`
                    )
                    .join('')}
                ${results.programs.length ? '</ul>' : ''}
                <h2 class="search-overlay__section-title">Professors</h2>
                ${
                  results.professors.length
                    ? '<ul class="link-list min-list">'
                    : '<p>No Professors matches that search</p>'
                }
                  ${results.professors
                    .map(
                      (post) =>
                        `
                        <li class="professor-card__list-item">
                          <a class="professor-card" href="${post.permaLink}">
                            <img class="professor-card__image" src="${post.image}">
                            <span class="professor-card__name">${post.title}</span>
                          </a>
                        </li>
                        
                        `
                    )
                    .join('')}
                ${results.professors.length ? '</ul>' : ''}
              </div>
              <div class="one-third">
                <h2 class="search-overlay__section-title">Campuses</h2>
                ${
                  results.campuses.length
                    ? '<ul class="link-list min-list">'
                    : `<p>No campus matches that search</p> <a href="${universityData.root_url}/campuses">View all campuses</a>`
                }
                  ${results.campuses
                    .map(
                      (post) =>
                        `<li>
                      <a href="${post.permalink}">${post.title} </a>
                    </li>`
                    )
                    .join('')}
                ${results.campuses.length ? '</ul>' : ''}
                <h2 class="search-overlay__section-title">Events</h2>
                ${
                  results.events.length
                    ? ''
                    : `<p>No events matches that search</p> <a href="${universityData.root_url}/events">View all events</a>`
                }
                  ${results.events
                    .map(
                      (event) =>
                        `
                        <div class="event-summary">
                          <a class="event-summary__date t-center" href="${event.permaLink}">
                            <span class="event-summary__month">${event.month}</span>
                            <span class="event-summary__day">${event.day}</span>  
                          </a>
                          <div class="event-summary__content">
                            <h5 class="event-summary__title headline headline--tiny"><a href="${event.permaLink}">${event.title}</a></h5>
                            <p>${event.excerpt}<a href="${event.permaLink}" class="nu gray">Learn more</a></p>
                          </div>
                        </div>

                        `
                    )
                    .join('')}
              </div>
            </div>
          `);
        this.isLoading = false;
      }
    );
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
