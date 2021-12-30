import $, { type } from 'jquery';

class Like {
  constructor() {
    this.events();
  }

  events() {
    $('.like-box').on('click', this.clickDispatcher.bind(this));
  }

  clickDispatcher(e) {
    const likeBox = $(e.target).closest('.like-box');

    if (likeBox.attr('data-exists') == 'yes') {
      this.deleteLike(likeBox);
    } else {
      this.createLike(likeBox);
    }
  }

  createLike(likeBox) {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'POST',
      data: { professorId: likeBox.attr('data-id') },
      success: (response) => {
        likeBox.attr('data-exists', 'yes');
        let likeCount = +likeBox.find('.like-count').html();
        likeBox.find('.like-count').html(++likeCount);
        likeBox.attr('data-like', response);
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  deleteLike(likeBox) {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'DELETE',
      data: { like: likeBox.attr('data-like') },
      success: (response) => {
        likeBox.attr('data-exists', 'no');
        let likeCount = +likeBox.find('.like-count').html();
        likeBox.find('.like-count').html(--likeCount);
        likeBox.attr('data-like', '');
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
}

export default Like;
