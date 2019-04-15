const DEFAULT_STATE = {
    index: -1,
    resultNb: 0
}

function resetState() {
    window.__state = { ...DEFAULT_STATE }
}

function deleteState() {
    window.__state = undefined;
}

function incrementIndex() {
    if (!window.__state) resetState();
    const hitZero = getIndex() + 1 === getResultNb()
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

function setResultNb(val) {
    window.__state.resultNb = val;
}

const SEARCH_BASE = `
<div id="search-input-div">
    <input type="search" id="search-input" placeholder="What are you looking for?" autofocus autocomplete="off">
</div>
<div id="search-container">
    <ul id="results-container"></ul>
</div>
`

function moveSelected(event) {
    if (!getResultNb()) {
        return
    }
    if (event.keyCode === 38) {
        decrementIndex()
        if (getIndex() === -1) {
            $('#search-input').focus();
            $('.search-li').removeClass('search-active');
            return
        }
    } else if (event.keyCode === 40) {
        const hitZero = incrementIndex();
        if (hitZero) {
            $('#search-input').focus();
            $('.search-li').removeClass('search-active');
            return;
        }
    } else {
        return
    }
    const $el = $('.search-li').eq(getIndex());
    $('.search-li').removeClass('search-active');
    $el.addClass('search-active');
    $el.find("a").focus();

}

function enableSearchUI() {
    $(".tingle-modal-box").off("keyup");
    $(".tingle-modal-box").keyup(moveSelected);
    $("#results-container li").click((e) => {
        const $el = $(e.target);
        if ($el.hasClass("search-tag")) {
            const v = $el.text();
            window.history.replaceState({}, document.title, window.location.href.split("?")[0] + "?search=" + v)
            doSearch(v);
            $("#search-input").val(v);
            $("#search-input").focus();
        } else {
            const newLoc = $el.closest("li").find(">:first-child").find(">:first-child").attr("href");
            if (newLoc) window.location.href = newLoc;
        }
    })
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
        // console.log(element, element.tags);
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
    for (var itemIx in result) {
        var item = result[itemIx]
        var ref = item.ref
        var post = window.store[parseInt(ref, 10)];
        var searchitem = $('');
        searchitem = $(getTemplate(post));
        searchitem.appendTo('#results-container');
    }
    enableSearchUI()
}

function getTemplate(item) {
    const sub = $.trim(item.subtitle);
    const ex = $.trim(item.excerpt);
    const tit = $.trim(item.title);
    let tags = " "
    if (item.hasOwnProperty('tags') && $.trim(item.tags)) {
        tags = `<div>${item.tags.split(', ').map(
            (v, k) => `<span class="home-tag search-tag btn btn-outline" href="#">${v}</span>`
        ).reduce((a, b) => a + b)}</div>`
    }

    return `<li class="search-li">
        <div class="search-item-header">
            <a class="search-result-item-link" href="${item.url}"> ${tit} </a>
            <span class="search-date"> ${item.date || ""} </span>
        </div>
        ${sub || ex ? "<p>" : ""}
        <span class="search-subtitle">${sub}</span>
        ${sub && ex ? "<br/>" : ""}
        <span class="search-excerpt">${ex}</span>
        ${sub || ex ? "</p>" : ""}
        ${tags}
    </li>`

}
function updateUrlParameter(value) {
    window.history.pushState('', '', '?search=' + encodeURIComponent(value));
}

function getQuery(modal) {
    var parser = document.createElement('a')
    parser.href = window.location.href
    // console.log('Initial query');
    if (parser.href.includes('=')) {
        var searchquery = decodeURIComponent(parser.href.substring(parser.href.indexOf('=') + 1))
        // console.log('searchquery', searchquery);
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

    $(".search-link").click((e) => {
        e.preventDefault()
        modal.open();
        return false
    })

    $.fn.wrapInTag = function (opts) {

        const tag = opts.tag || 'strong'
            , words = opts.words || []
            , regex = RegExp(words.join('|'), 'gi') // case insensitive
            , replacement = '<' + tag + '>$&</' + tag + '>';

        return this.html(function () {
            return $(this).text().replace(regex, replacement);
        });
    };

    $('.home-tag').click((event) => {
        const tag = $(event.target).html();
        updateUrlParameter(tag);
        modal.open();
        doSearch(tag);
        $('#search-input').val(tag);
    })

    $.ajax({
        dataType: "json",
        url: "/search.json",
        context: document.body,
        success: function (data) {

            window.store = [];
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    const element = data[key];
                    if (element.title) {
                        window.store.push(element)
                    }
                }
            }

            getQuery(modal);

            $('#search-input').keyup(function (event) {
                if (event.keyCode !== 38 && event.keyCode !== 40) {
                    resetState()
                    const query = $('#search-input').val()
                    doSearch(query);
                }
            })
        }
    });

});