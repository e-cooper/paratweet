Meteor.subscribe("tweets");

Template.twitterTimeline.helpers({
    rawData: function () {
        return JSON.stringify(Tweets.findOne(), null, 2);
    },
    data: function () {
        var t = Tweets.findOne();
        if (t) {
            return t.data;
        }
    }
});

Template.postTweetButton.events({
    "click .postTweet": function () {
        Meteor.call("postTweet", "This is a tweet!");
    }
});
