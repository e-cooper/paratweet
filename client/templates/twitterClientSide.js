Meteor.subscribe("tweets");
Meteor.subscribe("messages");

// modal stuff

Template.modal.helpers({
    activeModal: function () {
        return Session.get('activeModal');
    }
});

// Timeline stuff

Template.twitterTimeline.onCreated(function () {
    Meteor.call("setPending", "Tweets");
});

Template.twitterTimeline.helpers({
    rawData: function () {
        var arr = new Array();
        Tweets.find({owner: Meteor.userId()}).forEach(function (tweet) {
            arr.push(JSON.stringify(tweet, null, 2));
        });

        return arr;
    },
    pendingTweetCount: function () {
        return Tweets.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
    }
});

Template.twitterTimeline.events({
    "click .pending": function () {
        Meteor.call("setPending", "Tweets");
    }
});

// Tweet stuff

Template.tweet.helpers({
    replies: function () {
        return Tweets.find({"content.in_reply_to_status_id_str": this.content.id_str, pending: {$ne: true}}, {sort: {createdAt: 1}});
    }
});

Template.tweet.events({
    "click button.modal": function (event, template) {
        var name = template.$(event.target).data('modal-template');
        Session.set('activeModal', name);
        Session.set('currentTargetContent', this.content);
    }
});

// reply stuff

Template.reply.helpers({
    replies: function () {
        return Tweets.find({"content.in_reply_to_status_id_str": this.content.id_str, pending: {$ne: true}}, {sort: {createdAt: 1}});
    }
});

Template.reply.events({
    "click button.modal": function (event, template) {
        var name = template.$(event.target).data('modal-template');
        Session.set('activeModal', name);
        Session.set('currentTargetContent', this.content);
    }
});

// postReplyModal stuff

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

// twitterMessages stuff

Template.twitterMessages.helpers({
    rawData: function () {
        var arr = new Array();
        Messages.find({owner: Meteor.userId()}).forEach(function (message) {
            arr.push(JSON.stringify(message, null, 2));
        });

        return arr;
    },
    pendingMessageCount: function () {
        return Messages.find({owner: Meteor.userId(), pending: {$ne: false}}).count();
    }
});

Template.twitterMessages.events({
    "click .pending": function () {
        Meteor.call("setPending", "Messages");
    }
});

// message stuff

Template.message.events({
    "click button.modal": function (event, template) {
        var name = template.$(event.target).data('modal-template');
        Session.set('activeModal', name);
        Session.set('currentTargetContent', this.content);
    }
});

// postReplyMessageModal stuff

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

// postTicketModal stuff

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
            console.log("summary is too short");
        }
    }
});

// viewLink stuff

Template.viewLink.helpers({
    currentlyOnTweets: function () {
        return Router.current().route.getName() === "tweets";
    }
});
