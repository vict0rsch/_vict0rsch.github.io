
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
        tags: ["Blog", "Book"],
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
        title: "Deep Learning",
        author: "Y. LeCun, Y. Bengio and G. Hinton",
        year: 2015,
        url: "http://www.nature.com/articles/nature14539.epdf?referrer_access_token=K4awZz78b5Yn2_AoPV_4Y9RgN0jAjWel9jnR3ZoTv0PU8PImtLRceRBJ32CtadUBVOwHuxbf2QgphMCsA6eTOw64kccq9ihWSKdxZpGPn2fn3B_8bxaYh0svGFqgRLgaiyW6CBFAb3Fpm6GbL8a_TtQQDWKuhD1XKh_wxLReRpGbR_NdccoaiKP5xvzbV-x7b_7Y64ZSpqG6kmfwS6Q1rw%3D%3D&tracking_referrer=www.nature.com",
        cleanUrl: "nature.com/articles/nature14539.epdf",
        comment: "",
        tags: ["Paper", "Review"],
        difficulty: 0
    },
    {
        title: "The Deep Learning Book",
        author: "Y. LeCun, Y. Bengio and G. Hinton",
        year: 2016,
        url: "http://www.deeplearningbook.org/",
        cleanUrl: "deeplearningbook.org",
        comment: "",
        tags: ["Book"],
        difficulty: 1
    },
    {
        title: "Convex Optimization ",
        author: "Stephen Boyd and Lieven Vandenberghe",
        year: 2009,
        url: "https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf",
        cleanUrl: "stanford.edu/~boyd",
        comment: "",
        tags: ["Book"],
        difficulty: 1
    },
    {
        title: "The Unreasonable Effectiveness of Recurrent Neural Networks",
        author: "A. Karpathy",
        year: 2015,
        url: "http://karpathy.github.io/2015/05/21/rnn-effectiveness/",
        cleanUrl: "karpathy.github.io",
        comment: "",
        tags: ["Blog"],
        difficulty: 0
    },
    {
        title: "GAN Lab: Play with Generative Adversarial Networks (GANs) in your browser!",
        author: "Minsuk Kahng, Nikhil Thorat, Polo Chau, Fernanda Viégas, and Martin Wattenberg",
        year: 2019,
        url: "https://poloclub.github.io/ganlab/",
        cleanUrl: "poloclub.github.io/ganlab",
        comment: "",
        tags: ["Vis", "GAN"],
        difficulty: 1
    },
    {
        title: "Tensorflow Playground: Tinker With a Neural Network Right Here in Your Browser.",
        author: "",
        year: "",
        url: "https://playground.tensorflow.org/",
        cleanUrl: "playground.tensorflow.org",
        comment: "",
        tags: ["Vis"],
        difficulty: 0
    },
    {
        title: "Unpaired Image-to-Image Translation using Cycle-Consistent Adversarial Networks",
        author: "Jun-Yan Zhu, Taesung Park, Phillip Isola and Alexei A. Efros",
        year: 2017,
        url: "https://junyanz.github.io/CycleGAN/",
        cleanUrl: "junyanz.github.io/CycleGAN/",
        comment: "",
        tags: ["Paper", "GAN", "Code"],
        difficulty: 1
    },
    {
        title: "Importance Weighted and Adversarial Autoencoders",
        author: "Ian Kinsella",
        year: 2017,
        url: "https://casmls.github.io/general/2017/04/24/iwae-aae.html",
        cleanUrl: "casmls.github.io",
        comment: "",
        tags: ["Blog", "VAE"],
        difficulty: 1
    },
];

// const _data = [...data, ...data, ...data, ...data];
// const __data = [..._data, ..._data, ..._data, ..._data];
// const ___data = [...__data, ...__data, ...__data, ...__data];
// data = ___data;

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
    <div class="card ${d.tags.map((v, k) => "card-tag-" + v).join(" ")} card-tag-${difficulty[d.difficulty]}">
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


const addCards = dataArray => {
    $("#resources-cards").html("")
    for (const d of dataArray) {
        $("#resources-cards").append(card(d))
    }
    $(".tag").click((e) => {
        const tag = $(e.target).attr("class").split(/\s+/).filter(c => c.indexOf("-") > -1)[0];
        $("." + tag).toggleClass("tag-is-active");
        updateState();
    })
}


$(function () {
    if ($("#resources-cards").length) {

        addCards(data)

        $("#tag-filter-btn").click(() => {
            const union = $("#tag-filter-btn").text() === "OR";
            if (union) {
                $("#tag-filter-btn").text("AND");
            } else {
                $("#tag-filter-btn").text("OR");
            }
            updateState();
        })

        var sortYearIdx = 0;
        $("#sort-year").click(() => {
            let sorted = [...data];
            sorted.sort((a, b) => {
                if (!a.year) return 100;
                if (!b.year) return -100;
                if (a.year === b.year) return 0;
                return sortYearIdx % 2 === 0 ? a.year - b.year : b.year - a.year;
            });
            sortYearIdx += 1;
            addCards(sorted);
        })

        var sortDiffIdx = 0;
        $("#sort-difficulty").click(() => {
            let sorted = [...data];
            sorted.sort((a, b) => {
                if (!a.difficulty) return 100;
                if (!b.difficulty) return -100;
                if (a.difficulty === b.difficulty) return 0;
                return sortDiffIdx % 2 === 0 ? a.difficulty - b.difficulty : b.difficulty - a.difficulty;
            });
            sortDiffIdx += 1;
            addCards(sorted);
        })

        $("#tag-clear-btn").click(() => {
            addCards(data);
            sortDiffIdx = 0;
            sortYearIdx = 0;
            $("#tag-filter-btn").text("OR")
        })

    }

});
