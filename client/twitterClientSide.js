Meteor.subscribe("tweets");
Meteor.subscribe("messages");

Template.body.helpers({
    showMessages: function () {
        return Session.get("showMessages");
    }
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

Template.showMessagesButton.helpers({
    messagesOrTweets: function () {
        if (Session.get("showMessages")) {
            return "Tweets";
        } else {
            return "Messages";
        }
    }
});

Template.showMessagesButton.events({
    "click .showMessages": function () {
        if (Session.get("showMessages")) {
            Session.set("showMessages", false);
        } else {
            Session.set("showMessages", true);
        }
    }
});

Template.twitterMessages.events({
    "click .pending": function () {
        Meteor.call("setPending", "Messages");
    }
});

Template.twitterTimeline.events({
    "click .pending": function () {
        Meteor.call("setPending", "Tweets");
    }
});

Template.postTweetButton.events({
    "click .postTweet": function () {
        Meteor.call("postTweet", "This is a tweet!" + new Date());
    }
});
