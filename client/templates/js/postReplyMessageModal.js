Template.postReplyMessageModal.events({
    "click .postMessage": function (event, template) {
        if ($('textarea#messageBox').val().length > 0) {
            Meteor.call("postMessage",
                $('textarea#messageBox').val(),
                Session.get('currentTargetContent').sender_screen_name,
                Session.get('currentTargetContent').sender_id_str
            );
            $('textarea#tweetBox').val('');
            Session.set('activeModal', null);
        } else {
            console.log("You can't do that man");
        }
    },
    "click button.closeModal": function () {
        Session.set('activeModal', null);
    }
});
