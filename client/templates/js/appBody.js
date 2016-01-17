Template.appBody.helpers({
    currentRoute: function () {
        var route = Router.current().route.getName();
        return route.charAt(0).toUpperCase() + route.slice(1);
    },
    pendingObject: function () {
        if (Router.current().route.getName() === "mentions") {
            return Tweets.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
        } else if (Router.current().route.getName() === "messages") {
            return Messages.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
        }
    }
});

Template.appBody.events({
    "click a.openModal": function (event, template) {
        var name = template.$(event.target).closest('a.openModal').data('modal-template');
        Modal.show(name);
    },
    "click .pt-load-new-btn": function () {
        if (Router.current().route.getName() === "mentions") {
            Meteor.call("setPending", "Tweets");
        } else if (Router.current().route.getName() === "messages") {
            Meteor.call("setPending", "Messages");
        }
    }
});
