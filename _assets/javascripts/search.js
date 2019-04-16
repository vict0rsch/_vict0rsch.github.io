var DEFAULT_STATE = {
    index: -1,
    resultNb: 0
}

function resetState() {
    window.__state = DEFAULT_STATE;
}

function devareState() {
    window.__state = undefined;
}

function incrementIndex() {
    if (!window.__state) resetState();
    var hitZero = getIndex() + 1 === getResultNb()
    window.__state.index = hitZero ? -1 : (getIndex() + 1) % getResultNb();
    return hitZero
}

function decrementIndex() {
    if (!window.__state) resetState();
    window.__state.index = getIndex() - 1
    if (getIndex() < -1) window.__state.index = getResultNb() - 1;
}

function getIndex() {
    return parseInt(window.__state.index, 10);
}

function getResultNb() {
    return parseInt(window.__state.resultNb, 10);
}

function setIndex(index) {
    window.__state.index = index;
}

function setResultNb(val) {
    window.__state.resultNb = val;
}

var SEARCH_BASE = '\
<div id="search-input-div">\
<input type="search" id="search-input" placeholder="What are you looking for?" autofocus autocomplete="off">\
</div>\
<div id="search-container">\
<ul id="results-container"></ul>\
</div>\
<div id="search-loading" style="display:none">Loading blog data ... :)</div>'

function moveSelected(event, forceIndex) {
    if (!getResultNb()) {
        return
    }
    var noCursor = false;
    if (typeof forceIndex === 'undefined') {
        noCursor = true;
        if (event.keyCode === 38) {
            decrementIndex()
            $('.search-li').removeClass('search-active-hover');
            if (getIndex() === -1) {
                $('#search-input').focus();
                $('.search-li').removeClass('search-active');
                return
            }
        } else if (event.keyCode === 40) {
            var hitZero = incrementIndex();
            $('.search-li').removeClass('search-active-hover');
            if (hitZero) {
                $('#search-input').focus();
                $('.search-li').removeClass('search-active');
                return;
            }
        } else {
            return
        }
    } else {
        setIndex(forceIndex);
    }
    var $el = $('#search-li-' + getIndex());
    $('.search-li').removeClass('search-active');
    $('.search-li').off('keydown')
    $el.addClass('search-active');
    $el.find('a').focus();
    if (noCursor) {
        // does not work
        $("document").css("cursor", "none");
    }
}

function enableInput() {
    $('#search-input').keyup(function (event) {

        if (sessionStorage.getItem('loading-data')) {
            $("#search-loading").show();
            return
        } else if ($("#search-loading").is(":visible")) {
            $("#search-loading").hide();
        }

        if (event.keyCode !== 38 && event.keyCode !== 40) {
            resetState()
            var query = $('#search-input').val()
            doSearch(query);
        }
    })
}

function enableSearchUI() {
    $(".tingle-modal-box").off("keyup");
    $(".tingle-modal-box").keyup(moveSelected);
    $("#results-container li").click(function (e) {
        var $el = $(e.target);
        if ($el.hasClass("search-tag")) {
            var v = $el.text();
            window.history.replaceState({}, document.title, window.location.href.split("?")[0] + "?search=" + v)
            doSearch(v);
            $("#search-input").val(v);
            $("#search-input").focus();
        } else {
            var newLoc = $el.closest("li").find(">:first-child").find(">:first-child").attr("href");
            if (newLoc) window.location.href = newLoc;
        }
    })
    $('.search-li').on("mouseenter", function (e) {
        var id = parseInt(e.target.id.split('-')[2]);
        if (!isNaN(id)) moveSelected(e, id);
    });
    $('.search-li').on("mouseleave", function (e) {
        $(this).removeClass("search-active");
    });
    document.onmousemove = function () {
        if ($("document").css("cursor") === "none") {
            $("document").css("cursor", "default");
            $('.search-li').addClass('search-active-hover');
        }
    }
}

function matchAnd(string, queries) {
    for (var i in queries) {
        var quer = queries[i];
        if (string.toLowerCase().indexOf(quer.toLowerCase()) === -1) {
            return false;
        }
    }
    return true;
}

function mySearch(_query) {
    var results = [];
    var query = _query.toLowerCase()
    var pushed;
    var scores = {
        tag: 4,
        title: 3,
        subtitle: 2,
        excerpt: 1
    }
    for (var idx in window.store) {
        pushed = false;
        var element = window.store[idx];

        var title = element.title;
        if (title && matchAnd(title, query.split(' '))) {
            results.push(
                {
                    ref: idx,
                    score: scores.title
                }
            )
            pushed = true;
        }

        var subtitle = element.subtitle;

        if (subtitle && matchAnd(subtitle, query.split(' '))) {
            if (!pushed) {
                results.push(
                    {
                        ref: idx,
                        score: scores.subtitle
                    }
                )
                pushed = true;
            } else {
                results[results.length - 1].score += 2
            }

        }

        var tags = element.tags.split(', ');
        for (var w in tags) {
            if (tags[w] && matchAnd(tags[w], query.split(' '))) {
                if (!pushed) {
                    results.push(
                        {
                            ref: idx,
                            score: scores.tag
                        }
                    )
                    pushed = true;
                } else {
                    results[results.length - 1].score += 3
                }
            }
        }

        var excerpt = element.excerpt;
        if (excerpt && matchAnd(excerpt, query.split(' '))) {
            if (!pushed) {
                results.push(
                    {
                        ref: idx,
                        score: scores.excerpt
                    }
                )
            } else {
                results[results.length - 1].score += 1
            }
        }


    }
    resutls = results.sort(function (a, b) {
        return b.score - a.score
    })
    return results
}

function doSearch(query) {
    // console.log('doSearch: ', query);
    $('#results-container').html('');
    if ($.trim(query)) {
        var result = mySearch(query);
        // console.log(result);
        // console.log('result', result);
        updateUrlParameter(query)
        showResults(result)
        $('#results-container li a, #results-container li p span').wrapInTag({
            tag: 'strong',
            words: query.split(' ')
        });
    } else {
        updateUrlParameter('')
    }
}

function showResults(result) {
    setResultNb(result.length);
    var i = 0;
    for (var itemIx in result) {
        var item = result[itemIx]
        var ref = item.ref
        var post = window.store[parseInt(ref, 10)];
        var searchitem = $('');
        searchitem = $(getTemplate(post, i));
        searchitem.appendTo('#results-container');
        i++;
    }
    enableSearchUI()
}

function getTemplate(item, index) {
    var sub = $.trim(item.subtitle);
    var ex = $.trim(item.excerpt);
    var tit = $.trim(item.title);
    var tags = " "
    var date = item.date || "";
    var br = sub && ex ? "<br/>" : ""
    var p = sub || ex ? '<p id="search-p-' + index + '">' : ''
    var _p = sub || ex ? "</p>" : ""

    if (item.hasOwnProperty('tags') && $.trim(item.tags)) {
        tags = "<div>" + item.tags.split(', ').map(
            function (v, k) { return '<span class="home-tag search-tag btn btn-outline" href="#">' + v + '</span>' }
        ).reduce(function (a, b) { return a + b })
    } + "</div>"


    return '<li class="search-li" id="search-li-' + index + '">\
        <div class="search-item-header" id="search-div-' + index + '">\
            <a class="search-result-item-link" href="' + item.url + '" id="search-a-' + index + '"> ' + tit + '</a>\
            <span class="search-date"  id="search-date-' + index + '"> ' + date + '</span>\
        </div>\
         ' + p + '       <span class="search-subtitle"  id="search-subtitle-' + index + '">' + sub + '</span>\
        ' + br + '\
        <span class="search-excerpt" id="search-excerpt-' + index + '"> ' + ex + '</span>\
        ' + _p + tags + '</li>'
}

function updateUrlParameter(value) {
    window.history.pushState('', '', '?search=' + encodeURIComponent(value));
}

function getCurrentURLQuery(modal) {
    var parser = document.createElement('a')
    parser.href = window.location.href
    if (parser.href.includes('?search=')) {
        var searchquery = decodeURIComponent(parser.href.substring(parser.href.indexOf('=') + 1))
        $('#search-input').val(searchquery);
        resetState();
        doSearch(searchquery)
        modal.open()
    }

}



$('document').ready(function () {

    resetState();

    var modal = new tingle.modal({
        footer: false,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-class-1', 'custom-class-2'],
        closeLabel: "Close search",
        onClose: function () {
            window.history.replaceState({}, document.title, window.location.href.split("?")[0]);
            $("#search-input").val("");
            $("#results-container").html("");
            $("document").off("keypress");
        },
        onOpen: function () {
            $("#search-input").focus();
        },
    });

    // set content
    modal.setContent(SEARCH_BASE);

    $(".search-link").click(function (e) {
        e.preventDefault()
        modal.open();
        return false
    })

    $.fn.wrapInTag = function (opts) {

        var tag = opts.tag || 'strong'
            , words = opts.words || []
            , regex = RegExp(words.join('|'), 'gi') // case insensitive
            , replacement = '<' + tag + '>$&</' + tag + '>';

        return this.html(function () {
            return $(this).text().replace(regex, replacement);
        });
    };

    $('.home-tag').click(function (event) {
        var tag = $(event.target).html();
        updateUrlParameter(tag);
        modal.open();
        doSearch(tag);
        $('#search-input').val(tag);
    })

    var fetch = false;
    var data;
    if (!sessionStorage.getItem('search')) {
        fetch = true;
    } else {
        try {
            data = JSON.parse(sessionStorage.getItem('search'));
            if (new Date() - new Date(data.date) > 1000 * 3600 * 7) {
                fetch = true;
            }
        } catch (error) {
            fetch = true;
        }
    }
    if (!fetch) {
        try {
            window.store = data.store;
            getCurrentURLQuery(modal);
            enableInput();
            console.log("using local data");
        } catch (error) {
            fetch = true;
        }
    }
    if (fetch) {
        sessionStorage.setItem("loading-data", "true");
        console.log("fetching data");
        $.ajax({
            dataType: "json",
            url: "/search.json",
            context: document.body,
            success: function (data) {

                window.store = [];
                for (var key in data) {
                    if (data.hasOwnProperty(key)) {
                        var element = data[key];
                        if (element.title) {
                            window.store.push(element)
                        }
                    }
                }
                data = JSON.stringify({
                    store: window.store,
                    date: new Date()
                })
                sessionStorage.setItem("search", data);
                sessionStorage.removeItem("loading-data");
                if ($('#search-input').val()) {
                    $('#search-input').trigger("keyup");
                }
                getCurrentURLQuery(modal);
                enableInput();
            }
        });
    }
});