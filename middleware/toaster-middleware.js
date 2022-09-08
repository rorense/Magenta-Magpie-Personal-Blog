function toaster(req, res, next) {

    const toast = req.cookies.toastMessage;

    if (toast !== undefined) {
        res.locals.toastMessage = toast.message;
        res.locals.toastType = toast.type;
        res.clearCookie("toastMessage");
    }

    res.setToastMessage = function (message) {
        res.cookie("toastMessage", message);
    }

    next();
}

module.exports = toaster;