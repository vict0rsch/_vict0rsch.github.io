if (!String.prototype.endsWith) {
  String.prototype.endsWith = function (searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.lastIndexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

function selectAndCopyText(containerid) {
  if (document.selection) { // IE
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(containerid));
    range.select();
    document.execCommand('copy');
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand('copy');
  }
}

function processToc() {
  // splitToc();
  $('#markdown-toc').before('<button class="btn btn-outline" id="toggleTocButton">Show Table of contents</button>');
  $('#markdown-toc').wrap('<div id="toc-container"></div>')
  $('#markdown-toc').hide();
  var tocCounter = 0;
  $('#toggleTocButton').click(function () {
    $('#markdown-toc').toggle();
    if (tocCounter % 2 === 0) {
      $('#toggleTocButton').text('Hide Table of contents');
    } else {
      $('#toggleTocButton').text('Show Table of contents');
    }
    tocCounter += 1;
  })
}

function splitToc() {
  var els = $('#markdown-toc').children();
  console.log(els);
  var firstCol = els.slice(0, Math.floor(els.length / 2));
  var secondCol = els.slice(Math.floor(els.length / 2));
  var toc = '<div class="tocRow" id="markdown-toc"><div class="tocColumn" id="firstTocColumn"></div><div class="tocColumn" id="secondTocColumn"></div></div>'
  $('#markdown-toc').replaceWith(toc);
  $('#firstTocColumn').append('<ol></ol>');
  $('#firstTocColumn').first().append(firstCol);
  $('#secondTocColumn').append('<ol></ol>');
  $('#secondTocColumn').first().append(secondCol);

}

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
    $(this).css('color', 'rgb(236, 233, 220)');
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
    $(this).css('color', 'rgb(245, 185, 106)');
    elements.push(this)
  });
  $(".nn").each(function (index) {
    $(this).css('color', '#63e26a');
    elements.push(this)
  });
  $(".o").each(function (index) {
    $(this).css('color', '#ffffff');
    elements.push(this)
  });
  /* function name */
  $(".nf").each(function (index) {
    $(this).css('color', 'rgb(119, 212, 251)');
    elements.push(this)
  });
  $(".se, .si").each(function (index) {
    $(this).css('color', '#f392aa');
    elements.push(this)
  });

  $(".copyCode").each(function (index) {
    $(this).css('background-color', 'rgb(130, 130, 130');
    elements.push(this);
  });
  $(".copyCode:hover").each(function (index) {
    $(this).css('background-color', 'rgb(130, 130, 130');
    elements.push(this);
  });
  // If these values are modified so should those in add_cancel_btn
  $("article a, #toggleTocButton, .copyCode").each(function (index) {
    $(this).css('color', '#87CEEB');
    $(this).css('border-color', '#87CEEB');
    elements.push(this)
  });
  $("article a, .dark, #toggleTocButton, .copyCode").hover(
    function () {
      $(this).css('color', '#99fcff');
      $(this).css('border-color', '#99fcff');
    },
    function () {
      $(this).css('color', '#87CEEB');
      $(this).css('border-color', '#87CEEB');
    }
  );

  return elements
}

function add_cancel_btn(elements) {
  var cancel = "<a id='cancel_dark_for_good' class='btn btn-outline dark'>Leave the darkness</a>"

  $('#forget_dark_choice').remove()
  $('#remember_dark_choice').remove()
  $('#remember_title').remove()
  $('#title_buttons').append(cancel)

  $("#cancel_dark_for_good").css('color', '#87CEEB').css('border-color', '#87CEEB');
  $("#cancel_dark_for_good").hover(
    function () {
      $(this).css('color', '#99fcff');
      $(this).css('border-color', '#99fcff');
    },
    function () {
      $(this).css('color', '#87CEEB');
      $(this).css('border-color', '#87CEEB');
    }
  );

  $('#cancel_dark_for_good')

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
    $("article a, .dark, #toggleTocButton, .copyCode").hover(
      function () {
        $(this).css('color', '#173858');
        $(this).css('border-color', '#1c699c');
      },
      function () {
        $(this).css('color', '#1c699c');
        $(this).css('border-color', '#2077b2');
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
  $('img').each(function (index) {
    if ($(this).attr('src') === '/images/ld-ed.png') {
      $(this).css('max-width', '550px');
    }
  })
  $('details').details();
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

  $('article').each(function (index) {
    $(this).append('<button class="btn btn-outline" id="copiedFeedback">code copied !</button>')
  })

  $('.highlight pre').each(function (index) {
    $(this).append('<button class="copyCode btn btn-outline" id="copyCode' + index + '">Copy code</button>')
    $(this).on("mouseover", function () {
      $('#copyCode' + index).css('display', 'inline-block');
    });
    $(this).on("mouseout", function () {
      $('#copyCode' + index).css('display', 'none');
    });
    var el = this;
    $('#copyCode' + index).click(function (event) {
      event.preventDefault();
      $(el).find('code').each(function () {
        $(this).attr('id', 'codeToCopy' + index);
        selectAndCopyText('codeToCopy' + index);
        $('#copiedFeedback').show()
        setTimeout(function () {
          $('#copiedFeedback').css('display', 'none');
        }, 3000);
      });
      return false;
    })
  })
  processToc();

});/*final*/