Meteor.methods({
    postTweet: function (text) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        T.post('statuses/update', { status: text }, function (err, data, response) {
            console.log(err);
            console.log(data);
            console.log(response);
        });
    },
    getTweets: function (user, since_id) {
        if (user) {
            T.get('statuses/user_timeline', {
                screen_name: user.services.twitter.screenName,
                count: 10,
                since_id: since_id
            }, Meteor.bindEnvironment(function (err, data, response) {
                if (!err && response.statusCode === 200) {
                    Tweets.insert({
                        data: data,
                        fetchedAt: new Date(),
                        owner: user._id
                    });
                }
            }));
        } else {
            throw new Meteor.Error("not-authorized");
        }
    }
});
