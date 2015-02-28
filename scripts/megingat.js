$(function() {
  $('.content h1 img').wrap('<div class="parallax"></div>');
  var parallax = $('.parallax');
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
});
