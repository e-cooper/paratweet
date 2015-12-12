Meteor.publish("tweets", function () {
    if (this.userId) {
        Meteor.call("getTweets", Meteor.users.findOne(this.userId));
    }
    return Tweets.find({owner: this.userId});
});

Meteor.publish("messages", function () {
    if (this.userId) {
        Meteor.call("getMessages", Meteor.users.findOne(this.userId));
    }
    return Messages.find({owner: this.userId});
});

// Try to update the tweets for all of the users that are using the app
// every 60 seconds
var interval = 60 * 1000; // 60 seconds
function myTask() {
    var userIds = presences.find({}, {userId: true}).map(function (p) {
        return p.userId;
    });

    for (let u of userIds) {
        var user = Meteor.users.findOne(u);
        Meteor.call("getTweets", user);
        Meteor.call("getMessages", user);
    }
    Meteor.setTimeout(myTask, interval);
}
Meteor.setTimeout(myTask, interval);
