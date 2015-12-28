Template.postTicketCommentModal.onRendered(function () {
    if (Session.get('currentTargetContent')) {
        var body = $('input#ticketCommentBody');
        var senderScreenName =
            (Session.get('currentTargetContent').user)
            ? Session.get('currentTargetContent').user.screen_name
            : Session.get('currentTargetContent').sender_screen_name;

        body.val(
            '"'
            + Session.get('currentTargetContent').text
            + '"'
            + ' - @'
            + senderScreenName
        );
    }
});

Template.postTicketCommentModal.helpers({
    openTickets: function () {
        return Session.get('openTickets');
    }
});

Template.postTicketCommentModal.events({
    "click button.closeModal": function () {
        Session.set('activeModal', null);
    },
    "click .postTicketComment": function () {
        var bodyContent = $('input#ticketCommentBody').val().length;
        var ticketSelected = Number($('#ticket-select').val());
        if (bodyContent) {
            card.services('helpdesk').request('comment:create', ticketSelected, {
                body: $('input#ticketCommentBody').val(),
                public: $('input#ticketCommentPublic').prop('checked')
            }).then(function (data) {
                // TODO: Add success alert
                console.log("data: " + data);
                return data;
            }, function (error, result) {
                // TODO: Add error alert
                console.log("error: " + error);
                return error;
            });
            Session.set('activeModal', null);
        } else {
            // TODO: Add form errors?
            console.log("body is too short");
        }
    }
});
