Meteor.subscribe('tickets');

Meteor.startup(function () {
    var card = new SW.Card();
    var helpdesk = card.services('helpdesk');
});
