(function () {
    "use strict";
    
    var appViewState = Windows.UI.ViewManagement.ApplicationViewState;
    var ui = WinJS.UI;

    ui.Pages.define("/pages/articles/articles.html", {

        _issue: null,
        _articles: null,
        _groupedArticles: null,
        _groupedVideos: null,

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {
            
            WinJS.Utilities.removeClass(document.getElementById("waitZone"), "hidden");
            
            this._issue = options.issue;
            this._articles = new WinJS.Binding.List();
            var group = { key: options.tagName, name: options.tagName };
            var that = this;

            WinJS.xhr({ type: "post", url: DigitalPublishingPlatform.Tools.ApiUrl + "/ArticlesByCategoryNameAndIssueId/" + this._issue.key + "?categoryName=" + options.tagName })
                .then(function (r) {
                    var l = JSON.parse(r.responseText);
                    l.forEach(function (a) {
                        that._articles.push(new DigitalPublishingPlatform.PublicationArticle(group, a));
                    });
                   
                    element.querySelector("header[role=banner] .pagetitle").textContent = options.tagName;

                    var listView = element.querySelector(".itemslist").winControl;
                    listView.itemDataSource = that._articles.dataSource;
                    listView.itemTemplate = element.querySelector(".itemtemplate");
                    listView.oniteminvoked = that._itemInvoked.bind(that);

                    that._initializeLayout(listView, Windows.UI.ViewManagement.ApplicationView.value);
                    listView.element.focus();

                    WinJS.Utilities.addClass(document.getElementById("waitZone"), "hidden");
                },
                function (error) {
                    WinJS.Utilities.addClass(document.getElementById("waitZone"), "hidden");
                    Util.showSync("Failed to retrieve data...", "Reader Publishing Orchard");
                });

           
        },
        
        unload: function () {
            // TODO: Respond to navigations away from this page.
        },

        updateLayout: function (element, viewState, lastViewState) {
            var listView = element.querySelector(".itemslist").winControl;
            if (lastViewState !== viewState) {
                if (lastViewState === appViewState.snapped || viewState === appViewState.snapped) {
                    var handler = function (e) {
                        listView.removeEventListener("contentanimating", handler, false);
                        e.preventDefault();
                    };
                    listView.addEventListener("contentanimating", handler, false);
                    var firstVisible = listView.indexOfFirstVisible;
                    this._initializeLayout(listView, viewState);
                    if (firstVisible >= 0 && listView.itemDataSource.list.length > 0) {
                        listView.indexOfFirstVisible = firstVisible;
                    }
                }
            }
        },
        
        _initializeLayout: function (listView, viewState) {
            if (viewState === appViewState.snapped) {
                listView.layout = new ui.ListLayout();
            } else {
                listView.layout = new ui.GridLayout();
            }
        },

        _itemInvoked: function (args) {
            var article = this._articles.getAt(args.detail.itemIndex);
            WinJS.Navigation.navigate("/pages/articles/article.html", { article: article });
        }
    });
})();
