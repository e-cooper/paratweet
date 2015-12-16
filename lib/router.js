Router.configure({
    layoutTemplate: 'appBody'
});

Router.route('/', function () {
    this.redirect('/tweets');
});

Router.route('/tweets', {
    name: 'tweets',
    template: 'twitterTimeline',
    action: function () {
        this.render();
    }
});

Router.route('/direct_messages', {
    name: 'messages',
    template: 'twitterMessages',
    action: function () {
        this.render();
    }
});
