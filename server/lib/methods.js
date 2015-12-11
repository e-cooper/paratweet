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
        if (user) {
            console.log("attempting to update tweets");

            var lastFetch = Fetches.findOne({owner: user._id}, {sort: {createdAt: -1}})

            // Try to mitigate people hitting the rate limit by denying them
            // updates if the last fetch was recent (less than a minute ago)
            if (lastFetch) {
                var rightNow = new Date();
                var diffInSecs = Math.ceil(Math.abs(lastFetch.createdAt - rightNow) / 1000);

                if (diffInSecs < 60) {
                    console.log("too soon");
                    return;
                }
                console.log("not too soon");
            }

            var tweetsForUser = Tweets.findOne({owner: user._id});
            if (tweetsForUser) {
                console.log("existing tweets found");
                var sinceId = tweetsForUser.data[0].id_str;
                var tweetId = tweetsForUser._id;
            }

            T.get('statuses/user_timeline', {
                screen_name: user.services.twitter.screenName,
                count: 10,
                since_id: sinceId
            }, Meteor.bindEnvironment(function (err, data, response) {
                if (!err && response.statusCode === 200) {
                    var timestamp = new Date();

                    console.log("inserting Fetch");
                    Fetches.insert({
                        amount: data.length,
                        createdAt: timestamp,
                        owner: user._id
                    });

                    console.log("inserting or updating Tweets");
                    // Will do an update or an insert if id doesn't exist
                    Tweets.upsert(tweetId, {
                        $set: {
                            fetchedAt: timestamp,
                            owner: user._id
                        },
                        $push: {
                            data: {
                                $each: data
                            }
                        }
                    });
                }
            }));
        } else {
            throw new Meteor.Error("not-authorized");
        }
    }
});
