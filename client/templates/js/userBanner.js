Template.userBanner.helpers({
    bannerImage: function () {
        return Meteor.user().services.twitter.banner_image.sizes["1500x500"].url;
    },
    screenName: function () {
        return Meteor.user().services.twitter.screenName;
    }
});
