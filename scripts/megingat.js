$(function() {
  // Carousel.
  $('.carousel-template').each(function(i, el) {
    var template = $(el);
    var id = 'carousel-' + Math.random().toString(36);
    var carousel = $('<div id="' + id + '" class="carousel slide"></div>');
    var indicators = $('<ol class="carousel-indicators"></ol>');
    var inner = $('<div class="carousel-inner" role="listbox"></div>');
    carousel.append(indicators);
    carousel.append(inner);
    template.after(carousel);
    var h1s = template.find('h1');
    var pages = h1s.length;
    h1s.each(function(i, el) {
      var h1 = $(el);
      var img = h1.find('img');
      var p = h1.nextUntil('h1');
      var indicator = $('<li data-target="#' + id + '" data-slide-to="' + i + '"></li>');
      if (i === 0) { indicator.addClass('active'); }
      indicators.append(indicator);
      var item = $('<div class="item"></div>');
      if (i === 0) { item.addClass('active'); }
      inner.append(item);
      item.append(img);
      var container = $('<div class="container"></div>');
      item.append(container);
      var caption = $('<div class="carousel-caption"></div>');
      container.append(caption);
      caption.append(h1);
      caption.append(p);
      p.find('a').addClass('btn btn-lg btn-megingat');
    });
    template.remove();
    var left = $(
      '<a class="left carousel-control" href>' +
        '<span class="glyphicon glyphicon-chevron-left"></span>' +
      '</a>');
    left.click(function(e) {
      e.preventDefault();
      carousel.carousel('prev');
    });
    var right = $(
      '<a class="right carousel-control" href>' +
        '<span class="glyphicon glyphicon-chevron-right"></span>' +
      '</a>');
    right.click(function(e) {
      e.preventDefault();
      carousel.carousel('next');
    });
    carousel.append(left);
    carousel.append(right);
    carousel.carousel();
  });

  // Fold.
  $('#fold').each(function(i, el) {
    var visible = true;
    $(window).scroll(function() {
      var scrollPos = $(window).scrollTop() + $(window).height();
      var foldPos = $('#fold').offset().top;
      if (scrollPos < foldPos && !visible) {
        $('#fold-marker').fadeIn(500);
        visible = true;
      } else if (foldPos < scrollPos && visible) {
        $('#fold-marker').fadeOut(500);
        visible = false;
      }
    });
  });
  $('#fold-marker').click(function() {
    var foldPos = $('#fold').offset().top;
    $('html, body').animate({ scrollTop: foldPos }, 500);
  });

  // Parallax images.
  $('.prose h1 img').wrap('<div class="parallax"></div>');
  var parallax = $('.parallax');
  if (parallax.length > 0) {
    parallax.each(function(i, el) {
      var e = $(el);
      var p = e.parent();
      p.before(e);
      e.append(p);
      imagesLoaded(e.find('img'), function() {
        e.css({ height: calc(e).ph });
      });
    });

    function calc(e) {
      // bottom = y + ih + (s - y) / z
      // bottom = s + wh
      // bottom = y + ph
      // s = y + ph - wh
      // ph = ih + ph / z - wh / z
      // ph = ih * z / (z - 1) - wh / (z - 1)
      // ph / ih = r
      // r * ih * (z - 1) = ih * z - wh
      // r * ih * z - ih * z = r * ih - wh
      // z = (r * ih - wh) / (r * ih - ih)
      var ih = e.find('img').height() - 20;
      var wh = $(window).height();
      var r = 0.8;
      var z = Math.max(2, (r * ih - wh) / (r * ih - ih));
      var ph = Math.min(ih, ih * z / (z - 1) - wh / (z - 1));
      return { ih: ih, wh: wh, r: r, z: z, ph: ph };
    }

    $(window).resize(function() {
      parallax.each(function(i, el) {
        var e = $(el);
        e.css({ height: calc(e).ph });
      });
    });

    $(window).scroll(function(e) {
      var s = $(window).scrollTop();
      parallax.each(function(i, el) {
        var e = $(el);
        var es = s - e.offset().top;
        var c = calc(e);
        if (es < c.ph && -c.wh < es) {
          e.find('img').css({ transform: 'translate3d(0px, ' + es / c.z + 'px, 0px)' });
        }
      });
    });
  }
});
