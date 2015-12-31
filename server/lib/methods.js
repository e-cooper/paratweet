Meteor.methods({
    postReply: function (text, replyIdStr) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var T = new Twit({
            consumer_key:         Meteor.settings.twitter_consumer_key, // API key
            consumer_secret:      Meteor.settings.twitter_consumer_secret, // API secret
            access_token:         Meteor.user().services.twitter.accessToken,
            access_token_secret:  Meteor.user().services.twitter.accessTokenSecret
        });

        var postStatus = Meteor.wrapAsync(T.post, T);

        try {
            var postResult = postStatus('statuses/update', {
                status: text,
                in_reply_to_status_id: replyIdStr
            });
            return postResult;
        } catch (error) {
            throw new Meteor.Error("twitter-error", error.statusCode + " " + error.message);
        }
    },
    postMessage: function (text, replyScreenName, replyIdStr) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var T = new Twit({
            consumer_key:         Meteor.settings.twitter_consumer_key, // API key
            consumer_secret:      Meteor.settings.twitter_consumer_secret, // API secret
            access_token:         Meteor.user().services.twitter.accessToken,
            access_token_secret:  Meteor.user().services.twitter.accessTokenSecret
        });

        var postDirectMessage = Meteor.wrapAsync(T.post, T);

        try {
            var postResult = postDirectMessage('direct_messages/new', {
                text: text,
                screen_name: replyScreenName,
                user_id: replyIdStr
            });
            return postResult;
        } catch (error) {
            throw new Meteor.Error("twitter-error", error.statusCode + " " + error.message);
        }
    },
    getBannerImage: function (user) {
        var T, getBannerCall, getBannerResult, lastFetch;

        T = new Twit({
            consumer_key:         Meteor.settings.twitter_consumer_key, // API key
            consumer_secret:      Meteor.settings.twitter_consumer_secret, // API secret
            access_token:         user.services.twitter.accessToken,
            access_token_secret:  user.services.twitter.accessTokenSecret
        });

        lastFetch = Fetches.findOne({owner: user._id, type: 'BannerImage'}, {sort: {createdAt: -1}});

        // Try to mitigate people hitting the rate limit by denying them
        // updates if the last fetch was recent (less than a minute ago)
        if (lastFetch) {
            if (Math.ceil(Math.abs(lastFetch.createdAt - new Date()) / 1000) < 60) {
                return;
            }
        }

        getBannerCall = Meteor.wrapAsync(T.get, T);

        try {
            getBannerResult = getBannerCall('users/profile_banner', {
                screen_name: user.services.twitter.screenName,
                user_id: user.services.twitter.id
            });

            Meteor.users.update(user._id, {$set:
                {"services.twitter.banner_image": getBannerResult}
            });

            Fetches.insert({
                type: 'BannerImage',
                createdAt: new Date(),
                owner: user._id
            });

            return getBannerResult;
        } catch (error) {
            Meteor.users.update(user._id, {$set:
                {"services.twitter.banner_image": null}
            });
            return null;
        }
    },
    getTweets: function (user) {
        var T, lastFetch, lastTweet, sinceId, timestamp;

        T = new Twit({
            consumer_key:         Meteor.settings.twitter_consumer_key, // API key
            consumer_secret:      Meteor.settings.twitter_consumer_secret, // API secret
            access_token:         user.services.twitter.accessToken,
            access_token_secret:  user.services.twitter.accessTokenSecret
        });

        lastFetch = Fetches.findOne({owner: user._id, type: 'Tweets'}, {sort: {createdAt: -1}})

        // Try to mitigate people hitting the rate limit by denying them
        // updates if the last fetch was recent (less than a minute ago)
        if (lastFetch) {
            if (Math.ceil(Math.abs(lastFetch.createdAt - new Date()) / 1000) < 60) {
                return;
            }
        }

        lastTweet = Tweets.findOne({owner: user._id}, {sort: {createdAt: -1}});
        if (lastTweet) {
            sinceId = lastTweet.content.id_str;
        }

        T.get('statuses/mentions_timeline', {
            screen_name: user.services.twitter.screenName,
            count: 200,
            since_id: sinceId
        }, Meteor.bindEnvironment(function (err, data, response) {
            timestamp = new Date();

            if (!err && response.statusCode === 200 && data.length > 0) {
                Fetches.insert({
                    type: 'Tweets',
                    amount: data.length,
                    createdAt: timestamp,
                    owner: user._id
                });

                _.each(data, function (tweet) {
                    Tweets.insert({
                        createdAt: new Date(tweet.created_at),
                        fetchedAt: timestamp,
                        owner: user._id,
                        pending: true,
                        content: tweet
                    });
                });
            }
        }));
    },
    getMessages: function (user) {
        var T, lastFetch, lastMessage, sinceId, timestamp;

        T = new Twit({
            consumer_key:         Meteor.settings.twitter_consumer_key, // API key
            consumer_secret:      Meteor.settings.twitter_consumer_secret, // API secret
            access_token:         user.services.twitter.accessToken,
            access_token_secret:  user.services.twitter.accessTokenSecret
        });

        lastFetch = Fetches.findOne({owner: user._id, type: 'Messages'}, {sort: {createdAt: -1}})

        // Try to mitigate people hitting the rate limit by denying them
        // updates if the last fetch was recent (less than a minute ago)
        if (lastFetch) {
            if (Math.ceil(Math.abs(lastFetch.createdAt - new Date()) / 1000) < 60) {
                return;
            }
        }

        lastMessage = Messages.findOne({owner: user._id}, {sort: {createdAt: -1}});
        if (lastMessage) {
            sinceId = lastMessage.content.id_str;
        }

        T.get('direct_messages', {
            count: 200,
            since_id: sinceId
        }, Meteor.bindEnvironment(function (err, data, response) {
            if (!err && response.statusCode === 200 && data.length > 0) {
                timestamp = new Date();

                Fetches.insert({
                    type: 'Messages',
                    amount: data.length,
                    createdAt: timestamp,
                    owner: user._id
                });

                _.each(data, function (message) {
                    Messages.insert({
                        createdAt: new Date(message.created_at),
                        fetchedAt: timestamp,
                        owner: user._id,
                        pending: true,
                        content: message
                    });
                });
            }
        }));
    },
    setPending: function (type) {
        if (type === "Tweets") {
            Tweets.find({owner: Meteor.userId(), pending: {$ne: false}}).forEach(function (tweet) {
                Tweets.update(tweet._id, {$set: {pending: false}});
            });
        } else if (type === "Messages") {
            Messages.find({owner: Meteor.userId(), pending: {$ne: false}}).forEach(function (message) {
                Messages.update(message._id, {$set: {pending: false}});
            });
        }
    },
    insertTicket: function (objData, respData) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        Tickets.insert({
            owner: Meteor.userId(),
            parent: objData,
            content: respData
        });
    },
    insertTicketComment: function (ticketId, objData, respData) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        console.log("ticketId: " + ticketId);
        console.log("objData: "); console.log(objData);
        console.log("respData: "); console.log(respData);

        TicketComments.insert({
            ticketId: ticketId,
            owner: Meteor.userId(),
            parent: objData,
            content: respData
        });
    }
});
