ServiceConfiguration.configurations.remove({
    service: 'twitter'
});
ServiceConfiguration.configurations.insert({
    service: 'twitter',
    consumerKey: Meteor.settings.TWITTER_CONSUMER_KEY,
    secret: Meteor.settings.TWITTER_CONSUMER_SECRET
});
