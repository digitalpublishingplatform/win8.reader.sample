(function() {
    "use strict";
    var resourceLoader = new Windows.ApplicationModel.Resources.ResourceLoader();

    var delayImageLoader = WinJS.Class.define(
        function(element, options) {

            this._element = element || document.createElement("div");
            this.element.winControl = this;

            var progress = document.createElement("progress");
            progress.className = "win-ring";
            WinJS.Utilities.addClass(this.element, "imageLoaderRoot");
            this.element.appendChild(progress);

            WinJS.Utilities.query("img", element).forEach(function(img) {
                WinJS.Utilities.addClass(img, "imageLoader");

                img.addEventListener("load", function() {
                    WinJS.Utilities.addClass(img, "loaded");
                    WinJS.Utilities.addClass(progress, "hidden");
                });

                img.addEventListener("error", function(err) {
                    WinJS.Utilities.addClass(progress, "hidden");
                });
            });
        },
        {
            element: {
                get: function() { return this._element; }
            },
        });

    var setVisibility = WinJS.Binding.converter(function(val) {
        return val ? "block" : "none";
    });

    /*** Utilities *****/
    WinJS.Namespace.define("DigitalPublishingPlatform.Tools", {
        DelayImageLoader: delayImageLoader,
        SetVisibility: setVisibility,
        GetString: function(name) {
            if (!name)
                return "";
            return resourceLoader.getString(name);
        },
        ApiUrl: "http://dpp.cloudapp.net/api/publication"
    });
    


})();