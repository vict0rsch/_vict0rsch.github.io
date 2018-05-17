function go_dark() {
  console.log('Going dark')
  var elements = []
  $("article p, article li, article ul, article .meta_text").each(function (index) {
    $(this).css('color', 'rgb(231,230,220)');
    elements.push(this)
  });
  $("article").each(function (index) {
    $(this).css('background-color', 'rgb(100,100,100)');
    elements.push(this)
  })
  /* See also .highlight when editing code background */
  $("article code").each(function (index) {
    $(this).css('background-color', 'rgb(130, 130, 130)').css('color', 'rgb(50,50,50)');
    elements.push(this)
  })
  $("article pre").each(function (index) {
    $(this).css('background-color', 'rgb(130, 130, 130)').css('color', 'rgb(50,50,50)');
    elements.push(this)
  })
  $("article h1").each(function (index) {
    $(this).css('color', '#00BFFF');
    elements.push(this)
  });
  $("article h2").each(function (index) {
    $(this).css('color', '#FFFAFA');
    elements.push(this)
  });
  $("article h3").each(function (index) {
    $(this).css('color', '#e0e0eb');
    elements.push(this)
  });
  /* h4 ok no change*/
  $("article h5").each(function (index) {
    $(this).css('color', '#96edff');
    elements.push(this)
  });
  $("#remember_title").each(function (index) {
    $(this).css('color', '#e0e0eb');
    elements.push(this)
  });
  $("article a").each(function (index) {
    $(this).css('color', '#87CEEB');
    elements.push(this)
  });
  $("article a, .dark").hover(
    function () {
      $(this).css('color', '#99fcff');
    },
    function () {
      $(this).css('color', '#87CEEB');
    }
  );
  $("blockquote p").each(function (index) {
    $(this).css('background-color', 'rgb(113,113,113)');
    elements.push(this)
  });
  $('.highlight').each(function (index) {
    $(this).css('background-color', 'rgb(100,100,100)');
    elements.push(this)
  });



  $('#disqus_thread').css('background-color', 'silver').css('padding', '15px');
  elements.push($('#disqus_thread'))

  $('.highlight').each(function () {
    $(this).children().css('background-color', 'rgb(130, 130, 130)')
    elements.push($(this).children())
  })
  /* comments with #*/
  $(".c").each(function (index) {
    $(this).css('color', 'rgb(194, 194, 194)');
    elements.push(this)
  });
  /*strings*/
  $(".s").each(function (index) {
    $(this).css('color', '#f3e796');
    elements.push(this)
  });
  /* int and float */
  $(".mi, .mf").each(function (index) {
    $(this).css('color', '#b3daff');
    elements.push(this)
  });
  /* var names and methods*/
  $(".n").each(function (index) {
    $(this).css('color', 'rgb(250, 250, 250)');
    elements.push(this)
  });
  /* puncuation and operators */
  $(".p").each(function (index) {
    $(this).css('color', 'rgb(80, 80, 80)');
    elements.push(this)
  });
  $(".bp").each(function (index) {
    $(this).css('color', '#2f2e2e');
    elements.push(this)
  });
  $(".nb").each(function (index) {
    $(this).css('color', '#fd966f');
    elements.push(this)
  });
  $(".nn").each(function (index) {
    $(this).css('color', '#63e26a');
    elements.push(this)
  });
  /* function name */
  $(".nf").each(function (index) {
    $(this).css('color', '#fb8077');
    elements.push(this)
  });
  $(".se, .si").each(function (index) {
    $(this).css('color', '#f392aa');
    elements.push(this)
  });


  return elements
}

function add_cancel_btn(elements) {
  var cancel = "<a id='cancel_dark_for_good' class='btn btn-outline dark'>Leave the darkness</a>"

  $('#forget_dark_choice').remove()
  $('#remember_dark_choice').remove()
  $('#remember_title').remove()
  $('#title_buttons').append(cancel)

  $('#cancel_dark_for_good').click(function () {
    localStorage['remember_dark_choice'] = '0';
    for (var el in elements) {
      $(elements[el]).removeAttr('style');
    }
    $('#night_mode').removeAttr('style')
    $('#cancel_dark_for_good').remove()
    $('.anchorjs-link').css('font-family', 'anchorjs-icons')
    $('.anchorjs-link').css('font-style', 'normal')
    $('.anchorjs-link').css('font-variant-ligatures', 'normal')
    $('.anchorjs-link').css('font-variant-caps', 'normal')
    $('.anchorjs-link').css('font-weight', 'normal')
    $('.anchorjs-link').css('line-height', '1')
    $('.anchorjs-link').css('padding-left', '0.375em')
    $("article a").hover(
      function () {
        $(this).css('color', 'black');
      },
      function () {
        $(this).css('color', '#2077b2');
      }
    );
    $("#night_mode").hover(
      function () {
        $(this).css('color', '#185a87');
      },
      function () {
        $(this).css('color', '#2077b2');
      }
    );
    console.log('back')
  });
}


if (localStorage['remember_dark_choice'] == '1' && $(location).attr('href').length > 27) {
  var elements = go_dark();
  var original = $('#title_buttons').html()
  $('#night_mode').toggle()
  add_cancel_btn(elements)
}

$(function () {
  $(".full img").on("click", function () {
    $(this).toggleClass("zoom");
  });
  // $('h1').each(function (element) {
  //   $(this).addClass('animated bounce');
  // });

  $('#night_mode').click(function (event) {
    var remember = '<h3 id="remember_title">Remember choice?</h3>'
    remember += "<a id='remember_dark_choice' class='btn btn-outline dark'>Yes</a>"
    remember += "   <a id='forget_dark_choice' class='btn btn-outline dark'>No</a>"
    $('#night_mode').toggle()
    $('#title_buttons').append(remember)
    var elements = go_dark();
    $('#remember_dark_choice').click(function (event) {
      localStorage['remember_dark_choice'] = '1';
      add_cancel_btn(elements)
    });

    $('#forget_dark_choice').click(function (event) {
      add_cancel_btn(elements)
    });

  });

});/*final*/
