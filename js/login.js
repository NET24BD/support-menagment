/* =====================================================
   LINK4 COMMUNICATION
   LOGIN JAVASCRIPT
===================================================== */


/* =====================================================
   CONFIGURATION
===================================================== */

const LOGIN_CONFIG = {

    /*
        আপনার Google Apps Script Web App URL এখানে দিন।

        Example:

        API_URL:
        "https://script.google.com/macros/s/XXXXXXXX/exec"

        Backend ব্যবহার না করলে
        নিচে DEMO_LOGIN = true রাখুন।
    */

    API_URL: "",

    /*
        Demo Login

        true  = Demo Login ব্যবহার করবে
        false = Google Apps Script API ব্যবহার করবে
    */

    DEMO_LOGIN: true

};


/* =====================================================
   DOM ELEMENTS
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
        যদি User আগে থেকেই Login করা থাকে
        তাহলে সরাসরি Dashboard এ যাবে
    */

    const loggedIn =
        localStorage.getItem(
            "loggedIn"
        );


    if (
        loggedIn === "true"
    ) {

        window.location.replace(
            "dashboard.html"
        );

        return;

    }


    /*
        Login Form
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
        Form Submit
    */

    loginForm.addEventListener(
        "submit",
        handleLogin
    );


    /*
        Password Show / Hide
    */

    setupPasswordToggle();


    /*
        Clear Error Message
        যখন User আবার Input করবে
    */

    setupInputListeners();

}


/* =====================================================
   HANDLE LOGIN
===================================================== */

async function handleLogin(event) {


    /*
        Page Reload বন্ধ করা
    */

    event.preventDefault();


    /*
        Input Elements
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
        Input Value
    */

    const username =
        usernameInput.value.trim();


    const password =
        passwordInput.value.trim();


    /*
        Empty Validation
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
        Loading State
    */

    setLoginLoading(
        true
    );


    try {


        /*
            DEMO LOGIN
        */

        if (
            LOGIN_CONFIG.DEMO_LOGIN === true
        ) {

            await demoLogin(
                username,
                password
            );

        }


        /*
            GOOGLE APPS SCRIPT LOGIN
        */

        else {

            await authenticateUser(
                username,
                password
            );

        }


    }

    catch (error) {


        console.error(
            "Login Error:",
            error
        );


        showMessage(
            error.message ||
            "Login failed. Please try again.",
            "error"
        );


        setLoginLoading(
            false
        );

    }

}


/* =====================================================
   DEMO LOGIN
===================================================== */

function demoLogin(
    username,
    password
) {


    return new Promise(
        function (
            resolve,
            reject
        ) {


            setTimeout(
                function () {


                    /*
                        Demo Username / Password

                        Username:
                        admin

                        Password:
                        123456

                        পরে এগুলো Remove করে
                        Google Sheet Login ব্যবহার করবেন।
                    */


                    if (
                        username === "admin" &&
                        password === "123456"
                    ) {


                        /*
                            Login Session
                        */

                        createLoginSession({

                            userName:
                                "Administrator",

                            username:
                                username,

                            role:
                                "Administrator"

                        });


                        resolve();

                    }

                    else {


                        reject(
                            new Error(
                                "Invalid username or password."
                            )
                        );

                    }


                },
                700
            );

        }
    );

}


/* =====================================================
   GOOGLE APPS SCRIPT AUTHENTICATION
===================================================== */

async function authenticateUser(
    username,
    password
) {


    /*
        API URL Check
    */

    if (
        !LOGIN_CONFIG.API_URL
    ) {

        throw new Error(
            "Login API URL is not configured."
        );

    }


    /*
        Google Apps Script API Request
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
                            "application/json"
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
        Response Check
    */

    if (
        !response.ok
    ) {

        throw new Error(
            "Unable to connect to login server."
        );

    }


    /*
        JSON Response
    */

    const result =
        await response.json();


    /*
        Login Failed
    */

    if (
        !result.success
    ) {

        throw new Error(
            result.message ||
            "Invalid username or password."
        );

    }


    /*
        Login Successful
    */

    createLoginSession({

        userName:
            result.name ||
            result.userName ||
            username,

        username:
            result.username ||
            username,

        role:
            result.role ||
            "Staff"

    });

}


/* =====================================================
   CREATE LOGIN SESSION
===================================================== */

function createLoginSession(
    userData
) {


    /*
        Login Status
    */

    localStorage.setItem(
        "loggedIn",
        "true"
    );


    /*
        User Name
    */

    localStorage.setItem(
        "userName",
        userData.userName
    );


    /*
        Username
    */

    localStorage.setItem(
        "username",
        userData.username
    );


    /*
        Role
    */

    localStorage.setItem(
        "role",
        userData.role
    );


    /*
        Login Time

        Future session management এর জন্য
    */

    localStorage.setItem(
        "loginTime",
        new Date().toISOString()
    );


    /*
        Dashboard Redirect
    */

    showMessage(
        "Login successful. Redirecting...",
        "success"
    );


    setTimeout(
        function () {

            window.location.replace(
                "dashboard.html"
            );

        },
        500
    );

}


/* =====================================================
   PASSWORD SHOW / HIDE
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


    /*
        যদি HTML এ Toggle Button না থাকে
        তাহলে Function বন্ধ থাকবে
    */

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


    /*
        HTML এ নিচের Element থাকলে
        সেখানে Message দেখাবে:

        <div id="loginMessage"></div>
    */

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


        return;

    }


    /*
        Login Message Element না থাকলে
        Console এ দেখাবে
    */

    console.log(
        type.toUpperCase() +
        ": " +
        message
    );

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
        function (input) {


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


        /*
            Original Button Text
            Save করে রাখা
        */

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
   LOGOUT SESSION CLEANUP
===================================================== */

function clearLoginSession() {


    localStorage.removeItem(
        "loggedIn"
    );


    localStorage.removeItem(
        "userName"
    );


    localStorage.removeItem(
        "name"
    );


    localStorage.removeItem(
        "username"
    );


    localStorage.removeItem(
        "role"
    );


    localStorage.removeItem(
        "loginTime"
    );

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


        /*
            Login করা থাকলে
            Login Page এ থাকার দরকার নেই
        */

        if (
            loggedIn === "true"
        ) {

            window.location.replace(
                "dashboard.html"
            );

        }

    }
);


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "LINK4 Login System Loaded Successfully."
);
