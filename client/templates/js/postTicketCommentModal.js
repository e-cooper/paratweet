Template.postTicketCommentModal.onRendered(function () {
    if (Session.get('loadedTickets')) {
        Session.set('loadedTickets', false);

        var openTickets = [];
        var openTicketsPromise = card.services('helpdesk').request('tickets', {
            per_page: 100,
            status: 'open'
        });
        ticketsPromiseLoop(openTicketsPromise, openTickets, function (data) {
            openTickets = openTickets.concat(data.tickets);
            return {
                openTickets: openTickets,
                done: data.meta.current_page >= data.meta.page_count,
                value: ++data.meta.current_page
            };
        });
    }

    if (Session.get('currentTargetContent')) {
        var body = $('textarea#ticket-comment-body');
        var senderScreenName =
            (Session.get('currentTargetContent').user)
            ? Session.get('currentTargetContent').user.screen_name
            : Session.get('currentTargetContent').sender_screen_name;

        body.val(
            Session.get('currentTargetContent').text
            + '\n- @'
            + senderScreenName
            + '\n\nSent using Paratweet'
        );
    }
});

Template.postTicketCommentModal.helpers({
    checkIfLoaded: function () {
        return Session.get('loadedTickets');
    },
    openTickets: function () {
        return Session.get('openTickets');
    }
});

Template.postTicketCommentModal.events({
    "click .postTicketComment": function () {
        var bodyContent = $('textarea#ticket-comment-body').val().length;
        var ticketSelected = Number($('#ticket-select').val());
        if (bodyContent) {
            card.services('helpdesk').request('comment:create', ticketSelected, {
                body: $('textarea#ticket-comment-body').val(),
                public: $('input#ticket-comment-public').prop('checked')
            }).then(function (data) {
                FlashMessages.sendSuccess("Ticket comment successfully created.");
                Meteor.call("insertTicketComment", ticketSelected, Session.get('currentTargetContent'), data);
                return data;
            }, function (error, result) {
                var errArray = [];
                _.each(error.errors, function (err) {
                    errArray.push(err.title);
                });
                FlashMessages.sendError("Error creating ticket: " + errArray.to_sentence(), { autoHide: false });
                return error;
            });
            Modal.hide();
        } else {
            // TODO: Add more form errors?
            Modal.hide();
            FlashMessages.sendError("Form error: Body required");
        }
    }
});
