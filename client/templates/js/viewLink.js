Template.viewLink.helpers({
    pendingDocument: function (objectType) {
        var objects;
        if (objectType === "Tweets") {
            objects = Tweets.find({owner: Meteor.userId(), pending: {$ne: false}});
        } else if (objectType === "Messages") {
            objects = Messages.find({owner: Meteor.userId(), pending: {$ne: false}});
        }

        if (objects.count() > 0) {
            return true;
        } else {
            return false;
        }
    },
    checkActiveRoute: function (objectType) {
        if (Router.current().route.getName() !== objectType) {
            return "inactive";
        }
    }
});
