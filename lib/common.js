this.Pages = new Meteor.Pagination(Tweets, {
    sort: {
        createdAt: -1
    },
    itemTemplate: "tweet",
    templateName: "twitterTimeline",
    availableSettings: {
        sort: true
    }
});
