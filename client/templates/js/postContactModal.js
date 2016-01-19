Template.postContactModal.events({
    "click .postContact": function (event, template) {
        var nameVal = $('.modal.fade.in #contact-name').val();
        var emailVal = $('.modal.fade.in #contact-email').val();
        var contactObj = {
            name: !nameVal ? 'no name provided' : nameVal,
            email: !emailVal.trim() ? 'no email provided' : emailVal,
            type: "Message",
            description: $('.modal.fade.in #contact-description').val(),
            agree: $('.modal.fade.in #contact-agree').prop('checked')
        };
        Meteor.call("sendEmail", null, contactObj, false, function (error, result) {
            if (error) {
                FlashMessages.sendError(error);
            } else {
                FlashMessages.sendSuccess("Message sent successfully.");
            }
        });
        Modal.hide();
    }
});
