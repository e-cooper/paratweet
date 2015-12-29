Template.postTicketModal.onRendered(function () {
    if (Session.get('currentTargetContent')) {
        var description = $('input#ticketDescription');
        var senderScreenName =
            (Session.get('currentTargetContent').user)
            ? Session.get('currentTargetContent').user.screen_name
            : Session.get('currentTargetContent').sender_screen_name;

        description.val(
            '"'
            + Session.get('currentTargetContent').text
            + '"'
            + ' - @'
            + senderScreenName
        );
    }
});

Template.postTicketModal.helpers({
    proUsers: function () {
        return Session.get('proUsers');
    },
    priorities: function () {
        return ["Low", "Medium", "High"];
    }
});

Template.postTicketModal.events({
    "change #assignee-select": function (event, template) {
        var user = $(event.target).val();
        console.log("user selected: " + user);
    },
    "click button.closeModal": function () {
        Session.set('activeModal', null);
    },
    "click .postTicket": function () {
        if ($('input#ticketSummary').val().length) {
            card.services('helpdesk').request('ticket:create', {
                summary: $('input#ticketSummary').val(),
                description: $('input#ticketDescription').val(),
                assignee: $('#assignee-select').val(),
                priority: $('#priority-select').val()
            }).then(function (data) {
                FlashMessages.sendSuccess("Ticket successfully created.");
                Meteor.call("insertTicket", Session.get('currentTargetContent'), data);
                return data;
            }, function (error, result) {
                var errArray = [];
                _.each(error.errors, function (err) {
                    errArray.push(err.title);
                });
                FlashMessages.sendError("Error creating ticket: " + errArray.to_sentence());
                return error;
            });
            Session.set('activeModal', null);
        } else {
            // TODO: Add more form errors?
            FlashMessages.sendError("Form error: Summary required");
        }
    }
});
