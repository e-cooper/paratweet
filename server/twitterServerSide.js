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

Accounts.onLogin(function () {
    Meteor.call("setPending", "Tweets");
    Meteor.call("setPending", "Messages");
});

Meteor.startup(function () {
    Meteor.setTimeout(myTask, interval);
});

// Try to update the tweets for all of the unique logged in users that are
// using the app every 60 seconds
var interval = 60 * 1000; // 60 seconds
function myTask () {
    var userIds = presences.find({}, {fields: {userId: true}, sort: {userId: 1}}).map(function (p) {
        return p.userId;
    });
    var compacted = _.chain(userIds).uniq(true).compact().value();

    console.log(compacted);

    for (let u of compacted) {
        var user = Meteor.users.findOne(u);
        // TODO: remove later
        console.log("auto getting tweets");
        Meteor.call("getTweets", user);
        // TODO: remove later
        console.log("auto getting messages");
        Meteor.call("getMessages", user);
    }
    Meteor.setTimeout(myTask, interval);
}
