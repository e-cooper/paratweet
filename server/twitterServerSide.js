Meteor.publish("tweets", function () {
    var user = null;
    if (this.userId) {
        user = Meteor.users.findOne(this.userId);
    }
    Meteor.call("getTweets", user);
    return Tweets.find({owner: this.userId});
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
        var tweetsForUser = Tweets.findOne({owner: u});
        Meteor.call("getTweets", user);
    }
    Meteor.setTimeout(myTask, interval);
}
Meteor.setTimeout(myTask, interval);
