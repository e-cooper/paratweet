Template.viewLink.helpers({
    currentlyOnTweets: function () {
        return Router.current().route.getName() === "tweets";
    }
});
