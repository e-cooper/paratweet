this.Pages = new Meteor.Pagination(Tweets, {
    sort: {
        createdAt: -1
    },
    itemTemplate: "tweet",
    templateName: "twitterTimeline",
    availableSettings: {
        sort: true
    },
    auth: function (skip, sub) {
        return Tweets.find({owner: sub.userId, pending: {$ne: true}}, {sort: {createdAt: -1}});
    }
});
