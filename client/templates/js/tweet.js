Template.tweet.helpers({
    existingTickets: function () {
        return Tickets.find({"parent.id_str": this.content.id_str});
    },
    existingComments: function () {
        return TicketComments.find({"parent.id_str": this.content.id_str});
    }
});

Template.tweet.events({
    "click button.openModal": function (event, template) {
        var name = template.$(event.target).data('modal-template');
        Session.set('activeModal', name);
        Session.set('currentTargetContent', this.content);
    }
});
