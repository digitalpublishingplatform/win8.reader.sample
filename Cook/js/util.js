(function () {
    'use strict';
    var alert = new Windows.UI.Popups.MessageDialog('');
    var currentAlert = null;
    var que = [];

    var showNext = function() {
        if (currentAlert !== null) return;
        if (que.length > 0) {
            currentAlert = que.shift();
            alert.content = currentAlert.msg;
            alert.title = currentAlert.title;
            alert.showAsync().done(
                function() {
                    currentAlert = null;
                    showNext();
                },
                function() {
                    currentAlert = null;
                    showNext();
                },
                function() {
                    currentAlert = null;
                    showNext();
                }
            );
        }
    };

    var showSync = function(msg, title) {
        que.push({ msg: msg || '', title: title || '' });
        showNext();
    };
    
    var shortDate = WinJS.Binding.converter(function (date) {
        var d = new Date(date);
        return d.getMonth() + 1 +
            "/" + d.getDate() +
            "/" + d.getFullYear();
    });

    var members = {
        showSync: showSync,
        shortDate: shortDate
    };
    WinJS.Namespace.define('Util', members);

})();