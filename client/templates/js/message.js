Template.message.onRendered(function () {
    this.$('.tooltipped').tooltip();
});

Template.message.helpers({
    biggerProfileImageUrl: function () {
        return this.content.sender.profile_image_url.replace(/normal/i, "bigger");
    },
    existingTickets: function () {
        return Tickets.find({"parent.id_str": this.content.id_str});
    },
    existingComments: function () {
        return TicketComments.find({"parent.id_str": this.content.id_str});
    }
});

Template.message.events({
    "click a.openModal": function (event, template) {
        var name = template.$(event.target).closest('a.openModal').data('modal-template');
        Session.set('currentTargetContent', this.content);
        Modal.show(name);
    }
});
