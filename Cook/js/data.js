(function () {
    "use strict";

    var publicationsIssues = new WinJS.Binding.List();
    var groupedItems = publicationsIssues.createGrouped(
        function groupKeySelector(item) { return item.group.key; },
        function groupDataSelector(item) { return item.group; }
    );

    function getPublications(onload, onerror) {
        
        //TODO Please correct url here and load from local store if offline
        //Get data from web api service

        WinJS.xhr({ type: "post", url: DigitalPublishingPlatform.Tools.ApiUrl + "/AllWithIssues" }).then(function (r) {
            var publications = JSON.parse(r.responseText);
            var publication;
            
            //delete current, obsolete data
            while (publicationsIssues.length > 0) publicationsIssues.pop();

            publications.forEach(function (p) {

                publication = { key: p.Id, title: p.Title, text: toStaticHTML(p.Text != null ? p.Text : ""), createdUtc: p.CreatedUtc, modifiedUtc: p.ModifiedUtc, mainImage: p.ImageUrl };

                p.Issues.forEach(function(i) {
                    publicationsIssues.push({
                        group: publication,
                        key: i.Id,
                        title: i.Title,
                        text: i.Text,
                        crtDate: i.CreatedUtc,
                        modifiedUtc: i.ModifiedUtc,
                        mainImage: i.ImageUrl
                    });
                });
            });

            if (onload)
                onload();
        },
        function (err) {
            if (onerror)
                onerror();
            }
        );
    }
    
    WinJS.Namespace.define("Data", {
        items: groupedItems,
        groups: groupedItems.groups,
        getItemReference: getItemReference,
        getItemsFromGroup: getItemsFromGroup,
        resolveGroupReference: resolveGroupReference,
        resolveItemReference: resolveItemReference,
        resolveItemReference2: resolveItemReference2,
        resolveItemReference3: resolveItemReference3,
        getPublications: getPublications
    });

    // Get a reference for an item, using the group key and item key as a unique reference to the item that can be easily serialized.
    function getItemReference(item) {
        return [item.group.key, item.key];
    }

    // This function returns a WinJS.Binding.List containing only the items that belong to the provided group.
    function getItemsFromGroup(group) {
        return publicationsIssues.createFiltered(
            function (item) {
                return item.group.key === group.key;
            }
        );
    }

    // Get the unique group corresponding to the provided group key.
    function resolveGroupReference(key) {
        for (var i = 0; i < groupedItems.groups.length; i++) {
            if (groupedItems.groups.getAt(i).key === key) {
                return groupedItems.groups.getAt(i);
            }
        }
    }

    // Get a unique item from the provided string array, which should contain a group key and an item key.
    function resolveItemReference(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.key === reference[1] && item.group.modifiedUtc === reference[2] && item.modifiedUtc === reference[3]) {
                return item;
            } 
        }
    }
    
    function resolveItemReference2(reference) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.group.key === reference[0] && item.key === reference[1]) {
                return item;
            }
        }
    }
    
    function resolveItemReference3(key) {
        for (var i = 0; i < groupedItems.length; i++) {
            var item = groupedItems.getAt(i);
            if (item.key === key) {
                return item;
            }
        }
    }
    
})();
