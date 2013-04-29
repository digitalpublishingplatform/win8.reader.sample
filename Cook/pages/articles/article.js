(function () {
    "use strict";

    var article;
    var binding = WinJS.Binding;
    
    WinJS.UI.Pages.define("/pages/articles/article.html", {

        // This function provides the Elements to be animated by PageControlNavigator on Navigation.
        getAnimationElements: function () {
            return [[this.element.querySelector("article")]];
        },

        // This function is called whenever a user navigates to this page. It
        // populates the page elements with the app's data.
        ready: function (element, options) {

            article = options.article;
            
            element.querySelector(".titlearea .pagetitle").textContent = article.group.name;
            element.querySelector("article .item-title").textContent = article.title;
            var d = new Date(article.publishedUtc);
            element.querySelector("article .item-subtitle").textContent = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();;
            element.querySelector("article .item-content").innerHTML = article.text;

            if (article.mainImage) {
                element.querySelector("article #mainImage").src = article.mainImage;
            } else {
                element.querySelector("article #mainImage").style.display = "none";
            }

            var flipView = element.querySelector("#videosFlipView").winControl;
            flipView.itemTemplate = element.querySelector("#videosFlipViewTemplate");
            var dataList = new WinJS.Binding.List(article.videos);
            if (dataList.length > 0) {
                flipView.itemDataSource = dataList.dataSource;
            } else {
                element.querySelector("#videosFlipView").style.display = "none";
            }

            var flipView2 = element.querySelector("#imagesFlipView").winControl;
            flipView2.itemTemplate = element.querySelector("#imagesFlipViewItemTemplate");
            var dataList2 = new WinJS.Binding.List(article.images);
            if (dataList2.length > 0) {
                flipView2.itemDataSource = dataList2.dataSource;
            } else {
                element.querySelector("#imagesFlipView").style.display = "none";
            }
            
            element.querySelector(".content").focus();
        },


    });
})();
