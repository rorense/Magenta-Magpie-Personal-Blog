window.addEventListener("load", function () {

    // HTML editor config
    const articleContentTextarea = document.querySelector("#article-content-textarea");

    if (articleContentTextarea !== null) {
        tinymce.init({
            selector: "#article-content-textarea",
            height: 500,
            plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste wordcount"
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image",
            content_style: "body { font-family: Verdana, Geneva, sans-serif; font-size:14px }",
            images_upload_url: "/articles/images/upload"
        });
    }

    // Toast Message Notification
    const toastMessageContainer = document.querySelector(".toast-message-container");
    const toastMessage = document.querySelector(".toast-message");
    const closeToastBtn = document.querySelector(".close-toast-btn");

    // Display Toast Message
    if (toastMessage.innerHTML !== "") {
        toastMessageContainer.classList.add("show");
        // After 3.5 seconds, remove the show class from DIV
        setTimeout(function () {
            toastMessageContainer.classList.remove("show");
        }, 3500);
    }

    // Hide Toast Message
    closeToastBtn.addEventListener("click", function () {
        toastMessageContainer.classList.remove("show");
        toastMessageContainer.classList.add("fadeOut");
    });

    // Login Modal
    const loginModal = document.querySelector("#login-modal");
    const signInLink = document.querySelector("#sign-in-link");

    if (loginModal !== null && signInLink != null) {
        signInLink.addEventListener("click", function () {
            loginModal.classList.toggle("display-block");
        });
    }

    //Confirmation Message Modals
    const confirmationModal = document.querySelector("#confirmation-modal");
    const deleteArticleBtn = document.querySelector("#delete-article-btn");
    const deleteUserBtn = document.querySelector("#delete-user-btn");
    const deleteCommentLinks = document.querySelectorAll(".delete-comment-link");
    const commentsConfirmationModals = document.querySelectorAll(".comments-confirmation-modal");

    if (deleteArticleBtn !== null && confirmationModal !== null) {
        deleteArticleBtn.addEventListener("click", function (event) {
            confirmationModal.classList.add("display-block");
        });
    }

    if (deleteUserBtn !== null && confirmationModal !== null) {
        deleteUserBtn.addEventListener("click", function (event) {
            confirmationModal.classList.add("display-block");
        });
    }

    if (deleteCommentLinks.length > 0 && commentsConfirmationModals.length > 0) {
        for (let i = 0; i < deleteCommentLinks.length; i++) {
            deleteCommentLinks[i].addEventListener("click", function (event) {
                commentsConfirmationModals[i].classList.add("display-block");
            });
        }
    }

    // Close modals if user clicked on 'No' button
    const confirmationNoBtn = document.querySelector("#confirmation-no-btn");

    if (confirmationNoBtn != null) {
        confirmationNoBtn.addEventListener("click", function () {
            hideLoginModal();
            hideConfirmationModal();
        });
    }

    const commentsConfirmationNoBtns = document.querySelectorAll(".comments-confirmation-no-btn");

    closeCommentsConfirmationModals(commentsConfirmationNoBtns);

    // Close Modal Button for Login and Confirmation Message
    const closeModalBtn = document.querySelector("#close-modal-btn");

    if (closeModalBtn !== null) {
        closeModalBtn.addEventListener("click", function () {
            hideLoginModal();
            hideConfirmationModal();
        });
    }

    const commentsCloseModalBtns = document.querySelectorAll(".comments-close-modal-btn");

    closeCommentsConfirmationModals(commentsCloseModalBtns);

    function closeCommentsConfirmationModals(list) {
        if (list.length > 0) {
            for(let i = 0; i < list.length; i++) {
                list[i].addEventListener("click", function(){
                    commentsConfirmationModals[i].classList.toggle("display-block");
                })
            }
        }
    }

    // When the user clicks anywhere outside of the modals, close it
    window.addEventListener("click", function (event) {
        if (event.target === loginModal) {
            hideLoginModal();
        }
        if (event.target === confirmationModal) {
            hideConfirmationModal();
        }
    });

    for (let i = 0; i < commentsConfirmationModals.length; i++) {
        const modal = commentsConfirmationModals[i];
        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                modal.classList.toggle("display-block");
            }
        });
    }

    function hideLoginModal() {
        if (loginModal !== null) {
            loginModal.classList.toggle("display-block");
        }
    }

    function hideConfirmationModal() {
        if (confirmationModal !== null) {
            confirmationModal.classList.toggle("display-block");
        }
    }

    // Feature 2 lets the user know if the typed username is taken and will alert them.
    if (window.location.href === "http://localhost:3000/accounts/create") {
        matchUserName();
    }

    // Fetch all existing usernames from database.
    async function matchUserName() {
        let response = await fetch('http://localhost:3000/accounts/checkUsernameExists');
        let users = await response.json();
        AlertMatch(users);
    }

    // Using the JSON array extracted from the username, the function matches the entered username,
    // alerting the user if there is a match.
    function AlertMatch(users) {

        // Timer variable. Checks every second after key is lifted.
        let timer;
        let timeoutVal = 1000;

        const status = document.querySelector("#displayError");
        const txtUsername = document.querySelector("#txtUsername2");

        txtUsername.addEventListener('keypress', handleKeyPress);
        txtUsername.addEventListener('keyup', handleKeyup);

        // Typing status update.
        function handleKeyPress(e) {
            window.clearTimeout(timer);
            status.classList.remove("success");
            status.classList.remove("error");
            status.innerHTML = 'Checking username..';
        }

        // If the username matches existing username, alert is popped up.
        function handleKeyup(e) {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => {
                let found = false;
                const inputValue = e.target.value;

                for (let i = 0; i < users.length; i++) {
                    const jsonItem = users[i];
                    if (jsonItem.username === inputValue) {
                        found = true;
                        status.classList.remove("success");
                        status.classList.add("error");
                        status.innerHTML = `<i class="fa fa-times" aria-hidden="true"></i> This username is taken. Please enter another.`;
                        break;
                    } else {
                        status.classList.remove("error");
                        status.classList.add("success");
                        status.innerHTML = `<i class="fa fa-check" aria-hidden="true"></i> Username is available`;
                    }
                }
            }, timeoutVal);
        }
    }

    const hamburgerBtn = document.querySelector("#navbar-hamburger");
    const submenu = document.querySelector("#subnav");

    hamburgerBtn.addEventListener("click", function (event) {
        event.stopPropagation(); // is used to trigger this function even if you click on the child icon of #navbar-hamburger.a
        submenu.classList.add("show");
        submenu.classList.remove("display-none");
    });

    window.addEventListener("click", function (event) {
        if (!event.target.matches("#navbar-hamburger-button")) {
            submenu.classList.add("display-none");
            submenu.classList.remove("show");
        }
    });

    const commentsList = document.querySelectorAll(".comments-reply-container");

    for (let i = 0; i < commentsList.length; i++) {
        const replyAddLink = commentsList[i].querySelector(".comments-reply-link");
        const replyEditLink = commentsList[i].querySelector(".comments-reply-edit-link");
        const replyFormAdd = commentsList[i].querySelector(".comments-reply-add-form");
        const replyFormEdit = commentsList[i].querySelector(".comments-reply-edit-form");

        if (replyAddLink !== null) {
            replyAddLink.addEventListener("click", function () {
                replyFormAdd.classList.toggle("display-none");
                replyFormEdit.classList.add("display-none");
            });
        }

        if (replyEditLink !== null) {
            replyEditLink.addEventListener("click", function () {
                replyFormEdit.classList.toggle("display-none");
                replyFormAdd.classList.add("display-none");
            });
        }
    }

});