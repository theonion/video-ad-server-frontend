// (function ($) {
//   "use strict";
//   var S3Upload = function (element, options) {
//     this.options = options;
//     this.$button = $('<label class="btn btn-danger pull-right">Clear</label>');
//     this.$textInput = $('<input type="text" class="form-control" disabled>');
//     this.$element = $(element);
//   };

//   S3Upload.prototype = {
//     clear: function() {
//     }
//   };

//   $.fn.s3upload = function (option) {
//     options = $.extend({}, $.fn.s3upload.defaults, option, typeof option === 'object' && option);
//     var $this = $(this);
//     var data = $this.data('s3upload');
//     if (!data) {
//       $this.data('s3upload', (data = new S3Upload(this, options)));
//       data.constructor();
//     }

    

//     var get = '',
//         element = this.each(function () {
//             if ($(this).attr('type') === 'file') {
                
                    
                    

//                 if (!data) {
//                     $this.data('s3upload', (data = new S3Upload(this, options)));
//                     data.constructor();
//                 }
//             }
//         });

//         return element;
//   };

// })(window.jQuery);

function uploadClicks(e) {
    var self = this;
    
    e.preventDefault();
    
    var path = "";
    var url = e.target.dataset.url;
    var data = new FormData();

    var fileInput = django.jQuery(e.target).parent().siblings("input[type='file']");
    if(fileInput[0].files.length !== 0) {
        var file = fileInput[0].files[0];
        path = aws_attrs.directory + "/" + Date.now() + "_" + file.name;
        data.append('key', path);

        data.append('AWSAccessKeyId', aws_attrs.AWSAccessKeyId);
        data.append('acl', aws_attrs.acl);
        data.append('success_action_status', '201');
        data.append('policy', aws_attrs.policy);
        data.append('signature', aws_attrs.signature);
    
        data.append('file', file);
    } else {
        alert("You didn't select a file!");
        return;
    }
    
    var filename = "s3://" + aws_attrs.bucket + "/" + path;

    var root = django.jQuery(fileInput[0]).closest('div');
    var input = root.find(".initial input");
    var upload = root.find(".upload input");
    var error = "Could not upload the file at this time. Are you connected to the internet?";

    root.find(".initial").hide();
    root.find(".upload").hide();
    var progress = ProgressBar( root, true );
    
    // TODO: Maybe use jQuery to upload?
    var xhr = new XMLHttpRequest();
    
    xhr.onreadystatechange = function(e){
        if( xhr.readyState !== 4 ){ return; }
        window.onbeforeunload = null;
        progress.remove();
        showInitial( root );
        input.val( filename );
        upload.val('');
    };
    
    xhr.upload.addEventListener('progress', function( e ){
        window.onbeforeunload = "Are you sure you want to leave? The video will not be saved.";
        var percent = (e.loaded / e.total ) * 100;
        progress.update( percent );
    }, false);
    
    xhr.upload.addEventListener('error', function( e ){
        window.onbeforeunload = null;
        showInitial( root );
        input.val('');
        upload.val('');
        alert( error );
    }, false);
    
    xhr.upload.addEventListener('abort', function( e ){
        window.onbeforeunload = null;
        showInitial( root );
        input.val('');
        upload.val('');
        alert( error );
    }, false);
    
    xhr.open("POST", url);
    xhr.send(data);
}

// CRSF stuff
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
function sameOrigin(url) {
    // test that a given url is a same-origin URL
    // url could be relative or scheme relative or absolute
    var host = document.location.host; // host + port
    var protocol = document.location.protocol;
    var sr_origin = '//' + host;
    var origin = protocol + sr_origin;
    // Allow absolute or scheme relative URLs to same origin
    return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
        (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
        // or any other URL that isn't scheme relative or absolute i.e relative.
        !(/^(\/\/|http:|https:).*/.test(url));
}


// This function actually performas the upload
function upload(file, id, input_el) {

  var url = "https://" + aws_attrs.bucket + ".s3.amazonaws.com";

  var data = new FormData();
  var path = aws_attrs.directory + "/" + id + "/original";
  var filename = "s3://" + aws_attrs.bucket + "/" + path;


  data.append('key', path);

  data.append('AWSAccessKeyId', aws_attrs.AWSAccessKeyId);
  data.append('acl', aws_attrs.acl);
  data.append('success_action_status', aws_attrs.success_action_status);
  data.append('policy', aws_attrs.policy);
  data.append('signature', aws_attrs.signature);
  // data.append('Content-Type', file.type);

  data.append('file', file);

  var xhr = new XMLHttpRequest();
  
  window.onbeforeunload = "Are you sure you want to leave? The video will not be saved.";

  xhr.onreadystatechange = function(e){
      if( xhr.readyState !== 4 ){ return; }
      window.onbeforeunload = null;
      input_el.val(filename);
  };
  
  xhr.upload.addEventListener('progress', function( e ){
      var percent = (e.loaded / e.total ) * 100;
      console.log( "Progress: " + percent );
  }, false);
  
  xhr.upload.addEventListener('error', function( e ){
      window.onbeforeunload = null;
      input_el.val('');
      alert( error );
  }, false);
  
  xhr.upload.addEventListener('abort', function( e ){
      window.onbeforeunload = null;
      input_el.val('');
      alert( error );
  }, false);
  
  xhr.open("POST", url);
  xhr.send(data);
}

function uploadProgress(e) {
  var percent = (e.loaded / e.total ) * 100;
  console.log( "Progress: " + percent );
}

function upload(fileInput) {
  var self = this;

  if(fileInput.files.length !== 0) {
    var file = fileInput.files[0];

    // We have a file upload limit of 300MB
    if (file.size > (300 * 1024 * 1024)) {
      alert("File is too large!");
      return;
  }

  var url = "https://" + aws_attrs.bucket + ".s3.amazonaws.com";

  var id = $(fileInput).attr('data-video-id');

  var formData = new FormData();
  var path = aws_attrs.directory + "/" + id + "/original";
  var filename = "s3://" + aws_attrs.bucket + "/" + path;

  formData.append('key', path);
  formData.append('AWSAccessKeyId', aws_attrs.AWSAccessKeyId);
  formData.append('acl', aws_attrs.acl);
  formData.append('success_action_status', aws_attrs.success_action_status);
  formData.append('policy', aws_attrs.policy);
  formData.append('signature', aws_attrs.signature);
  formData.append('file', file);

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
            console.log( "Progress: " + percent );
          }, false);
      }
      return req;
    },
    success: function(data) {
      console.log("Yay!");
    }
  });

  } else {
    alert("No file!");
  }
}

function buttonClicked(e) {
  if($(e.target).hasClass('btn-danger')) {
    $(e.target).siblings('input[type="text"]').val('');
    $(e.target).removeClass('btn-danger');
    $(e.target).addClass('btn-default');
    $(e.target).html("Choose File");
  } else {
    $(e.target).siblings('input[type="file"]').click();
  }
}

$.fn.s3upload = function() {
  if(this.prop("tagName") != "INPUT" || this.attr("type") != "file") {
    console.log("You must attach this to an input tag!");
    return false;
  }
  this.on('change', function(e) {
    if($(e.target).attr('data-video-id') === undefined) {
      var csrftoken = getCookie('csrftoken');
      $.ajax({
        type: "POST",
        url: "/videos/new",
        data: {'filename': file.name},
        success: function(data, textStatus, jqXHR){
          upload(e.target);
        },
        dataType: "json"
      });
    } else {
      upload(e.target);
    }
  });

  if(this.attr('data-video-name') !== undefined) {
    var initial_file = this.attr('data-video-name');
    var initial_id = this.attr('data-video-id');

    var button_el = $('<label class="btn btn-danger pull-right">Clear</label>');
    button_el.css('border-top-left-radius', '0');
    button_el.css('border-bottom-left-radius', '0');
    button_el.css('margin-top', '-38px');
    button_el.on('click', buttonClicked);

    var replacement_input = $('<input type="text" class="form-control" value="' + initial_file + '" disabled>');

    $(this).after(button_el);
    $(this).after(replacement_input);
    $(this).css('position', 'absolute');
    $(this).css('left', '-6000px');
  }

  var csrftoken = getCookie('csrftoken');

  $.ajaxSetup({
      beforeSend: function(xhr, settings) {
          if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
              // Send the token to same-origin, relative URLs only.
              // Send the token only if the method warrants CSRF protection
              // Using the CSRFToken value acquired earlier
              xhr.setRequestHeader("X-CSRFToken", csrftoken);
          }
      }
  });
};