Template.postReplyModal.onCreated(function () {
    this.charCount = new ReactiveVar();
    this.charCount.set(0);
});

Template.postReplyModal.onRendered(function () {
    $('textarea#reply-body').val('@' + Session.get('currentTargetContent').user.screen_name + ' ');
    this.charCount.set(TwitterText.getTweetLength($('textarea#reply-body').val()));
});

Template.postReplyModal.helpers({
    remainingCharCount: function () {
        return 140 - Template.instance().charCount.get();
    }
});

Template.postReplyModal.events({
    "click .postReply": function (event, template) {
        if (template.charCount.get() > 0 && template.charCount.get() <= 140 ) {
            Meteor.call("postReply", $('.modal.fade.in textarea#reply-body').val(), Session.get('currentTargetContent').id_str, function (error, result) {
                if (error) {
                    FlashMessages.sendError(error);
                } else {
                    FlashMessages.sendSuccess("Reply sent successfully.");
                }
            });
            Modal.hide();
        } else {
            Modal.hide();
            FlashMessages.sendError("Your reply body is not an acceptable length: must be between 1 and 140 characters.");
        }
    },
    "input textarea#reply-body": function(event, template) {
        template.charCount.set(TwitterText.getTweetLength($('.modal.fade.in textarea#reply-body').val()));
        var remainingCharCount = 140 - Template.instance().charCount.get();
        var postReplyButton = $('.modal.fade.in button.postReply');
        if (remainingCharCount < 0 || remainingCharCount >= 140) {
            postReplyButton.prop('disabled', true);
        } else {
            postReplyButton.prop('disabled', false);
        }
    }
});
