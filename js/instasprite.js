

this.Instasprite = (function (window, document) {

  function Instasprite(el, imagesEl) {
    this.el = el;
    this.imagesEl = imagesEl;
  }

  Instasprite.prototype = {
    clear: function () {
      this.urls = [];
      this.emptyElement();
    },
    emptyElement: function () {
      this.el.innerHTML = '';
    },
    addFiles: function (files) {
      var that = this;
      this.readFiles(files, this.transform.bind(this));
    },
    readFiles: function (files, callback) {
      var reader,
        result = [],
        remaining = files.length,
        loaded = function (e) {
          if (e.type !== 'error') result.push(e.target.result);
          remaining -= 1;
          if (remaining === 0) {
            callback(result);
          }
        };
      for (var i = 0; i < files.length; i++) {
        reader = new FileReader;
        reader.onloadend = loaded;
        reader.readAsDataURL(files[i]);
      }
    },
    transform: function (urls) {
      var that = this;
      this.loadImages(urls, function (images) {
        var coordinates = that.pack(images);
        that.draw(images, coordinates);
      });
    },
    loadImages: function (urls, callback) {
      var result = [],
        remaining = urls.length,
        img,
        loaded = function (e) {
          console.log(this);
          if (e.type !== 'error') result.push(this);
          remaining -= 1;
          console.log(remaining);
          if (remaining === 0) {
            callback(result);
          }
        };
      for (var i = 0; i < urls.length; i++) {
        img = document.createElement('img');
        img.onload = loaded;
        img.src = urls[i];
        this.imagesEl.appendChild(img);
      }
    },
    pack: function (images) {
      var y = 0;
      return images.map(function (image) {
        var point = { x: 0, y: y };
        y += image.height;
        return point;
      });
    },
    draw: function (images, coordinates) {
      var canvas = document.createElement('canvas'),
        context = canvas.getContext('2d'),
        length = Math.min(images.length, coordinates.length),
        dest,
        url,
        img,
        a;
      canvas.width = images[0].width;
      canvas.height = coordinates[coordinates.length - 1].y +
        images[images.length - 1].height;
      for (var i = 0; i < length; i++) {
        dest = coordinates[i];
        context.drawImage(images[i], dest.x, dest.y);
      }
      url = canvas.toDataURL();
      img = document.createElement('img');
      img.src = url;
      this.emptyElement();
      this.el.appendChild(img);
    }
  };

  return Instasprite;

})(this, this.document);