Template.postTicketModal.onRendered(function () {
    if (Session.get('loadedUsers')) {
        Session.set('loadedUsers', false);
        var users = [];
        var proUsersPromise = card.services('environment').request('users', {
            per_page: 100
        });
        proUsersPromiseLoop(proUsersPromise, users, function (data) {
            users = users.concat(data.users);
            return {
                users: users,
                done: data.meta.current_page >= data.meta.page_count,
                value: ++data.meta.current_page
            };
        });
    }

    if (Session.get('currentTargetContent')) {
        var description = $('textarea#ticket-description');
        var senderScreenName =
            (Session.get('currentTargetContent').user)
            ? Session.get('currentTargetContent').user.screen_name
            : Session.get('currentTargetContent').sender_screen_name;

        description.val(
            Session.get('currentTargetContent').text
            + '\n- @'
            + senderScreenName
            + '\n\nSent using Paratweet'
        );
    }
});

Template.postTicketModal.helpers({
    checkIfLoaded: function () {
        return Session.get('loadedUsers');
    },
    proUsers: function () {
        return Session.get('proUsers');
    },
    priorities: function () {
        return ["Low", "Medium", "High"];
    }
});

Template.postTicketModal.events({
    "click .postTicket": function () {
        if ($('input#ticket-summary').val().length) {
            card.services('helpdesk').request('ticket:create', {
                summary: $('input#ticket-summary').val(),
                description: $('textarea#ticket-description').val(),
                assignee: $('#ticket-assignee-select').val(),
                priority: $('#ticket-priority-select').val()
            }).then(function (data) {
                FlashMessages.sendSuccess("Ticket successfully created.");
                Meteor.call("insertTicket", Session.get('currentTargetContent'), data);
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
            FlashMessages.sendError("Form error: Summary required");
        }
    }
});
