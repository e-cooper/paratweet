Template.postReplyModal.onCreated(function () {
    this.charCount = new ReactiveVar();
    this.charCount.set(0);
});

Template.postReplyModal.onRendered(function () {
    $('textarea#tweetBox').val('@' + Session.get('currentTargetContent').user.screen_name + ' ');
    this.charCount.set(TwitterText.getTweetLength($('textarea#tweetBox').val()));
});

Template.postReplyModal.helpers({
    remainingCharCount: function () {
        return 140 - Template.instance().charCount.get();
    }
});

Template.postReplyModal.events({
    "click .postTweet": function (event, template) {
        if (template.charCount.get() > 0 && template.charCount.get() <= 140 ) {
            Meteor.call("postTweet", $('textarea#tweetBox').val(), Session.get('currentTargetContent').id_str);
            $('textarea#tweetBox').val('');
            Session.set('activeModal', null);
        } else {
            console.log("You can't do that man");
        }
    },
    "input textarea#tweetBox": function(event, template) {
        template.charCount.set(TwitterText.getTweetLength($('textarea#tweetBox').val()));
    },
    "click button.closeModal": function () {
        Session.set('activeModal', null);
    }
});
