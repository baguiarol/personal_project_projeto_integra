const checkIfURLIsImage = url => {
    let string = url.split('.');
    if (string.length > 0) {
        return (string[string.length - 1].toLowerCase() === 'jpg' ||
            string[string.length - 1].toLowerCase() === 'jpeg' ||
            string[string.length - 1].toLowerCase() === 'png');
    } else {
        return false;
    }
}

export {checkIfURLIsImage};