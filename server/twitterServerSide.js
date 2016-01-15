Meteor.publish("tweets", function () {
    if (this.userId && Tweets.find({owner: this.userId}).count() <= 0) {
        Meteor.call("getTweets", Meteor.users.findOne(this.userId));
    }
    return Tweets.find({owner: this.userId});
});

Meteor.publish("messages", function () {
    if (this.userId && Messages.find({owner: this.userId}).count() <= 0) {
        Meteor.call("getMessages", Meteor.users.findOne(this.userId));
    }
    return Messages.find({owner: this.userId});
});

Meteor.publish("tickets", function () {
    return Tickets.find({owner: this.userId});
});

Meteor.publish("ticket_comments", function () {
    return TicketComments.find({owner: this.userId});
});

Meteor.publish("user_data", function () {
    if (this.userId) {
        Meteor.call("getBannerImage", Meteor.users.findOne(this.userId));
    }
    return Meteor.users.find({_id: this.userId}, {
        fields: {
            "services.twitter.banner_image": 1,
            "services.twitter.screenName": 1
        }
    });
});

Meteor.startup(function () {
    Meteor.setTimeout(requestTwitterData, interval);
});

// Try to update the tweets for all of the unique logged in users that are
// using the app every 60 seconds
var interval = 60 * 1000; // 60 seconds
function requestTwitterData () {
    var userIds = presences.find({}, {fields: {userId: true}, sort: {userId: 1}}).map(function (p) {
        return p.userId;
    });
    // Chain these methods -> get unique, remove falsy values -> return result
    var compacted = _.chain(userIds).uniq(true).compact().value();

    console.log(compacted);

    for (let u of compacted) {
        var user = Meteor.users.findOne(u);
        console.log("auto getting rate limits");
        Meteor.call("getRateLimits", user, function (error, result) {
            if (error) console.log(error);
        });

        // refetch user since rate limit will change it
        user = Meteor.users.findOne(u);
        var statusRateLimit = user.services.twitter.rate_limits.resources.statuses["/statuses/mentions_timeline"].remaining;
        console.log(statusRateLimit);
        if (statusRateLimit > 0) {
            // TODO: remove later
            console.log("auto getting tweets");
            Meteor.call("getTweets", user, function (error, result) {
                if (error) console.log(error);
            });
        }

        var messageRateLimit = user.services.twitter.rate_limits.resources.direct_messages["/direct_messages"].remaining;
        console.log(messageRateLimit);
        if (messageRateLimit > 0) {
            // TODO: remove later
            console.log("auto getting messages");
            Meteor.call("getMessages", user, function (error, result) {
                if (error) console.log(error);
            });
        }

        // TODO: remove later
        console.log("auto getting banner image");
        Meteor.call("getBannerImage", user, function (error, result) {
            if (error) console.log(error);
        });
    }
    Meteor.setTimeout(requestTwitterData, interval);
}
