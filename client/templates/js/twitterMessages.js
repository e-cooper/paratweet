Template.twitterMessages.helpers({
    messagesNotEmpty: function () {
        return Messages.find({owner: Meteor.userId(), pending: {$ne: true}}).count();
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
