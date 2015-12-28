Template.tweet.events({
    "click button.modal": function (event, template) {
        var name = template.$(event.target).data('modal-template');
        Session.set('activeModal', name);
        Session.set('currentTargetContent', this.content);
    }
});
