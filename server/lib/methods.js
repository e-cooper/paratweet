Meteor.methods({
    postReply: function (text, replyIdStr) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        var T = new Twit({
            consumer_key:         Meteor.settings.TWITTER_CONSUMER_KEY, // API key
            consumer_secret:      Meteor.settings.TWITTER_CONSUMER_SECRET, // API secret
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
            consumer_key:         Meteor.settings.TWITTER_CONSUMER_KEY, // API key
            consumer_secret:      Meteor.settings.TWITTER_CONSUMER_SECRET, // API secret
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
    getRateLimits: function (user) {
        var T, getRateCall, getRateResult;

        T = new Twit({
            consumer_key:         Meteor.settings.TWITTER_CONSUMER_KEY, // API key
            consumer_secret:      Meteor.settings.TWITTER_CONSUMER_SECRET, // API secret
            access_token:         user.services.twitter.accessToken,
            access_token_secret:  user.services.twitter.accessTokenSecret
        });

        getRateCall = Meteor.wrapAsync(T.get, T);

        try {
            getRateResult = getRateCall('application/rate_limit_status', {
                resources: 'users,statuses,direct_messages'
            });

            Meteor.users.update(user._id, {
                $set: {
                    "services.twitter.rate_limits": getRateResult
                }
            });

            return getRateResult;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    getBannerImage: function (user) {
        var T, getBannerCall, getBannerResult, lastFetch;

        T = new Twit({
            consumer_key:         Meteor.settings.TWITTER_CONSUMER_KEY, // API key
            consumer_secret:      Meteor.settings.TWITTER_CONSUMER_SECRET, // API secret
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

            Fetches.upsert({
                type: 'BannerImage',
                owner: user._id,
            }, {
                $set: {
                    amount: getBannerResult.length,
                    result: getBannerResult,
                    fetchedAt: new Date()
                }
            });

            return getBannerResult;
        } catch (error) {
            console.log(error);
            Meteor.users.update(user._id, {$set:
                {"services.twitter.banner_image": null}
            });
            return null;
        }
    },
    getTweets: function (user) {
        var T, lastFetch, lastTweet, sinceId, timestamp, getTweetsCall, getTweetsResult;

        T = new Twit({
            consumer_key:         Meteor.settings.TWITTER_CONSUMER_KEY, // API key
            consumer_secret:      Meteor.settings.TWITTER_CONSUMER_SECRET, // API secret
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

        getTweetsCall = Meteor.wrapAsync(T.get, T);

        try {
            getTweetsResult = getTweetsCall('statuses/mentions_timeline', {
                screen_name: user.services.twitter.screenName,
                count: 200,
                since_id: sinceId
            });

            timestamp = new Date();

            Fetches.upsert({
                type: 'Tweets',
                owner: user._id,
            }, {
                $set: {
                    amount: getTweetsResult.length,
                    result: getTweetsResult,
                    createdAt: timestamp
                }
            });

            _.each(getTweetsResult, function (tweet) {
                Tweets.insert({
                    createdAt: new Date(tweet.created_at),
                    fetchedAt: timestamp,
                    owner: user._id,
                    pending: true,
                    content: tweet
                });
            });

            return getTweetsResult;
        } catch (error) {
            throw new Meteor.Error("twitter-error", error.statusCode + " " + error.message);
        }
    },
    getMessages: function (user) {
        var T, lastFetch, lastMessage, sinceId, timestamp, getMessagesCall, getMessagesResult;

        T = new Twit({
            consumer_key:         Meteor.settings.TWITTER_CONSUMER_KEY, // API key
            consumer_secret:      Meteor.settings.TWITTER_CONSUMER_SECRET, // API secret
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

        getMessagesCall = Meteor.wrapAsync(T.get, T);

        try {
            getMessagesResult = getMessagesCall('direct_messages', {
                count: 200,
                since_id: sinceId
            });

            timestamp = new Date();

            Fetches.upsert({
                type: 'Messages',
                owner: user._id,
            }, {
                $set: {
                    amount: getMessagesResult.length,
                    result: getMessagesResult,
                    createdAt: timestamp
                }
            });

            _.each(getMessagesResult, function (message) {
                Messages.insert({
                    createdAt: new Date(message.created_at),
                    fetchedAt: timestamp,
                    owner: user._id,
                    pending: true,
                    content: message
                });
            });

            return getMessagesResult;
        } catch (error) {
            throw new Meteor.Error("twitter-error", error.statusCode + " " + error.message);
        }
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

        TicketComments.insert({
            ticketId: ticketId,
            owner: Meteor.userId(),
            parent: objData,
            content: respData
        });
    },
    sendEmail: function (user, feedbackObj, feedback) {
        if (feedback && !Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }

        this.unblock();

        var subject = feedback ? "feedback" : "contact";
        var userObj = user ? JSON.stringify(user) : "no user";
        var text = "<h4>"
                    + feedbackObj.type
                    + "</h4>"
                    + "<p>"
                    + feedbackObj.description
                    + "</p>"
                    + "<br/>"
                    + "<ul>"
                    + "<li>Name: " + feedbackObj.name + "</li>"
                    + "<li>Email: " + feedbackObj.email + "</li>"
                    + "<li>Agree to be contacted: <b>" + feedbackObj.agree + "</b></li>"
                    + "<li>User object: " + userObj + "</li>"
                    + "</ul>";

        Email.send({
          to: 'paratweetapp@gmail.com',
          from: 'paratweetapp@gmail.com',
          subject: 'New message from ' + subject + ' form',
          html: text
        });
    }
});
