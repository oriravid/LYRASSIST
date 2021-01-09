import allWords from "./words";
import * as helpers from "./helpers";
import * as icons from "./icons";

// grabs 250 words from API
// import wordFetcher from "./word_fetcher";

// checks for duplicates
// console.log(allWords);
// console.log(helpers.arrayUnique(allWords));

window.addEventListener("DOMContentLoaded", () => {
    //VARIABLES////////////////////////////////////////////////////////////////
    //big word
    const $wordContainer = $("#word-container");
    const $wordEl = $("#word");
    const $ripple = $("#ripple");

    //word data
    const $definition = $("#definition");
    const $synonymList = $("#synonym-list");
    const $relatedList = $("#related-list");

    //All animated elements
    const $animatedEls = $(".animated");

    //current word data
    var currentWordObj;

    //SETTINGS/////////////////////////////////////////////////////////////////
    var settings = localStorage.settings
        ? JSON.parse(localStorage.settings)
        : { sidebarHide: false, speed: "med" };

    //animation speed

    const changeSpeed = (speed) => {
        var $slow = $("#slow");
        var $med = $("#med");
        var $fast = $("#fast");
        var $activeSpeed = $("#active-speed");

        if (speed === "slow") {
            $animatedEls.css("animation-duration", "10s");
            $activeSpeed.css("left", 0);
            $activeSpeed.css("width", $slow.innerWidth() + "px");
        } else if (speed === "med") {
            $animatedEls.css("animation-duration", "6s");
            $activeSpeed.css("left", $slow.innerWidth() + "px");
            $activeSpeed.css("width", $med.innerWidth() + "px");
        } else if (speed === "fast") {
            $animatedEls.css("animation-duration", "3s");
            $activeSpeed.css(
                "left",
                $slow.innerWidth() + $med.innerWidth() + 1 + "px"
            );
            $activeSpeed.css("width", $fast.innerWidth() + "px");
        }

        $activeSpeed.text(speed[0].toUpperCase() + speed.slice(1));

        settings.speed = speed;
        localStorage.setItem("settings", JSON.stringify(settings));
    };

    $(".switch3").click((e) => {
        changeSpeed(e.currentTarget.id);
    });

    changeSpeed(settings.speed);

    //sidebar hide
    $("#sidebar-setting").attr("checked", settings.sidebarHide);
    $("#sidebar-setting").change((e) => {
        settings.sidebarHide = e.target.checked;
        localStorage.setItem("settings", JSON.stringify(settings));
    });

    const $sidebar = $("#sidebar");

    const sidebarHide = () => {
        settings.sidebarHide
            ? $sidebar.addClass("hidden")
            : $sidebar.removeClass("hidden");
    };

    //ANIMATION LOOP////////////////////////////////////////////////////////////

    var iteration = 0;
    $wordContainer.on(" animationiteration ", () => {
        //increment iteration
        iteration++;

        //bring logo up!
        if (iteration === 1) $("#logo").removeClass("inactive");

        // new word
        currentWordObj = allWords[Math.floor(Math.random() * allWords.length)];

        //check if word is saved or not
        savedWords[currentWordObj.word]
            ? $wordEl.addClass("saved")
            : $wordEl.removeClass("saved");

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

        //auto hide sidebar if necessary
        sidebarHide();
    });

    //SAVED WORDS///////////////////////////////////////////////////////////////
    var savedWords = localStorage.savedWords
        ? JSON.parse(localStorage.savedWords)
        : {};
    const $savedList = $("#saved-words-list");

    const generateSavedWord = (savedWordObj) => {
        var $savedWordLi = $("<li class='saved-word pointer'></li>");
        $savedWordLi.click(() => inspectWord(savedWordObj.word));

        var $wordContent = $(`<span>${savedWordObj.word}</span>`);
        $savedWordLi.append($wordContent);

        var $deleteWord = $(`${icons.close("icon")}`);
        $deleteWord.click((e) => {
            e.stopPropagation();
            removeSavedWord($deleteWord, savedWordObj.word);
        });
        $savedWordLi.append($deleteWord);

        return $savedWordLi;
    };

    // render saved words list on startup
    const savedWordsArr = Object.values(savedWords);
    if (savedWordsArr) {
        savedWordsArr.forEach((savedWordObj) => {
            $savedList.append(generateSavedWord(savedWordObj));
        });
    }

    //remove a word
    const removeSavedWord = (ele, savedWord) => {
        $(ele).parent("li").remove();

        delete savedWords[savedWord];
        localStorage.setItem("savedWords", JSON.stringify(savedWords));
    };

    //inspect a word
    const inspectWord = (word) => {
        alert(word);
    };

    //KEYBOARD SHORTCUTS///////////////////////////////////////////////////////
    var keysPressed = {};

    $("body").on("keydown", (e) => {
        keysPressed[e.key] = true;
        if (iteration === 0) return;

        // pause animations
        if (keysPressed[" "]) {
            $($animatedEls).toggleClass("paused");
            if (settings.sidebarHide === true) $sidebar.toggleClass("hidden");
        }

        //save a word
        if (
            keysPressed.Meta &&
            keysPressed.Alt &&
            !savedWords[currentWordObj.word]
        ) {
            savedWords[currentWordObj.word] = currentWordObj;
            $savedList.append(generateSavedWord(currentWordObj));
            localStorage.setItem("savedWords", JSON.stringify(savedWords));

            $ripple.addClass("active");
            setTimeout(() => $ripple.removeClass("active"), 3000);
            $wordEl.addClass("saved");
        }
    });

    $("body").on("keyup", (e) => {
        delete keysPressed[e.key];
    });
});
