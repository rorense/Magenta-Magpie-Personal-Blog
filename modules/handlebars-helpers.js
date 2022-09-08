function ifEquals(value1, value2, options) {
    if (String(value1) === String(value2)) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function ifNotEquals(value1, value2, options) {
    if (String(value1) !== String(value2)) {
        return options.fn(this);
    }
    return options.inverse(this);
}

function setTargetUrl(path, pageNumber, anchor) {

    const includesQueryParameterInPath = (path.includes("?") && path.includes("="));

    let targetUrl;
    if (includesQueryParameterInPath) {
        targetUrl = `${path}&page=${pageNumber}`;
    } else {
        targetUrl = `${path}?page=${pageNumber}`;
    }

    if (anchor !== null) {
        targetUrl = `${targetUrl}#${anchor}`;
    }

    return targetUrl;
}

module.exports = {
    ifEquals,
    ifNotEquals,
    setTargetUrl
};