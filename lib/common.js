TweetsResults = new Meteor.Pagination(Tweets, {
    filters: {
        pending: {
            $ne: true
        },
        "content.in_reply_to_status_id_str": null
    },
    sort: {
        createdAt: -1
    },
    perPage: 10,
    itemTemplate: "tweet",
    templateName: "twitterTimeline",
    availableSettings: {
        filters: true,
        sort: true,
        perPage: true
    },
    auth: function (skip, sub) {
        if (!sub.userId) { return false; }
        var userSettings = TweetsResults.userSettings[sub._session.id] || {},
            uFilters = userSettings.filters || this.filters,
            uFields = userSettings.fields || this.fields,
            uSort = userSettings.sort || this.sort,
            uPerPage = userSettings.perPage || this.perPage,
            _filters = _.extend({}, uFilters, {owner: sub.userId}),
            _options = { fields: uFields, sort: uSort, limit: uPerPage, skip: skip };
        return [ _filters, _options ];
    }
});

MessagesResults = new Meteor.Pagination(Messages, {
    filters: {
        pending: {
            $ne: true
        }
    },
    sort: {
        createdAt: -1
    },
    perPage: 10,
    itemTemplate: "message",
    templateName: "twitterMessages",
    availableSettings: {
        sort: true
    },
    auth: function (skip, sub) {
        if (!sub.userId) { return false; }
        var userSettings = MessagesResults.userSettings[sub._session.id] || {},
            uFilters = userSettings.filters || this.filters,
            uFields = userSettings.fields || this.fields,
            uSort = userSettings.sort || this.sort,
            uPerPage = userSettings.perPage || this.perPage,
            _filters = _.extend({}, uFilters, {owner: sub.userId}),
            _options = { fields: uFields, sort: uSort, limit: uPerPage, skip: skip };
        return [ _filters, _options ];
    }
});
