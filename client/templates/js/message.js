Template.message.events({
    "click button.openModal": function (event, template) {
        var name = template.$(event.target).data('modal-template');
        Session.set('activeModal', name);
        Session.set('currentTargetContent', this.content);
    }
});
