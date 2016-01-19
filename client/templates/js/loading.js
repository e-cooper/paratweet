Template.loading.onRendered(function () {
  if (!Session.get('loadingSplash')) {
    this.loading = window.pleaseWait({
      logo: '/images/pt-logo-icon.png',
      backgroundColor: '#e5f0f3',
      loadingHtml: spinner
    });
    Session.set('loadingSplash', true);
  }
});

Template.loading.onDestroyed(function () {
  if (this.loading) {
    this.loading.finish();
  }
});

var spinner = '<div class="sk-spinner sk-spinner-double-bounce">'
  + ' <div class="sk-double-bounce1"></div>'
  + ' <div class="sk-double-bounce2"></div>'
  + ' </div>';
