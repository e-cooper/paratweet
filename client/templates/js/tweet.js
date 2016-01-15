Template.tweet.onRendered(function () {
    var mySVGsToInject = document.querySelectorAll('.svg');
    var injectorOptions = {
        evalScripts: false
    }
    SVGInjector(mySVGsToInject, injectorOptions, function () {
        this.$('.tooltipped').tooltip();
    });

    debugger;
});

Template.tweet.helpers({
    biggerProfileImageUrl: function () {
        return this.content.user.profile_image_url.replace(/normal/i, "bigger");
    },
    disabledTicketButton: function () {
        if (Tickets.find({"parent.id_str": this.content.id_str}).count() > 0) {
            return "disabled";
        }
    },
    existingTicket: function () {
        return Tickets.findOne({"parent.id_str": this.content.id_str});
    },
    existingComment: function () {
        return TicketComments.find({"parent.id_str": this.content.id_str});
    },
    tweetText: function () {
        var plainText = this.content.text;
        var endResult = plainText;
        var urls = this.content.entities.urls;
        var media = this.content.entities.media;

        if (urls && urls.length) {
            urls.forEach(function (element, index, array) {
                endResult = endResult.slice(0, element.indices[0])
                            + '<a href="'
                            + element.url
                            + '" title="'
                            + element.expanded_url
                            + '">'
                            + element.display_url
                            + '</a>'
                            + endResult.slice(element.indices[1]);
            });
        }

        if (media && media.length) {
            media.forEach(function (element, index, array) {
                endResult = endResult
                            + '<br/>'
                            + '<img class="pt-media" src="'
                            + element.media_url
                            + '">';
            });
        }

        return endResult;
    }
});

Template.tweet.events({
    "click a.openModal": function (event, template) {
        if (!event.target.closest('a.disabled')) {
            var name = template.$(event.target).closest('a.openModal').data('modal-template');
            Session.set('currentTargetContent', this.content);
            Modal.show(name);
        }
    }
});
