Meteor.subscribe("tweets");

Pages = new Meteor.Pagination(Tweets, {
    itemTemplate: "tweet",
    templateName: "twitterTimeline"
});

Template.twitterTimeline.helpers({
    rawData: function () {
        var tweetArr = new Array();
        Tweets.find({owner: Meteor.userId()}).forEach(function (tweet) {
            tweetArr.push(JSON.stringify(tweet, null, 2));
        });
        return tweetArr;
    },
    tweets: function () {
        return Tweets.find({owner: Meteor.userId()}, {sort: {createdAt: -1}});
    }
});

Template.postTweetButton.events({
    "click .postTweet": function () {
        Meteor.call("postTweet", "This is a tweet!");
    }
});
