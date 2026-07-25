/* =====================================================
   SYSTEM MANAGEMENT
   ROLE BASED LOGIN SYSTEM
   FILE: js/login.js
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
   DASHBOARD URL
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
     * Already Logged In Check
     */

    const loggedIn =
        localStorage.getItem(
            "loggedIn"
        );


    if (
        loggedIn === "true"
    ) {

        redirectByRole();

        return;

    }


    /*
     * Login Form
     */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (
        !loginForm
    ) {

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
     * Get Input
     */

    const usernameInput =
        document.getElementById(
            "username"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


    /*
     * Check Input
     */

    if (
        !usernameInput ||
        !passwordInput
    ) {

        showMessage(
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
         * Authenticate
         */

        const result =
            await authenticateUser(
                username,
                password
            );


        /*
         * Login Failed
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
            result
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
            "Unable to login. Please try again.",
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
     * Demo Login Disabled
     */

    if (
        LOGIN_CONFIG.DEMO_LOGIN === true
    ) {

        return {

            success:
                true,

            username:
                username,

            name:
                "Demo User",

            role:
                "admin",

            status:
                "Active"

        };

    }


    /*
     * API Request
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
     * Server Error
     */

    if (
        !response.ok
    ) {

        throw new Error(
            "Unable to connect to login server."
        );

    }


    /*
     * Get JSON
     */

    const result =
        await response.json();


    return result;

}


/* =====================================================
   CREATE LOGIN SESSION
===================================================== */

function createLoginSession(
    userData
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
     * Check Account Status
     */

    const blockedStatuses = [

        "blocked",

        "inactive",

        "disabled",

        "suspended"

    ];


    if (
        blockedStatuses.includes(
            status.toLowerCase()
        )
    ) {

        showMessage(
            "Your account is " +
            status +
            ". Please contact administrator.",
            "error"
        );

        setLoginLoading(
            false
        );

        return;

    }


    /*
     * Save Login Status
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
     * Login Time
     */

    localStorage.setItem(
        "loginTime",
        new Date().toISOString()
    );


    /*
     * Remember Me
     */

    const rememberMe =
        document.getElementById(
            "rememberMe"
        );


    if (
        rememberMe &&
        rememberMe.checked
    ) {

        localStorage.setItem(
            "rememberMe",
            "true"
        );

    }

    else {

        localStorage.setItem(
            "rememberMe",
            "false"
        );

    }


    /*
     * Success Message
     */

    showMessage(
        "Login successful. Redirecting...",
        "success"
    );


    /*
     * Redirect
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
     * Dashboard Variable
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
     * Final Redirect
     */

    window.location.replace(
        dashboard
    );

}


/* =====================================================
   PASSWORD TOGGLE
   FIXED FOR YOUR LOGIN.HTML
===================================================== */

function setupPasswordToggle() {


    /*
     * Password Input
     */

    const passwordInput =
        document.getElementById(
            "password"
        );


    /*
     * Toggle Button
     * Your HTML ID:
     * passwordToggle
     */

    const toggleButton =
        document.getElementById(
            "passwordToggle"
        );


    /*
     * Password Icon
     * Your HTML ID:
     * passwordIcon
     */

    const passwordIcon =
        document.getElementById(
            "passwordIcon"
        );


    /*
     * Check Elements
     */

    if (
        !passwordInput ||
        !toggleButton
    ) {

        return;

    }


    /*
     * Click
     */

    toggleButton.addEventListener(
        "click",
        function () {


            if (
                passwordInput.type ===
                "password"
            ) {


                /*
                 * Show Password
                 */

                passwordInput.type =
                    "text";


                /*
                 * Change Icon
                 */

                if (
                    passwordIcon
                ) {

                    passwordIcon.classList.remove(
                        "fa-eye"
                    );

                    passwordIcon.classList.add(
                        "fa-eye-slash"
                    );

                }


                toggleButton.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            }

            else {


                /*
                 * Hide Password
                 */

                passwordInput.type =
                    "password";


                /*
                 * Change Icon
                 */

                if (
                    passwordIcon
                ) {

                    passwordIcon.classList.remove(
                        "fa-eye-slash"
                    );

                    passwordIcon.classList.add(
                        "fa-eye"
                    );

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
   WORKS WITH YOUR HTML
===================================================== */

function showMessage(
    message,
    type = "error"
) {


    /*
     * Message Box
     */

    const messageBox =
        document.getElementById(
            "messageBox"
        );


    /*
     * Message Text
     */

    const messageText =
        document.getElementById(
            "messageText"
        );


    /*
     * Message Icon
     */

    const messageIcon =
        document.getElementById(
            "messageIcon"
        );


    /*
     * Check
     */

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
     * Set Text
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
        "warning",
        "info"
    );


    /*
     * Add New Class
     */

    messageBox.classList.add(
        type
    );


    /*
     * Change Icon
     */

    if (
        messageIcon
    ) {


        messageIcon.className =
            "fa-solid";


        if (
            type === "success"
        ) {

            messageIcon.classList.add(
                "fa-circle-check"
            );

        }

        else if (
            type === "error"
        ) {

            messageIcon.classList.add(
                "fa-circle-xmark"
            );

        }

        else if (
            type === "warning"
        ) {

            messageIcon.classList.add(
                "fa-triangle-exclamation"
            );

        }

        else {

            messageIcon.classList.add(
                "fa-circle-info"
            );

        }

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
   WORKS WITH YOUR HTML
===================================================== */

function setLoginLoading(
    loading
) {


    /*
     * Login Button
     */

    const loginButton =
        document.getElementById(
            "loginButton"
        );


    /*
     * Normal Text
     */

    const loginButtonText =
        document.getElementById(
            "loginButtonText"
        );


    /*
     * Loading Text
     */

    const loginLoading =
        document.getElementById(
            "loginLoading"
        );


    /*
     * Check
     */

    if (
        !loginButton
    ) {

        return;

    }


    if (
        loading
    ) {


        /*
         * Disable
         */

        loginButton.disabled =
            true;


        /*
         * Normal Text Hide
         */

        if (
            loginButtonText
        ) {

            loginButtonText.style.display =
                "none";

        }


        /*
         * Loading Show
         */

        if (
            loginLoading
        ) {

            loginLoading.style.display =
                "inline-flex";

        }

    }

    else {


        /*
         * Enable
         */

        loginButton.disabled =
            false;


        /*
         * Normal Text Show
         */

        if (
            loginButtonText
        ) {

            loginButtonText.style.display =
                "inline-flex";

        }


        /*
         * Loading Hide
         */

        if (
            loginLoading
        ) {

            loginLoading.style.display =
                "none";

        }

    }

}


/* =====================================================
   CUSTOM POPUP
   OPTIONAL
===================================================== */

function showPopup(
    title,
    message,
    type = "info"
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


    const popupIconElement =
        document.getElementById(
            "popupIconElement"
        );


    if (
        !popup
    ) {

        return;

    }


    /*
     * Title
     */

    if (
        popupTitle
    ) {

        popupTitle.textContent =
            title;

    }


    /*
     * Message
     */

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
        popupIconElement
    ) {


        popupIconElement.className =
            "fa-solid";


        if (
            type === "success"
        ) {

            popupIconElement.classList.add(
                "fa-circle-check"
            );

        }

        else if (
            type === "error"
        ) {

            popupIconElement.classList.add(
                "fa-circle-xmark"
            );

        }

        else if (
            type === "warning"
        ) {

            popupIconElement.classList.add(
                "fa-triangle-exclamation"
            );

        }

        else {

            popupIconElement.classList.add(
                "fa-circle-info"
            );

        }

    }


    /*
     * Show Popup
     */

    popup.classList.add(
        "active"
    );


}


/* =====================================================
   CLOSE CUSTOM POPUP
===================================================== */

function closePopup() {


    const popup =
        document.getElementById(
            "customPopup"
        );


    if (
        popup
    ) {

        popup.classList.remove(
            "active"
        );

    }

}


/* =====================================================
   POPUP BUTTON
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const popupButton =
            document.getElementById(
                "popupButton"
            );


        if (
            popupButton
        ) {

            popupButton.addEventListener(
                "click",
                closePopup
            );

        }

    }
);


/* =====================================================
   LOGIN PAGE SECURITY
===================================================== */

window.addEventListener(
    "pageshow",
    function () {


        const loggedIn =
            localStorage.getItem(
                "loggedIn"
            );


        if (
            loggedIn === "true"
        ) {

            redirectByRole();

        }

    }
);


/* =====================================================
   PREVENT LOGIN PAGE CACHE
===================================================== */

window.addEventListener(
    "pagehide",
    function () {

        console.log(
            "Leaving login page."
        );

    }
);


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "System Management Role Based Login System Loaded Successfully."
);
