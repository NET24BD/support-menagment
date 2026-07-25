/* =====================================================
   SYSTEM MANAGEMENT
   ROLE BASED LOGIN SYSTEM
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const LOGIN_CONFIG = {

    API_URL:
        "https://script.google.com/macros/s/AKfycbxbgyIg_ddBYIs8qkQvRN3xS3-ZG451C5y_2sNbVFWdWydzb9Mc6qV5CoWB5rjs91ghjQ/exec",

    DEMO_LOGIN: false

};


/* =====================================================
   DASHBOARD PATH
===================================================== */

const DASHBOARDS = {

    admin:
        "https://net24bd.github.io/support-menagment/dashboards/admin-dashboard.html",

    support:
        "https://net24bd.github.io/support-menagment/dashboards/support-dashboard.html",

    call:
        "https://net24bd.github.io/support-menagment/dashboards/call-dashboard.html",

    user:
        "https://net24bd.github.io/support-menagment/dashboards/user-dashboard.html",

    staff:
        "https://net24bd.github.io/support-menagment/dashboards/user-dashboard.html"

};


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeLogin();

    }
);


/* =====================================================
   INITIALIZE LOGIN
===================================================== */

function initializeLogin() {

    /*
     * IMPORTANT:
     * Do NOT automatically redirect from login page
     * just because old localStorage exists.
     *
     * User must explicitly login again if they
     * are currently on login.html.
     */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (!loginForm) {

        console.error(
            "Login form not found."
        );

        return;

    }


    /*
     * Submit Event
     */

    loginForm.addEventListener(
        "submit",
        handleLogin
    );


    /*
     * Password Toggle
     */

    setupPasswordToggle();


    /*
     * Input Listeners
     */

    setupInputListeners();

}


/* =====================================================
   HANDLE LOGIN
===================================================== */

async function handleLogin(
    event
) {

    event.preventDefault();


    /*
     * Get Inputs
     */

    const usernameInput =
        document.getElementById(
            "username"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    const rememberMe =
        document.getElementById(
            "rememberMe"
        );


    /*
     * Validate Elements
     */

    if (
        !usernameInput ||
        !passwordInput
    ) {

        showPopup(
            "Login Error",
            "Login form configuration error.",
            "error"
        );

        return;

    }


    /*
     * Get Values
     */

    const username =
        usernameInput.value.trim();


    const password =
        passwordInput.value.trim();


    /*
     * Validation
     */

    if (
        username === ""
    ) {

        showMessage(
            "Please enter your username.",
            "error"
        );

        usernameInput.focus();

        return;

    }


    if (
        password === ""
    ) {

        showMessage(
            "Please enter your password.",
            "error"
        );

        passwordInput.focus();

        return;

    }


    /*
     * Loading
     */

    setLoginLoading(
        true
    );


    try {


        /*
         * Authenticate User
         */

        const result =
            await authenticateUser(
                username,
                password
            );


        console.log(
            "Login Response:",
            result
        );


        /*
         * Check API Result
         */

        if (
            !result ||
            result.success !== true
        ) {

            throw new Error(
                result &&
                result.message
                    ? result.message
                    : "Invalid username or password."
            );

        }


        /*
         * Create Session
         */

        createLoginSession(
            result,
            rememberMe &&
            rememberMe.checked
        );


    }

    catch (
        error
    ) {

        console.error(
            "Login Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to connect to login server.",
            "error"
        );


        setLoginLoading(
            false
        );

    }

}


/* =====================================================
   AUTHENTICATE USER
===================================================== */

async function authenticateUser(
    username,
    password
) {


    /*
     * API URL Check
     */

    if (
        !LOGIN_CONFIG.API_URL
    ) {

        throw new Error(
            "Login API URL is missing."
        );

    }


    /*
     * Send Request
     */

    const response =
        await fetch(
            LOGIN_CONFIG.API_URL,
            {

                method:
                    "POST",

                headers:
                    {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                body:
                    JSON.stringify({

                        action:
                            "login",

                        username:
                            username,

                        password:
                            password

                    })

            }
        );


    /*
     * Response Check
     */

    if (
        !response.ok
    ) {

        throw new Error(
            "Unable to connect to login server."
        );

    }


    /*
     * Parse JSON
     */

    const result =
        await response.json();


    return result;

}


/* =====================================================
   CREATE LOGIN SESSION
===================================================== */

function createLoginSession(
    userData,
    rememberMe
) {


    /*
     * Normalize Role
     */

    const role =
        String(
            userData.role ||
            "user"
        )
        .trim()
        .toLowerCase();


    /*
     * Normalize Status
     */

    const status =
        String(
            userData.status ||
            "Active"
        )
        .trim();


    /*
     * Save Session
     */

    localStorage.setItem(
        "loggedIn",
        "true"
    );


    /*
     * Save Name
     */

    localStorage.setItem(
        "userName",
        userData.name ||
        "User"
    );


    /*
     * Save Username
     */

    localStorage.setItem(
        "username",
        userData.username ||
        ""
    );


    /*
     * Save Role
     */

    localStorage.setItem(
        "role",
        role
    );


    /*
     * Save Status
     */

    localStorage.setItem(
        "status",
        status
    );


    /*
     * Save Login Time
     */

    localStorage.setItem(
        "loginTime",
        new Date().toISOString()
    );


    /*
     * Remember Me
     */

    localStorage.setItem(
        "rememberMe",
        rememberMe
            ? "true"
            : "false"
    );


    /*
     * Success Message
     */

    showMessage(
        "Login successful. Redirecting...",
        "success"
    );


    /*
     * Redirect After Login
     */

    setTimeout(
        function () {

            redirectByRole();

        },
        700
    );

}


/* =====================================================
   ROLE BASED REDIRECT
===================================================== */

function redirectByRole() {


    /*
     * Get Role
     */

    const role =
        String(
            localStorage.getItem(
                "role"
            ) ||
            "user"
        )
        .trim()
        .toLowerCase();


    /*
     * Get Dashboard
     */

    let dashboard;


    /*
     * ADMIN
     */

    if (
        role === "admin" ||
        role === "administrator"
    ) {

        dashboard =
            DASHBOARDS.admin;

    }


    /*
     * SUPPORT
     */

    else if (
        role === "support"
    ) {

        dashboard =
            DASHBOARDS.support;

    }


    /*
     * CALL
     */

    else if (
        role === "call"
    ) {

        dashboard =
            DASHBOARDS.call;

    }


    /*
     * STAFF
     */

    else if (
        role === "staff"
    ) {

        dashboard =
            DASHBOARDS.staff;

    }


    /*
     * USER
     */

    else {

        dashboard =
            DASHBOARDS.user;

    }


    /*
     * Redirect
     */

    console.log(
        "Redirecting:",
        role,
        "→",
        dashboard
    );


    window.location.replace(
        dashboard
    );

}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

function setupPasswordToggle() {


    /*
     * Your HTML uses:
     * passwordToggle
     */

    const passwordInput =
        document.getElementById(
            "password"
        );


    const toggleButton =
        document.getElementById(
            "passwordToggle"
        );


    const passwordIcon =
        document.getElementById(
            "passwordIcon"
        );


    if (
        !passwordInput ||
        !toggleButton
    ) {

        return;

    }


    toggleButton.addEventListener(
        "click",
        function () {


            if (
                passwordInput.type ===
                "password"
            ) {


                passwordInput.type =
                    "text";


                if (
                    passwordIcon
                ) {

                    passwordIcon.className =
                        "fa-solid fa-eye-slash";

                }


                toggleButton.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }

            else {


                passwordInput.type =
                    "password";


                if (
                    passwordIcon
                ) {

                    passwordIcon.className =
                        "fa-solid fa-eye";

                }


                toggleButton.setAttribute(
                    "aria-label",
                    "Show password"
                );

            }

        }
    );

}


/* =====================================================
   SHOW LOGIN MESSAGE
===================================================== */

function showMessage(
    message,
    type = "error"
) {


    /*
     * Your HTML uses:
     *
     * messageBox
     * messageIcon
     * messageText
     */

    const messageBox =
        document.getElementById(
            "messageBox"
        );


    const messageText =
        document.getElementById(
            "messageText"
        );


    const messageIcon =
        document.getElementById(
            "messageIcon"
        );


    if (
        !messageBox ||
        !messageText
    ) {

        console.log(
            type.toUpperCase() +
            ": " +
            message
        );

        return;

    }


    /*
     * Message Text
     */

    messageText.textContent =
        message;


    /*
     * Show
     */

    messageBox.style.display =
        "flex";


    /*
     * Remove Old Classes
     */

    messageBox.classList.remove(
        "success",
        "error",
        "warning"
    );


    /*
     * Add New Class
     */

    messageBox.classList.add(
        type
    );


    /*
     * Icon
     */

    if (
        messageIcon
    ) {


        if (
            type ===
            "success"
        ) {

            messageIcon.className =
                "fa-solid fa-circle-check";

        }

        else if (
            type ===
            "warning"
        ) {

            messageIcon.className =
                "fa-solid fa-triangle-exclamation";

        }

        else {

            messageIcon.className =
                "fa-solid fa-circle-exclamation";

        }

    }

}


/* =====================================================
   CUSTOM POPUP
===================================================== */

function showPopup(
    title,
    message,
    type = "error"
) {


    const popup =
        document.getElementById(
            "customPopup"
        );


    const popupTitle =
        document.getElementById(
            "popupTitle"
        );


    const popupMessage =
        document.getElementById(
            "popupMessage"
        );


    const popupIcon =
        document.getElementById(
            "popupIconElement"
        );


    const popupButton =
        document.getElementById(
            "popupButton"
        );


    if (
        !popup
    ) {

        return;

    }


    /*
     * Set Content
     */

    if (
        popupTitle
    ) {

        popupTitle.textContent =
            title;

    }


    if (
        popupMessage
    ) {

        popupMessage.textContent =
            message;

    }


    /*
     * Icon
     */

    if (
        popupIcon
    ) {


        if (
            type ===
            "success"
        ) {

            popupIcon.className =
                "fa-solid fa-circle-check";

        }

        else {

            popupIcon.className =
                "fa-solid fa-circle-exclamation";

        }

    }


    /*
     * Show Popup
     */

    popup.classList.add(
        "active"
    );


    /*
     * Close Button
     */

    if (
        popupButton
    ) {

        popupButton.onclick =
            function () {

                popup.classList.remove(
                    "active"
                );

            };

    }

}


/* =====================================================
   INPUT LISTENERS
===================================================== */

function setupInputListeners() {


    const inputs =
        document.querySelectorAll(
            "#loginForm input"
        );


    inputs.forEach(
        function (
            input
        ) {


            input.addEventListener(
                "input",
                function () {


                    const messageBox =
                        document.getElementById(
                            "messageBox"
                        );


                    if (
                        messageBox
                    ) {

                        messageBox.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* =====================================================
   LOGIN BUTTON LOADING
===================================================== */

function setLoginLoading(
    loading
) {


    const loginButton =
        document.getElementById(
            "loginButton"
        );


    const loginButtonText =
        document.getElementById(
            "loginButtonText"
        );


    const loginLoading =
        document.getElementById(
            "loginLoading"
        );


    if (
        !loginButton
    ) {

        return;

    }


    if (
        loading
    ) {


        loginButton.disabled =
            true;


        if (
            loginButtonText
        ) {

            loginButtonText.style.display =
                "none";

        }


        if (
            loginLoading
        ) {

            loginLoading.style.display =
                "inline-flex";

        }

    }

    else {


        loginButton.disabled =
            false;


        if (
            loginButtonText
        ) {

            loginButtonText.style.display =
                "inline-flex";

        }


        if (
            loginLoading
        ) {

            loginLoading.style.display =
                "none";

        }

    }

}


/* =====================================================
   LOGIN PAGE SECURITY
===================================================== */

/*
 * IMPORTANT:
 *
 * We intentionally DO NOT redirect automatically
 * when login.html loads.
 *
 * This prevents the following problem:
 *
 * index.html
 *     ↓
 * login.html
 *     ↓
 * old localStorage
 *     ↓
 * immediately admin dashboard
 *
 * Now login.html will always show the login form.
 */


/* =====================================================
   CLOSE POPUP WHEN CLICKING OVERLAY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const popup =
            document.getElementById(
                "customPopup"
            );


        const overlay =
            popup
                ? popup.querySelector(
                    ".popup-overlay"
                )
                : null;


        if (
            overlay
        ) {

            overlay.addEventListener(
                "click",
                function () {

                    popup.classList.remove(
                        "active"
                    );

                }
            );

        }

    }
);


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "SYSTEM MANAGEMENT Role Based Login System Loaded."
);
