Template.twitterTimeline.onCreated(function () {
    Meteor.call("setPending", "Tweets");
});

Template.twitterTimeline.helpers({
    rawData: function () {
        var arr = new Array();
        Tweets.find({owner: Meteor.userId()}).forEach(function (tweet) {
            arr.push(JSON.stringify(tweet, null, 2));
        });

        return arr;
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
