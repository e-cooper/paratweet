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
    getTweets: function (user) {
        var lastFetch, rightNow, diffInSecs, lastTweet, sinceId, timestamp;

        if (user) {
            lastFetch = Fetches.findOne({owner: user._id}, {sort: {createdAt: -1}})

            // Try to mitigate people hitting the rate limit by denying them
            // updates if the last fetch was recent (less than a minute ago)
            if (lastFetch) {
                rightNow = new Date();
                diffInSecs = Math.ceil(Math.abs(lastFetch.createdAt - rightNow) / 1000);

                if (diffInSecs < 60) {
                    return;
                }
            }

            lastTweet = Tweets.findOne({owner: user._id}, {sort: {createdAt: -1}});
            if (lastTweet) {
                sinceId = lastTweet.content.id_str;
            }

            T.get('statuses/user_timeline', {
                screen_name: user.services.twitter.screenName,
                count: 10,
                since_id: sinceId
            }, Meteor.bindEnvironment(function (err, data, response) {
                if (!err && response.statusCode === 200) {
                    timestamp = new Date();

                    Fetches.insert({
                        amount: data.length,
                        createdAt: timestamp,
                        owner: user._id
                    });

                    _.each(data, function (tweet) {
                        Tweets.insert({
                            content: tweet,
                            createdAt: timestamp,
                            owner: user._id,
                        });
                    });
                }
            }));
        } else {
            throw new Meteor.Error("not-authorized");
        }
    }
});
