Meteor.subscribe("tweets");

Template.twitterTimeline.helpers({
    rawData: function () {
        return JSON.stringify(Tweets.findOne({owner: Meteor.userId()}), null, 2);
    },
    data: function () {
        var t = Tweets.findOne({owner: Meteor.userId()});
        if (t) {
            return t.data.sort(function (a, b) {
                a = new Date(a.created_at);
                b = new Date(b.created_at);
                return a > b ? -1 : a < b ? 1 : 0;
            });
        }
    }
});

Template.postTweetButton.events({
    "click .postTweet": function () {
        Meteor.call("postTweet", "This is a tweet!");
    }
});
