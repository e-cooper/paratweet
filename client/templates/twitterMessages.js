Template.twitterMessages.helpers({
    rawData: function () {
        var arr = new Array();
        Messages.find({owner: Meteor.userId()}).forEach(function (message) {
            arr.push(JSON.stringify(message, null, 2));
        });

        return arr;
    },
    pendingMessageCount: function () {
        return Messages.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
    }
});

Template.twitterMessages.events({
    "click .pending": function () {
        Meteor.call("setPending", "Messages");
    }
});
