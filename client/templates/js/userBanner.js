Template.userBanner.helpers({
    bannerImage: function () {
        var bannerImage;
        if (Meteor.user() && Meteor.user().services) {
            bannerImage = Meteor.user().services.twitter.banner_image;
        }
        if (bannerImage) {
            return bannerImage.sizes["1500x500"].url;
        } else {
            return "/images/default-banner.jpg";
        }
    },
    screenName: function () {
        if (Meteor.user() && Meteor.user().services) {
            return Meteor.user().services.twitter.screenName;
        }
    },
    userName: function () {
        return Meteor.user().profile.name;
    }
});
