/* =====================================================
   LINK4 COMMUNICATION
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
        "dashboards/admin-dashboard.html",

    support:
        "dashboards/support-dashboard.html",

    call:
        "dashboards/call-dashboard.html",

    user:
        "dashboards/user-dashboard.html",

    staff:
        "dashboards/user-dashboard.html"

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
     * Already Logged In
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


    if (!loginForm) {

        console.error(
            "Login form not found."
        );

        return;

    }


    /*
     * Submit
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
     * Input Listener
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
     * Inputs
     */

    const usernameInput =
        document.getElementById(
            "username"
        );


    const passwordInput =
        document.getElementById(
            "password"
        );


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
     * Values
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
         * Check Result
         */

        if (
            !result.success
        ) {

            throw new Error(
                result.message ||
                "Login failed."
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
            "Unable to login.",
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
     * API Check
     */

    if (
        !LOGIN_CONFIG.API_URL
    ) {

        throw new Error(
            "Login API URL is missing."
        );

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
     * Server Response Check
     */

    if (
        !response.ok
    ) {

        throw new Error(
            "Unable to connect to login server."
        );

    }


    /*
     * JSON
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
     * Save Login Status
     */

    localStorage.setItem(
        "loggedIn",
        "true"
    );


    /*
     * Save User Name
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
        userData.status ||
        "Active"
    );


    /*
     * Login Time
     */

    localStorage.setItem(
        "loginTime",
        new Date().toISOString()
    );


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
        500
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
     * Dashboard
     */

    let dashboard;


    /*
     * Admin
     */

    if (
        role === "admin" ||
        role === "administrator"
    ) {

        dashboard =
            DASHBOARDS.admin;

    }


    /*
     * Support
     */

    else if (
        role === "support"
    ) {

        dashboard =
            DASHBOARDS.support;

    }


    /*
     * Call
     */

    else if (
        role === "call"
    ) {

        dashboard =
            DASHBOARDS.call;

    }


    /*
     * Staff
     */

    else if (
        role === "staff"
    ) {

        dashboard =
            DASHBOARDS.staff;

    }


    /*
     * User
     */

    else {

        dashboard =
            DASHBOARDS.user;

    }


    /*
     * Redirect
     */

    window.location.replace(
        dashboard
    );

}


/* =====================================================
   PASSWORD TOGGLE
===================================================== */

function setupPasswordToggle() {


    const passwordInput =
        document.getElementById(
            "password"
        );


    const toggleButton =
        document.getElementById(
            "togglePassword"
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


                toggleButton.textContent =
                    "🙈";

            }

            else {


                passwordInput.type =
                    "password";


                toggleButton.textContent =
                    "👁️";

            }

        }
    );

}


/* =====================================================
   LOGIN MESSAGE
===================================================== */

function showMessage(
    message,
    type = "error"
) {


    const messageElement =
        document.getElementById(
            "loginMessage"
        );


    if (
        messageElement
    ) {


        messageElement.textContent =
            message;


        messageElement.className =
            "login-message " +
            type;


        messageElement.style.display =
            "block";


    }

    else {


        console.log(
            type.toUpperCase() +
            ": " +
            message
        );

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


                    const messageElement =
                        document.getElementById(
                            "loginMessage"
                        );


                    if (
                        messageElement
                    ) {

                        messageElement.style.display =
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
        document.querySelector(
            "#loginForm button[type='submit']"
        );


    if (
        !loginButton
    ) {

        return;

    }


    if (
        loading
    ) {


        if (
            !loginButton.dataset.originalText
        ) {

            loginButton.dataset.originalText =
                loginButton.textContent;

        }


        loginButton.disabled =
            true;


        loginButton.textContent =
            "Signing in...";

    }

    else {


        loginButton.disabled =
            false;


        loginButton.textContent =
            loginButton.dataset.originalText ||
            "Login";

    }

}


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
   CONSOLE
===================================================== */

console.log(
    "LINK4 Role Based Login System Loaded."
);
