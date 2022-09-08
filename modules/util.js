function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getArrayOfRandomIntegers(min, max, size) {

    let randInt = min;
    let randIntArray = [];
    let i = 0;

    while (i < size) {

        randInt = this.getRandomIntInclusive(min, max);

        if (randIntArray.indexOf(randInt) < 0) {
            randIntArray.push(randInt);
        } else {
            while (randIntArray.indexOf(randInt) >= 0) {
                randInt = this.getRandomIntInclusive(min, max);
            }
            randIntArray.push(randInt);
        }

        i++;
    }

    return randIntArray;
}

module.exports = {
    getRandomInt,
    getRandomIntInclusive,
    getArrayOfRandomIntegers
};