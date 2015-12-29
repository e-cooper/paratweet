Meteor.subscribe('tickets');
Meteor.subscribe('ticket_comments');

Meteor.startup(function () {
    var users, proUsersPromise;
    card = new SW.Card();
    helpdesk = card.services('helpdesk');

    users = [];
    proUsersPromise = card.services('environment').request('users', {
        per_page: 100
    });
    proUsersPromiseLoop(proUsersPromise, users, function (data) {
        users = users.concat(data.users);
        return {
            users: users,
            done: data.meta.current_page >= data.meta.page_count,
            value: ++data.meta.current_page
        };
    });

    openTickets = [];
    openTicketsPromise = card.services('helpdesk').request('tickets', {
        per_page: 100,
        status: 'open'
    });
    ticketsPromiseLoop(openTicketsPromise, openTickets, function (data) {
        openTickets = openTickets.concat(data.tickets);
        return {
            openTickets: openTickets,
            done: data.meta.current_page >= data.meta.page_count,
            value: ++data.meta.current_page
        };
    });
});

// Need to get all of the IT Pros so this is one way to make sure we go through
// all pages and put them in an array
function proUsersPromiseLoop (promise, users, fn) {
    return promise.then(fn).then(function (wrapper) {
        if (wrapper.done) {
            Session.set('proUsers', wrapper.users);
            return wrapper.value;
        } else {
            return promiseLoop(card.services('environment').request('users', {
                page: wrapper.value,
                per_page: 100
            }), wrapper.users, fn);
        }
    });
}

function ticketsPromiseLoop (promise, openTickets, fn) {
    return promise.then(fn).then(function (wrapper) {
        if (wrapper.done) {
            Session.set('openTickets', wrapper.openTickets);
            return wrapper.value;
        } else {
            return promiseLoop(card.services('helpdesk').request('tickets', {
                page: wrapper.value,
                per_page: 100,
                status: 'open'
            }), wrapper.openTickets, fn);
        }
    });
}
