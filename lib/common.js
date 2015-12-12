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

this.Pages2 = new Meteor.Pagination(Messages, {
    sort: {
        createdAt: -1
    },
    itemTemplate: "message",
    templateName: "twitterMessages",
    availableSettings: {
        sort: true
    },
    auth: function (skip, sub) {
        return Messages.find({owner: sub.userId, pending: {$ne: true}}, {sort: {createdAt: -1}});
    }
});
