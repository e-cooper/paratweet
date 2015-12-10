ServiceConfiguration.configurations.remove({
    service: 'twitter'
});
ServiceConfiguration.configurations.insert({
    service: 'twitter',
    consumerKey: Meteor.settings.twitter_consumer_key,
    secret: Meteor.settings.twitter_consumer_secret
});
