export const arrayShuffler = (array) => {
    let i;
    for (i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
};

export const arrayUnique = (array) => {
    let seenWords = {};

    return array.filter((wordObj) => {
        var word = wordObj.word;
        if (seenWords[word]) {
            console.log(word);
            return false;
        } else {
            seenWords[word] = word;
            return true;
        }
    });
};
