Meteor.subscribe("tweets");
Meteor.subscribe("messages");

// Timeline stuff

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

Template.twitterTimeline.onRendered(function () {
    Meteor.call("setPending", "Tweets");
});

// Tweet stuff

Template.tweet.helpers({
    replies: function () {
        return Tweets.find({"content.in_reply_to_status_id_str": this.content.id_str});
    }
});

// Messages stuff

Template.twitterMessages.helpers({
    rawData: function () {
        var arr = new Array();
        Messages.find({owner: Meteor.userId()}).forEach(function (message) {
            arr.push(JSON.stringify(message, null, 2));
        });

        return arr;
    },
    pendingMessageCount: function () {
        return Messages.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
    }
});

Template.twitterMessages.events({
    "click .pending": function () {
        Meteor.call("setPending", "Messages");
    }
});

// viewLink stuff

Template.viewLink.helpers({
    currentlyOnTweets: function () {
        return Router.current().route.getName() === "tweets";
    }
});

// postTweetButton stuff

Template.postTweetButton.events({
    "click .postTweet": function () {
        Meteor.call("postTweet", "This is a tweet!" + new Date());
    }
});
