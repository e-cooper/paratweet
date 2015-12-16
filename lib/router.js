Router.configure({
    layoutTemplate: 'appBody'
});

Router.route('/', {
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
