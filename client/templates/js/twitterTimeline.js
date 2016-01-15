Template.twitterTimeline.helpers({
    tweetsNotEmpty: function () {
        return Tweets.find({owner: Meteor.userId(), pending: {$ne: true}}).count();
    },
    pendingTweetCount: function () {
        return Tweets.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
    }
});

Template.twitterTimeline.events({
    "click .pending": function () {
        Meteor.call("setPending", "Tweets");
    }
});
