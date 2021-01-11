const DIC_KEY = "rdctd";
const THE_KEY = "rdctd";

//inspect a word
export default (word) => {
    console.log(word);
    $.ajax({
        url: `https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${THE_KEY}`,
        method: "GET",
    }).then((res) => {
        console.log(res);
        const $inspectContainer = $("<div id='inspect-container'></div>");
        const $inspect = $("<div id='inspect'></div>");
        $inspectContainer.append($inspect);
        $("body").append($inspectContainer);

        res.forEach((sub) => {
            const word = sub.meta.id;
            const pos = sub.fl;
            const def = sub.def[0].sseq[0][0][1].dt[0][1];
            const exmp = sub.def[0].sseq[0][0][1].dt[1][1][0].t;
            const syns = sub.def[0].sseq[0][0][1].syn_list;
            const rels = sub.def[0].sseq[0][0][1].rel_list;

            console.log({ word, pos, def, exmp, syns, rels });

            const $subdiv = $("<div id='word-sub'></div>");
            $subdiv.append($(`<h2>${word}</h2>`));
            $subdiv.append($(`<h3>${pos}</h3>`));
            $subdiv.append($(`<p>${def}</p>`));
            $subdiv.append($(`<p>${exmp}</p>`));

            syns.forEach((synsSub) => {
                const $synList = $("<div class='inspect-syns'></div>");

                synsSub.forEach((syn) => {
                    $synList.append($(`<span>${syn.wd}</span>`));
                });

                $subdiv.append($synList);
            });

            rels.forEach((relsSub) => {
                const $relList = $("<div class='inspect-rels'></div>");

                relsSub.forEach((rel) => {
                    $relList.append($(`<span>${rel.wd}</span>`));
                });

                $subdiv.append($relList);
            });

            $inspect.append($subdiv);
        });
    });
};
