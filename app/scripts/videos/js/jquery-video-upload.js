/*!
 * S3 Upload
 * Original author: @chrissinchok
 * Licensed under the MIT license
 */

// the semi-colon before the function invocation is a safety
// net against concatenated scripts and/or other plugins
// that are not closed properly.
;(function ( $, window, document, undefined ) {

    // undefined is used here as the undefined global
    // variable in ECMAScript 3 and is mutable (i.e. it can
    // be changed by someone else). undefined isn't really
    // being passed in so we can ensure that its value is
    // truly undefined. In ES5, undefined can no longer be
    // modified.

    // window and document are passed through as local
    // variables rather than as globals, because this (slightly)
    // quickens the resolution process and can be more
    // efficiently minified (especially when both are
    // regularly referenced in your plugin).

    // Create the defaults once
    var pluginName = "s3upload",
        defaults = {
            bootstrap: true,  // This is all I will be building, at least initially.
            videoAttrs: {},
            callback: function(){}
        };

    // The actual plugin constructor
    function S3Upload( element, options ) {
        this.element = element;

        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    S3Upload.prototype = {

        lastProgress: 0,

        setProgress: function(progress) {
            if (progress === 0 || progress === 100) {
                this.progressEl.hide();
                return;
            }
            if(this.lastProgress === 0 || Math.abs(progress - this.lastProgress) > 2) {
                this.progressEl.find('.progress-bar').css('width', Math.floor(progress) + '%');
                this.lastProgress = progress;
                this.progressEl.show();
            }
        },

        setProgressText: function(text) {
            this.progressEl.find('.progress-bar span').html(text);
        },

        abortUpload: function(e) {
            this.setProgress(0);
            this.button.off('click', this.abortUpload);
            this.req.abort();
            this.button.removeClass('btn-danger');
            this.button.addClass('btn-default');
            this.button.html("Choose File");
            this.button.on('click', $.proxy(this.chooseFile, this));
            this.setProgress(0);
        },

        abortEncode: function(e) {
            var self = this;

            this.button.off('click');

            jobId = $(this.element).attr('data-job-id');
            $.ajax("https://app.zencoder.com/api/v2/jobs/" + jobId + "/cancel.json?api_key=" + videoAttrs.zencoderApiKey, {
                type: "PUT",
                success: function(data) {
                    self.button.removeClass('btn-danger');
                    self.button.addClass('btn-default');
                    self.button.html("Choose File");
                    $(self.element).attr('data-status', "Failed");

                    self.fakeInput.val("Encoding failed! Please try again.");

                    self.button.on('click', $.proxy(self.chooseFile, self));
                }
            });
        },

        upload: function() {

            // TODO: Add cancel button.
            var self = this;

            this.button.off('click', this.chooseFile);
            this.button.addClass('btn-danger');
            this.button.removeClass('btn-default');
            this.button.html("Abort");
            this.button.on('click', $.proxy(this.abortUpload, this));

            var file = this.element.files[0];
            var url = "https://" + this.options.videoAttrs.bucket + ".s3.amazonaws.com";

            var formData = new FormData();
            var path = videoAttrs.directory + "/" + this.videoId + "/original";
            var filename = "s3://" + this.options.videoAttrs.bucket + "/" + path;

            formData.append('key', path);
            formData.append('AWSAccessKeyId', this.options.videoAttrs.AWSAccessKeyId);
            formData.append('acl', this.options.videoAttrs.acl);
            formData.append('success_action_status', this.options.videoAttrs.success_action_status);
            formData.append('policy', this.options.videoAttrs.policy);
            formData.append('signature', this.options.videoAttrs.signature);
            formData.append('file', file);

            self.setProgress(0);
            self.setProgressText("Uploading...");
            this.progressEl.find('.progress-bar').removeClass('progress-bar-success');
            // Todo: handle failure
            jQuery.ajax(url, {
                processData: false,
                contentType: false,
                data: formData,
                type: "POST",
                xhr: function() {
                    var req = $.ajaxSettings.xhr();
                    if (req) {
                        req.upload.addEventListener('progress', function(e) {
                            var percent = (e.loaded / e.total ) * 100;
                            self.setProgress(percent);
                        }, false);
                    }
                    self.req = req;
                    return req;
                },
                success: function(data) {
                    self.setProgress(100);
                    self.fakeInput.val(file.name);
                    $.post('/videos/' + self.videoId, {
                        'filename': file.name
                    });
                    self.encode();
                }
            });
        },

        updateEncodeProgress: function() {
            var self = this;
            this.progressEl.find('.progress-bar').addClass('progress-bar-success');

            jobId = $(this.element).attr('data-job-id');
            $.ajax("https://app.zencoder.com/api/v2/jobs/" + jobId + "/progress.json", {
                type: "GET",
                data: {
                    api_key: videoAttrs.zencoderApiKey
                },
                success: function(data) {
                    if(data.state === "waiting" || data.state === "pending" || data.state === "processing") {
                        if(data.progress > 5) {
                            self.setProgress(data.progress);
                            setTimeout($.proxy(self.updateEncodeProgress, self), 500);
                        } else {
                            setTimeout($.proxy(self.updateEncodeProgress, self), 2000);
                        }
                    } else {
                        self.setProgress(0);
                        if(data.state == "finished") {
                            $(self.element).attr('data-status', "Completed");
                            self.button.off('click');
                            self.button.html('Clear');
                            self.button.on('click', $.proxy(self.clearFile, self));
                        }
                        if(data.state == "failed" || data.state == "cancelled") {
                            $(self.element).attr('data-status', "Failed");
                            self.fakeInput.val("Encoding failed! Please try again.");
                            self.button.off('click');
                            self.button.html('Choose File');
                            self.button.on('click', $.proxy(self.chooseFile, self));
                        }
                    }
                }
            });
        },

        encode: function() {
            var self = this;

            this.button.off('click');
            this.button.on('click', $.proxy(this.abortEncode, this));

            this.progressEl.find('.progress-bar').addClass('progress-bar-success');
            this.setProgressText("Encoding...");
            this.setProgress(5);
            // Kick off the zencoder job
            $.ajax('/videos/' + self.videoId + "/encode", {
                type: "POST",
                data: {
                    'name': $(self.element).attr('data-video-name'),
                },
                success: function(data) {
                    $(self.element).attr('data-job-id', data.id);
                    self.updateEncodeProgress();
                }
            });
        },

        chooseFile: function(e) {
            console.log("chooseFile")
            this.button.off('click', this.chooseFile);
            this.element.click();
        },

        clearFile: function(e) {
            this.button.off('click', this.clearFile);
            this.button.removeClass('btn-danger');
            this.button.addClass('btn-default');
            this.button.html("Choose File");
            this.fakeInput.val('');
            this.button.on('click', $.proxy(this.chooseFile, this));
        },

        init: function() {
            var el = $(this.element);
            var self = this;

            if(this.element.tagName != "INPUT" || this.element.type != "file") {
                console.log("You must attach this to a file input tag!");
                return false;
            }

            el.on('change', function(e) {
                var file;
                if(e.target.files.length !== 0) {
                    file = e.target.files[0];

                    // We have a file upload limit of 300MB
                    if (file.size > (1024 * 1024 * 1024)) {
                        alert("Upload file cannot be larger than 300MB.");
                        self.button.on('click', $.proxy(self.chooseFile, self));
                        return;
                    }

                    if (file.type.indexOf('video/') !== 0) {
                        alert("You must upload a video file.");
                        self.button.on('click', $.proxy(self.chooseFile, self));
                        return;
                    }

                } else {
                    return;
                }

                if($(e.target).attr('data-video-id') === undefined) {
                    $.ajax({
                        type: "POST",
                        url: "/videos/new",
                        data: {'filename': file.name},
                        success: function(data, textStatus, jqXHR){
                            $(e.target).attr('data-video-id', data.id);
                            self.videoId = data.id;
                            self.options.callback(data.id);
                            self.upload();
                        },
                        dataType: "json"
                    });
                } else {
                    self.upload();
                }
            });

            var initial_file = el.attr('data-video-name') || "";
            this.videoId = el.attr('data-video-id');
            this.jobId = el.attr('data-job-id');
            this.status = el.attr('data-status');

            this.progressEl = $('<div class="progress progress-striped active s3uploadProgress"><div class="progress-bar" style="width: 0%"><span class="pull-left">Uploading...</span></div></div>');
            this.progressEl.hide();

            this.button = $('<label class="btn btn-default pull-right s3uploadButton">Choose File</label>');

            if(initial_file !== "") {
                if(this.status === "In Progress") {
                    this.button.removeClass('btn-default');
                    this.button.addClass('btn-danger');
                    this.button.html("Abort");
                    this.button.on('click', $.proxy(this.abortEncode, this));

                    this.setProgress(5);
                    this.setProgressText("Encoding...");
                    this.updateEncodeProgress();
                }
                if(this.status === "Complete") {
                    this.button.removeClass('btn-default');
                    this.button.addClass('btn-danger');
                    this.button.html("Clear");
                    this.button.on('click', $.proxy(this.clearFile, this));
                }

            } else {
                this.button.on('click', $.proxy(this.chooseFile, this));
            }

            this.fakeInput = $('<input type="text" class="form-control" value="' + initial_file + '" disabled>');

            el.after(this.progressEl);
            el.after(this.button);
            el.after(this.fakeInput);
            el.css('position', 'absolute');
            el.css('left', '-6000px');
        },
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new S3Upload( this, options ));
            }
        });
    };

})( jQuery, window, document );