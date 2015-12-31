Template.tweet.helpers({
    biggerProfileImageUrl: function () {
        return this.content.user.profile_image_url.replace(/normal/i, "bigger");
    },
    existingTickets: function () {
        return Tickets.find({"parent.id_str": this.content.id_str});
    },
    existingComments: function () {
        return TicketComments.find({"parent.id_str": this.content.id_str});
    }
});

Template.tweet.events({
    "click button.openModal, click a.openModal, click button.openModal span": function (event, template) {
        var name = template.$(event.target).data('modal-template');
        Session.set('currentTargetContent', this.content);
        Modal.show(name);
    }
});
