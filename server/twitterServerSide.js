Meteor.publish("tweets", function () {
    var user = null;
    if (this.userId) {
        user = Meteor.users.findOne(this.userId);
    }

    var latestTweetForUser = Tweets.findOne({owner: this.userId}, {sort: {fetchedAt: -1}});
    if (latestTweetForUser) {
        Meteor.call("getTweets", user, latestTweetForUser.data[0].id);
    } else {
        Meteor.call("getTweets", user);
    }

    return Tweets.find();
});
