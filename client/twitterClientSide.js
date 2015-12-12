Meteor.subscribe("tweets");

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
    },
    pendingTweetCount: function () {
        return Tweets.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
    }
});

Template.twitterTimeline.events({
    "click .pending": function () {
        Meteor.call("setPending");
    }
});

Template.postTweetButton.events({
    "click .postTweet": function () {
        Meteor.call("postTweet", "This is a tweet!" + new Date());
    }
});
