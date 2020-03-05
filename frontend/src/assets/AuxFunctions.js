const checkIfURLIsImage = url => {
    let string = url.split('.');
    if (string.length > 0) {
        return (string[string.length - 1].toLowerCase() === 'jpg' ||
            string[string.length - 1].toLowerCase() === 'jpeg' ||
            string[string.length - 1].toLowerCase() === 'gif' ||
            string[string.length - 1].toLowerCase() === 'png');
    } else {
        return false;
    }
};

const transformStringToReais = string => {
    if (typeof string == 'number') {
        string = string.toFixed(2);
    }
    string = 'R$ ' + string;
    if (string.includes('.') || string.includes(',')) {
        string = string.replace('.', ',');
    } else {
        string = string + ',00';
    }
    return string;
};

const transformReaisToFloat = string => {
    string = string.replace(',', '.');
    string = string.replace('R$ ', '');
    return Number(string);
};

const numberIsBetween = (number, start, end) => {
    return (number >= start) && (number < end);
}

const numberToHours = number => {
    return number+":00";
}

const removeElementFromArray = (arr, value) => {
    const filter = (arrayValue) => {
        return arrayValue !== value;
    }
    return arr.filter(filter);
};

const findInArrayAndReturnIndex = (arr, key) => {
    for (let i = 0; i < arr.length; i++)
        if (arr[i] === key)
            return i
}

const sendToTopArray = (arr, key) => {
    let first = key;
    arr.sort(function(x,y){ return x === first ? -1 : y === first ? 1 : 0; });
}

export {checkIfURLIsImage,
    removeElementFromArray,
    transformStringToReais,
    transformReaisToFloat,
    numberIsBetween,
    numberToHours};