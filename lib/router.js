Router.configure({
    layoutTemplate: 'appBody',
    loadingTemplate: 'loading'
});

Router.route('/', {
    name: 'tweets',
    template: 'twitterTimeline',
    waitOn: function () {
        return Meteor.subscribe('tweets');
    },
    action: function () {
        this.render();
    }
});

Router.route('/direct_messages', {
    name: 'messages',
    template: 'twitterMessages',
    waitOn: function () {
        return Meteor.subscribe('messages');
    },
    action: function () {
        this.render();
    }
});
