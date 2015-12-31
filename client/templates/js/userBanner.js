Template.userBanner.helpers({
    bannerImage: function () {
        var bannerImage = Meteor.user().services.twitter.banner_image.sizes["1500x500"].url;
        if (bannerImage) {
            return bannerImage;
        } else {
            return "/images/default-banner.jpg";
        }
    },
    screenName: function () {
        return Meteor.user().services.twitter.screenName;
    }
});
