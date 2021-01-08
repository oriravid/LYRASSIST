import allWords from "./words";
import * as helpers from "./helpers";
import * as icons from "./icons";

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
    var currentWordObj;

    $wordContainer.on(" animationiteration ", () => {
        currentWordObj = allWords[Math.floor(Math.random() * allWords.length)];

        // replace word
        $wordEl.text(currentWordObj.word);

        //replace definition
        $definition.text(currentWordObj.def);

        //replace synonyms
        $synonymList.empty();
        helpers
            .arrayShuffler(currentWordObj.syn)
            .slice(0, 3)
            .forEach((syn) => {
                $synonymList.append("<li>" + syn + "</li>");
            });

        //replace related
        $relatedList.empty();
        helpers
            .arrayShuffler(currentWordObj.rel)
            .slice(0, 3)
            .forEach((rel) => {
                $relatedList.append("<li>" + rel + "</li>");
            });
    });

    //pause animation
    $animatedEls.on("mouseenter", (e) => $($animatedEls).addClass("paused"));
    $animatedEls.on("mouseleave", (e) => $($animatedEls).removeClass("paused"));

    //saved words
    var savedWords = localStorage.savedWords
        ? JSON.parse(localStorage.savedWords)
        : {};
    const $savedList = $("#saved-words-list");

    const generateSavedWord = (savedWordObj) => {
        var $savedWordLi = $("<li class='saved'></li>");

        var $deleteWord = $(`${icons.close("icon")}`);
        $deleteWord.on("click", () =>
            removeSavedWord($deleteWord, savedWordObj.word)
        );
        $savedWordLi.append($deleteWord);

        var $wordContent = $(`<span>${savedWordObj.word}</span>`);
        $savedWordLi.append($wordContent);

        return $savedWordLi;
    };

    // render saved words list on startup
    const savedWordsArr = Object.values(savedWords);
    if (savedWordsArr) {
        savedWordsArr.forEach((savedWordObj) => {
            $savedList.append(generateSavedWord(savedWordObj));
        });
    }

    //save a word
    $("body").on("keydown", (e) => {
        if (
            e.keyCode === 32 &&
            currentWordObj &&
            !savedWords[currentWordObj.word]
        ) {
            savedWords[currentWordObj.word] = currentWordObj;
            $savedList.append(generateSavedWord(currentWordObj));
            localStorage.setItem("savedWords", JSON.stringify(savedWords));

            console.log(localStorage.savedWords);
        }
    });

    //remove a word
    const removeSavedWord = (ele, savedWord) => {
        $(ele).parent("li").remove();

        delete savedWords[savedWord];
        localStorage.setItem("savedWords", JSON.stringify(savedWords));
    };
});
