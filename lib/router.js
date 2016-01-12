Router.configure({
    layoutTemplate: 'appBody',
    loadingTemplate: 'loading'
});

Router.onBeforeAction(function () {
    if (!Meteor.userId() && !Meteor.loggingIn()) {
        Router.go('login');
    } else {
        this.next();
    }
});

Router.route('/', {
    name: 'login',
    template: 'login',
    layoutTemplate: 'login',
    onBeforeAction: function () {
        if (Meteor.userId() || Meteor.loggingIn()) {
            Router.go('tweets');
        }
    },
    action: function () {
        this.render();
    }
});

Router.route('/mentions', {
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
