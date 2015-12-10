Twit = Meteor.npmRequire('twit');

T = new Twit({
    consumer_key:         Meteor.settings.twitter_consumer_key, // API key
    consumer_secret:      Meteor.settings.twitter_consumer_secret, // API secret
    access_token:         Meteor.settings.twitter_access_token,
    access_token_secret:  Meteor.settings.twitter_access_token_secret
});
