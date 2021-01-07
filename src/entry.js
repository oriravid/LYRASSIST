import allWords from "./words";
import * as helpers from "./helpers";

// grabs 250 words from API
// import wordFetcher from "./word_fetcher";

// checks for duplicates
// console.log(allWords);
// console.log(helpers.arrayUnique(allWords));

window.addEventListener("DOMContentLoaded", (e) => {
    //all animated
    const $animatedEls = $(".animated");

    //big word
    const $wordContainer = $("#word-container");
    const $wordEl = $("#word");

    //word data
    const $definition = $("#definition");
    const $synonymList = $("#synonym-list");
    const $relatedList = $("#related-list");

    //current word data
    var currentWord;
    var savedWords = localStorage.savedWords
        ? JSON.parse(localStorage.savedWords)
        : [];

    $wordContainer.on(" animationiteration ", () => {
        currentWord = allWords[Math.floor(Math.random() * allWords.length)];

        // replace word
        $wordEl.text(currentWord.word);

        //replace definition
        $definition.text(currentWord.def);

        //replace synonyms
        $synonymList.empty();
        helpers
            .arrayShuffler(currentWord.syn)
            .slice(0, 3)
            .forEach((syn) => {
                $synonymList.append("<li>" + syn + "</li>");
            });

        //replace related
        $relatedList.empty();
        helpers
            .arrayShuffler(currentWord.rel)
            .slice(0, 3)
            .forEach((rel) => {
                $relatedList.append("<li>" + rel + "</li>");
            });
    });

    //pause animation
    $animatedEls.on("mouseenter", (e) => $($animatedEls).addClass("paused"));
    $animatedEls.on("mouseleave", (e) => $($animatedEls).removeClass("paused"));

    //save word
    $("body").on("keydown", (e) => {
        if (
            e.keyCode === 32 &&
            currentWord &&
            !savedWords.includes(currentWord)
        ) {
            savedWords.push(currentWord);
            localStorage.setItem("savedWords", JSON.stringify(savedWords));

            console.log(localStorage.savedWords);
        }
    });
});
