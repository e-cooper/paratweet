Template.postReplyMessageModal.events({
    "click .postMessage": function (event, template) {
        if ($('.modal.fade.in textarea#message-text').val().length > 0) {
            Meteor.call("postMessage",
                $('.modal.fade.in textarea#message-text').val(),
                Session.get('currentTargetContent').sender_screen_name,
                Session.get('currentTargetContent').sender_id_str,
                function (error, result) {
                if (error) {
                    FlashMessages.sendError(error);
                } else {
                    FlashMessages.sendSuccess("Message successfully sent.");
                }
            });
            Modal.hide();
        } else {
            Modal.hide();
            FlashMessages.sendError("Message text required.")
        }
    }
});
