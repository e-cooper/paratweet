Template.loading.rendered = function () {
  if (!Session.get('loadingSplash')) {
    this.loading = window.pleaseWait({
      logo: '',
      backgroundColor: '#82cb1c',
      loadingHtml: spinner
    });
    Session.set('loadingSplash', true);
  }
};

Template.loading.destroyed = function () {
  if (this.loading) {
    this.loading.finish();
  }
};

var spinner = '<div class="sk-spinner sk-spinner-wave">'
  + ' <div class="sk-rect1"></div>'
  + ' <div class="sk-rect2"></div>'
  + ' <div class="sk-rect3"></div>'
  + ' <div class="sk-rect4"></div>'
  + ' <div class="sk-rect5"></div>'
  + '</div>';
