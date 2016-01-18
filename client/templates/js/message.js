Template.message.onRendered(function () {
    var mySVGsToInject = document.querySelectorAll('.svg');
    var injectorOptions = {
        evalScripts: false
    }
    SVGInjector(mySVGsToInject, injectorOptions, function () {
        this.$('.tooltipped').tooltip();
    });
});

Template.message.helpers({
    biggerProfileImageUrl: function () {
        return this.content.sender.profile_image_url.replace(/normal/i, "bigger");
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
    messageText: function () {
        var media = this.content.entities.media;
        var urls = this.content.entities.urls;
        var allLinkableEntities = media ? urls.concat(media) : urls;
        var endResult = TwitterText.autoLink(this.content.text, {
            urlEntities: allLinkableEntities
        });

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

Template.message.events({
    "click a.openModal": function (event, template) {
        if (!event.target.closest('a.disabled')) {
            var name = template.$(event.target).closest('a.openModal').data('modal-template');
            Session.set('currentTargetContent', this.content);
            Modal.show(name);
        }
    }
});
