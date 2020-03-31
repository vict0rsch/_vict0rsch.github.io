
var data = [
    {
        title: "A visual introduction to Machine Learning",
        author: "",
        year: "",
        url: "https://www.r2d3.us/",
        cleanUrl: "r2d3.us",
        tags: ["ML", "Blog"],
        comment: "",
        difficulty: 0
    },
    {
        title: "Neural Networks and Deep Learning",
        author: "M. Nielsen",
        year: 2015,
        url: "http://neuralnetworksanddeeplearning.com/",
        cleanUrl: "neuralnetworksanddeeplearning.com",
        tags: ["DL", "Blog", "Book"],
        comment: "",
        difficulty: 0
    },
    {
        title: "Pattern Recognition and Machine Learning",
        author: "C. Bishop",
        year: 2006,
        url: "http://www.rmki.kfki.hu/~banmi/elte/Bishop%20-%20Pattern%20Recognition%20and%20Machine%20Learning.pdf",
        cleanUrl: "rmki.kfki.hu/~banmi",
        tags: ["ML", "Book"],
        comment: "",
        difficulty: 1
    },
    {
        title: "Deep Learning review",
        author: "Y. LeCun, Y. Bengio and G. Hinton",
        year: 2015,
        url: "http://www.nature.com/articles/nature14539.epdf?referrer_access_token=K4awZz78b5Yn2_AoPV_4Y9RgN0jAjWel9jnR3ZoTv0PU8PImtLRceRBJ32CtadUBVOwHuxbf2QgphMCsA6eTOw64kccq9ihWSKdxZpGPn2fn3B_8bxaYh0svGFqgRLgaiyW6CBFAb3Fpm6GbL8a_TtQQDWKuhD1XKh_wxLReRpGbR_NdccoaiKP5xvzbV-x7b_7Y64ZSpqG6kmfwS6Q1rw%3D%3D&tracking_referrer=www.nature.com",
        cleanUrl: "nature.com/articles/nature14539.epdf",
        comment: "",
        tags: ["DL", "Paper", "Review"],
        difficulty: 0
    },
    {
        title: "The Deep Learning Book",
        author: "Y. LeCun, Y. Bengio and G. Hinton",
        year: 2016,
        url: "http://www.deeplearningbook.org/",
        cleanUrl: "deeplearningbook.org",
        comment: "",
        tags: ["DL", "Book"],
        difficulty: 1
    },
    {
        title: "The Unreasonable Effectiveness of Recurrent Neural Networks",
        author: "A. Karpathy",
        year: 2015,
        url: "http://karpathy.github.io/2015/05/21/rnn-effectiveness/",
        cleanUrl: "karpathy.github.io",
        comment: "",
        tags: ["DL", "Blog"],
        difficulty: 1
    },
    {
        title: "GAN Lab: Play with Generative Adversarial Networks (GANs) in your browser!",
        author: "Minsuk Kahng, Nikhil Thorat, Polo Chau, Fernanda Viégas, and Martin Wattenberg",
        year: 2019,
        url: "https://poloclub.github.io/ganlab/",
        cleanUrl: "poloclub.github.io/ganlab",
        comment: "",
        tags: ["DL", "Vis", "GAN"],
        difficulty: 1
    },
];

const titles = {
    "DL": "Deep Learning",
    "ML": "Machine Learning",
    "Vis": "Visualization",
    "GAN": "Generative Adversarial Networks"
};

const difficulty = ["Easy", "Intermediate", "Advanced"];

const urlLimit = window.innerWidth < 400 ? 25 : window.innerWidth < 720 ? 40 : window.innerWidth < 1000 ? 20 : 25;

const getActive = () => {
    let tags = new Set();
    $('.tag-is-active').each((k, v) => {
        console.log(k, v)
        const tag = $(v).attr("class").split(/\s+/).filter(c => c.indexOf("-") > -1 && c !== "tag-is-active")[0];
        tags.add(tag.split("-").slice(-1)[0]);
    })
    return Array.from(tags);
}

const updateState = () => {
    const union = $("#tag-filter-btn").text() === "OR";
    const selectorTags = getActive().map((tag, k) => ".card-tag-" + tag);
    if (!selectorTags.length) {
        $(".card").removeClass("card-inactive");
        return
    }
    let active, inactive;
    if (union) {
        active = selectorTags.map((v, k) => ".card" + v).join(", ");
        inactive = `.card:not(${selectorTags.join(", ")})`;
    } else {
        active = selectorTags.map((v, k) => ".card" + v).join("");
        inactive = `.card:not(${active})`;
    }
    $(inactive).addClass("card-inactive");
    $(active).removeClass("card-inactive");
}

const card = d => `
    <div class="card ${d.tags.map((v, k) => "card-tag-" + v).join(" ")}">
        <div class="card-header">
        </div>
        <div class="card-body">
            <div class="card-title">
            ${d.title}
            </div>
            <div class="url">
            <a target="_blank" rel="noreferrer noopenner" href="${d.url}">${d.cleanUrl.length > urlLimit ? d.cleanUrl.slice(0, urlLimit) + "..." : d.cleanUrl}</a>
            </div>
            ${d.author ? `<div class="author">${d.author}</div>` : ""}
            ${d.year ? `<div class="year">(${d.year})</div>` : ""}
        </div>
        <div class="card-tags">
            ${d.tags.map((v, k) => `<span title="${titles.hasOwnProperty(v) ? titles[v] : v}" class="tag ${"tag-" + v}">${v}</span>`).join(" ")}
        </div>
        <span title=${difficulty[d.difficulty]} class="tag tag-${difficulty[d.difficulty]} tag-difficulty" >${d.difficulty}</span>
    </div>
    `;


$(function () {
    if ($("#resources-cards").length) {

        console.log("Resources Cards")

        for (const d of data) {
            $("#resources-cards").append(card(d))
        }

        $(".tag").click((e) => {
            const tag = $(e.target).attr("class").split(/\s+/).filter(c => c.indexOf("-") > -1)[0];
            $("." + tag).toggleClass("tag-is-active");
            updateState();
        })

        $("#tag-filter-btn").click(() => {
            const union = $("#tag-filter-btn").text() === "OR";
            if (union) {
                $("#tag-filter-btn").text("AND");
            } else {
                $("#tag-filter-btn").text("OR");
            }
            updateState();
        })

        $("#tag-clear-btn").click(() => {
            $(".tag").removeClass("tag-is-active");
            updateState();
        })

    }

});
