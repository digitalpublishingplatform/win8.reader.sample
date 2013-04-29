(function () {
    "use strict";

    var appView = Windows.UI.ViewManagement.ApplicationView;
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var nav = WinJS.Navigation;
    var ui = WinJS.UI;


    ui.Pages.define("/pages/front/front.html", {

        _issue: null,
        _articles: null,
        _groupedItems: null,
 
        // Navigates to the groupHeaderPage. Called from the groupHeaders,
        // keyboard shortcut and iteminvoked.
        navigateToGroup: function (tagName) {
            nav.navigate("/pages/articles/articles.html", { issue: this._issue, tagName: tagName });
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            WinJS.Utilities.removeClass(document.getElementById("waitZone"), "hidden");

            this._issue = Data.resolveItemReference3(options.issueId);

            element.querySelector("header[role=banner] .pagetitle").textContent = this._issue.title;

            this._articles = new WinJS.Binding.List();

            var that = this;

            WinJS.xhr({ type: "post", url: DigitalPublishingPlatform.Tools.ApiUrl + "/IssueFront/" + this._issue.key })
                .then(function (r) {
                    var counter = 1;
                    var issueFront = JSON.parse(r.responseText); 
                    var tag;
                    
                    if (issueFront.MainArticle) {
                        tag = { key: "Main Article", name: "Main Article", orderby : counter++ };
                        that._articles.push(DigitalPublishingPlatform.PublicationArticle(tag, issueFront.MainArticle));
                    }

                    issueFront.CategoriesAndArticles.forEach(function (item) {
                        tag = { key: item.Category, name: item.Category, orderby: counter++ };
                        item.Articles.forEach(function (a) {
                            that._articles.push(new DigitalPublishingPlatform.PublicationArticle(tag, a));
                        });
                    });
                    
                    that._groupedItems = that._articles.createGrouped(
                        function groupKeySelector(item) { return item.group.orderby; },
                        function groupDataSelector(item) { return item.group; }
                    );

                    if (element.querySelector(".groupeditemslist")) {
                        var listView = element.querySelector(".groupeditemslist").winControl;
                        listView.groupHeaderTemplate = element.querySelector(".headertemplate");
                        listView.itemTemplate = element.querySelector(".itemtemplate");
                        listView.oniteminvoked = that._itemInvoked.bind(that);


                        // Set up a keyboard shortcut (ctrl + alt + g) to navigate to the
                        // current group when not in snapped mode.
                        listView.addEventListener("keydown", function(e) {
                            if (appView.value !== appViewState.snapped && e.ctrlKey && e.keyCode === WinJS.Utilities.Key.g && e.altKey) {
                                var data = listView.itemDataSource.list.getAt(listView.currentItem.index);
                                that.navigateToGroup(data.group.key);
                                e.preventDefault();
                                e.stopImmediatePropagation();
                            }
                        }.bind(that), true);

                        that._initializeLayout(listView, appView.value);
                        listView.element.focus();

                    }
                    WinJS.Utilities.addClass(document.getElementById("waitZone"), "hidden");

                },
                function (error) {
                    WinJS.Utilities.addClass(document.getElementById("waitZone"), "hidden");
                    Util.showSync("Failed to retrieve data...", "Orchard Publishing Reader");
                });

        },
        
        // This function updates the page layout in response to viewState changes.
        updateLayout: function (element, viewState, lastViewState) {
            /// <param name="element" domElement="true" />

            var listView = element.querySelector(".groupeditemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    }
                    listView.addEventListener("contentanimating", handler, false);
                    this._initializeLayout(listView, viewState);
                }
            }
        },

        // This function updates the ListView with new layouts
        _initializeLayout: function (listView, viewState) {
            /// <param name="listView" value="WinJS.UI.ListView.prototype" />

            if (viewState === appViewState.snapped) {
                listView.itemDataSource = this._groupedItems.groups.dataSource;
                listView.groupDataSource = null;
                listView.layout = new ui.ListLayout();
            } else {
                listView.itemDataSource = this._groupedItems.dataSource;
                listView.groupDataSource = this._groupedItems.groups.dataSource;
                listView.layout = new ui.GridLayout({ groupHeaderPosition: "top" });
            }
        },

        _itemInvoked: function (args) {
            if (appView.value === appViewState.snapped) {
                // If the page is snapped, the user invoked a group.
                var group = this._groupedItems.groups.getAt(args.detail.itemIndex);
                this.navigateToGroup(group.key);
            } else {
                // If the page is not snapped, the user invoked an item.
                var article = this._groupedItems.getAt(args.detail.itemIndex);
                nav.navigate("/pages/articles/article.html", { article: article });
            }
        }
    });
})();
