Template.postFeedbackModal.helpers({
    feedbackReason: function () {
        return [
            { id: 0, text: "Issue / Bug with Existing Functionality" },
            { id: 1, text: "Feature Request" },
            { id: 2, text: "Other" }
        ];
    }
});

Template.postFeedbackModal.events({
    "click .postFeedback": function (event, template) {
        var nameVal = $('.modal.fade.in #feedback-name').val();
        var emailVal = $('.modal.fade.in #feedback-email').val();
        var feedbackObj = {
            name: !nameVal ? 'no name provided' : nameVal,
            email: !emailVal.trim() ? 'no email provided' : emailVal,
            type: $('.modal.fade.in #feedback-select').children('option').filter(':selected').text(),
            description: $('.modal.fade.in #feedback-description').val(),
            agree: $('.modal.fade.in #feedback-agree').prop('checked')
        };
        Meteor.call("sendEmail", Meteor.user(), feedbackObj, true, function (error, result) {
            if (error) {
                FlashMessages.sendError(error);
            } else {
                FlashMessages.sendSuccess("Feedback sent successfully.")
            }
        });
        Modal.hide();
    }
});
