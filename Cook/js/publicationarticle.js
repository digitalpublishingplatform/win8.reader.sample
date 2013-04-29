(function () {
    "use strict";

    var publishingArticle = WinJS.Class.define(
        function (tag, article) {
        
            this.getVideos = function (videoList) {
                var videos = new Array();
                var video;
                for (var i = 0; i < videoList.length; i++) {
                    var encodedVideos = new Array();
                    var encodedVideo;
                    for (var j = 0; j < videoList[i].EncodedVideos.length; j++) {
                        encodedVideo = {
                            url: videoList[i].EncodedVideos[j].Url,
                            height: videoList[i].EncodedVideos[j].Height,
                            width: videoList[i].EncodedVideos[j].Width,
                            encodingPreset: videoList[i].EncodedVideos[j].EncodingPreset,
                            status: videoList[i].EncodedVideos[j].Status,
                            presetWidth: videoList[i].EncodedVideos[j].PresetWidth,
                            isFinished: videoList[i].EncodedVideos[j].IsFinished,
                            aspectRatio: videoList[i].EncodedVideos[j].AspectRatio
                        };
                        encodedVideos[j] = encodedVideo;
                    }
                    video = {
                        title: videoList[i].Title,
                        description: videoList[i].Description,
                        thumbnailUrl: videoList[i].ThumbnailUrl,
                        mainVideoUrl: videoList[i].MainVideoUrl,
                        encodedVideos: encodedVideos
                    };
                    videos[i] = video;
                }
                return videos;
            };

            this.getImages = function (imageList) {
                if (imageList) {
                    var images = new Array();
                    for (var i = 0; i < imageList.length; i++) {
                        images[i] ={ imageUrl: imageList[i] };
                    }
                    return images;
                }
                return new Array();
            };


            return {
                group: tag,
                key: article.Id,
                title: article.Title,
                text: toStaticHTML(article.Text),
                publishedUtc: article.PublishedUtc,
                videos: this.getVideos(article.Videos),
                mainImage: article.ImageUrl,
                images: this.getImages(article.Images)
            };
        });

    /*** Utilities *****/
    WinJS.Namespace.define("DigitalPublishingPlatform", {
        PublicationArticle: publishingArticle,
    });

})();