/* =====================================================
   LINK4 COMMUNICATION
   LOGIN SYSTEM JAVASCRIPT
===================================================== */


/* =====================================================
   GOOGLE APPS SCRIPT API URL
   এখানে তোমার Google Apps Script Web App URL বসাও
===================================================== */

const API_URL =
"https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec";


/* =====================================================
   ELEMENTS
===================================================== */

const loginForm =
document.getElementById("loginForm");

const usernameInput =
document.getElementById("username");

const passwordInput =
document.getElementById("password");

const loginButton =
document.getElementById("loginButton");

const loginMessage =
document.getElementById("loginMessage");

const togglePassword =
document.getElementById("togglePassword");


/* =====================================================
   PASSWORD SHOW / HIDE
===================================================== */

if (togglePassword) {

    togglePassword.addEventListener(
        "click",
        function () {

            if (
                passwordInput.type === "password"
            ) {

                passwordInput.type =
                    "text";

                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

            } else {

                passwordInput.type =
                    "password";

                togglePassword.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

            }

        }
    );

}


/* =====================================================
   SHOW MESSAGE
===================================================== */

function showMessage(
    message,
    type = "error"
) {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        message;

    loginMessage.className =
        "login-message show " +
        type;

}


/* =====================================================
   HIDE MESSAGE
===================================================== */

function hideMessage() {

    if (!loginMessage) {
        return;
    }

    loginMessage.textContent =
        "";

    loginMessage.className =
        "login-message";

}


/* =====================================================
   BUTTON LOADING
===================================================== */

function setLoading(
    loading
) {

    if (!loginButton) {
        return;
    }


    if (loading) {

        loginButton.disabled =
            true;

        loginButton.innerHTML =

        `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Signing In...
        `;

    } else {

        loginButton.disabled =
            false;

        loginButton.innerHTML =

        `
        <i class="fa-solid fa-right-to-bracket"></i>
        Sign In
        `;

    }

}


/* =====================================================
   SAVE LOGIN SESSION
===================================================== */

function saveLoginSession(
    user
) {

    localStorage.setItem(
        "loggedIn",
        "true"
    );


    localStorage.setItem(
        "username",
        user.username || ""
    );


    localStorage.setItem(
        "name",
        user.name ||
        user.username ||
        ""
    );


    localStorage.setItem(
        "role",
        user.role ||
        ""
    );


    localStorage.setItem(
        "status",
        user.status ||
        ""
    );

}


/* =====================================================
   LOGIN SUCCESS
===================================================== */

function loginSuccess(
    user
) {

    saveLoginSession(
        user
    );


    /*
      Dashboard page এখানে সেট করো
      যদি dashboard.html হয় তাহলে:
      dashboard.html
    */

    window.location.replace(
        "dashboard.html"
    );

}


/* =====================================================
   LOGIN FORM SUBMIT
===================================================== */

if (loginForm) {

    loginForm.addEventListener(

        "submit",

        async function (event) {

            event.preventDefault();


            hideMessage();


            const username =
                usernameInput.value.trim();


            const password =
                passwordInput.value;


            /* ================================
               BASIC VALIDATION
            ================================= */

            if (!username) {

                showMessage(
                    "Please enter your username."
                );

                usernameInput.focus();

                return;

            }


            if (!password) {

                showMessage(
                    "Please enter your password."
                );

                passwordInput.focus();

                return;

            }


            setLoading(
                true
            );


            try {

                /*
                  Google Apps Script API
                  Login Request
                */

                const url =

                    API_URL +

                    "?action=login" +

                    "&username=" +

                    encodeURIComponent(
                        username
                    ) +

                    "&password=" +

                    encodeURIComponent(
                        password
                    ) +

                    "&t=" +

                    Date.now();


                const response =
                    await fetch(
                        url,
                        {
                            method:
                                "GET",

                            cache:
                                "no-store"
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        "Server error. Please try again."
                    );

                }


                const result =
                    await response.json();


                /* ================================
                   LOGIN FAILED
                ================================= */

                if (
                    !result.success
                ) {

                    throw new Error(

                        result.message ||

                        "Invalid username or password."

                    );

                }


                /* ================================
                   USER DATA
                ================================= */

                const user =

                    result.user ||

                    {

                        username:
                            username,

                        name:
                            username,

                        role:
                            "",

                        status:
                            "active"

                    };


                /* ================================
                   STATUS CHECK
                ================================= */

                const status =

                    String(
                        user.status ||
                        "active"
                    )
                    .toLowerCase()
                    .trim();


                if (
                    status === "blocked" ||
                    status === "inactive"
                ) {

                    throw new Error(
                        "Your account is currently " +
                        status +
                        ". Please contact administrator."
                    );

                }


                /* ================================
                   SUCCESS
                ================================= */

                showMessage(
                    "Login successful. Redirecting...",
                    "success"
                );


                setTimeout(

                    function () {

                        loginSuccess(
                            user
                        );

                    },

                    500

                );


            }

            catch (error) {

                console.error(
                    "Login Error:",
                    error
                );


                showMessage(

                    error.message ||

                    "Unable to login. Please try again."

                );


                setLoading(
                    false
                );

            }

        }

    );

}


/* =====================================================
   ENTER KEY SUPPORT
===================================================== */

if (usernameInput) {

    usernameInput.addEventListener(

        "keydown",

        function (event) {

            if (
                event.key === "Enter"
            ) {

                passwordInput.focus();

            }

        }

    );

}


/* =====================================================
   AUTO FOCUS
===================================================== */

window.addEventListener(

    "DOMContentLoaded",

    function () {

        if (usernameInput) {

            usernameInput.focus();

        }

    }

);


/* =====================================================
   PREVENT BACK TO LOGIN
   IF ALREADY LOGGED IN
===================================================== */

(function checkExistingLogin() {

    const loggedIn =
        localStorage.getItem(
            "loggedIn"
        );


    if (
        loggedIn === "true"
    ) {

        /*
          চাইলে এখানে dashboard.html
          redirect চালু রাখতে পারো।

          আপাতত বন্ধ রাখা হয়েছে,
          যাতে login page সবসময় খোলা যায়।
        */

        // window.location.replace("dashboard.html");

    }

})();
