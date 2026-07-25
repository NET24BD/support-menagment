/* =====================================================
   SYSTEM MANAGEMENT
   ADMIN DASHBOARD JAVASCRIPT
===================================================== */


/* =====================================================
   DASHBOARD SECURITY
===================================================== */

(function () {

    const loggedIn =
        localStorage.getItem(
            "loggedIn"
        );

    const role =
        String(
            localStorage.getItem(
                "role"
            ) ||
            ""
        )
        .trim()
        .toLowerCase();


    /*
     * Login না করলে Login Page
     */

    if (
        loggedIn !== "true"
    ) {

        window.location.replace(
            "../login.html"
        );

        return;

    }


    /*
     * শুধু Admin Access
     */

    if (
        role !== "admin" &&
        role !== "administrator"
    ) {

        alert(
            "Access Denied. Administrator access required."
        );


        window.location.replace(
            "../login.html"
        );

        return;

    }

})();


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeDashboard();

    }
);


/* =====================================================
   INITIALIZE DASHBOARD
===================================================== */

function initializeDashboard() {


    /*
     * Load User Information
     */

    loadUserInformation();


    /*
     * Current Date
     */

    displayCurrentDate();


    /*
     * Mobile Sidebar
     */

    setupMobileSidebar();


    /*
     * Logout
     */

    setupLogout();


}


/* =====================================================
   LOAD USER INFORMATION
===================================================== */

function loadUserInformation() {


    const userName =
        localStorage.getItem(
            "userName"
        ) ||
        "Administrator";


    const sidebarUserName =
        document.getElementById(
            "sidebarUserName"
        );


    const headerUserName =
        document.getElementById(
            "headerUserName"
        );


    const welcomeUserName =
        document.getElementById(
            "welcomeUserName"
        );


    if (
        sidebarUserName
    ) {

        sidebarUserName.textContent =
            userName;

    }


    if (
        headerUserName
    ) {

        headerUserName.textContent =
            userName;

    }


    if (
        welcomeUserName
    ) {

        welcomeUserName.textContent =
            userName;

    }

}


/* =====================================================
   CURRENT DATE
===================================================== */

function displayCurrentDate() {


    const dateElement =
        document.getElementById(
            "currentDate"
        );


    if (
        !dateElement
    ) {

        return;

    }


    const today =
        new Date();


    const options = {

        weekday:
            "long",

        year:
            "numeric",

        month:
            "long",

        day:
            "numeric"

    };


    dateElement.textContent =
        today.toLocaleDateString(
            "en-US",
            options
        );

}


/* =====================================================
   MOBILE SIDEBAR
===================================================== */

function setupMobileSidebar() {


    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    if (
        !menuToggle ||
        !sidebar
    ) {

        return;

    }


    menuToggle.addEventListener(
        "click",
        function () {

            sidebar.classList.toggle(
                "open"
            );

        }
    );


    /*
     * Close Sidebar
     * When clicking outside
     */

    document.addEventListener(
        "click",
        function (
            event
        ) {


            if (
                window.innerWidth <= 900
            ) {


                if (
                    !sidebar.contains(
                        event.target
                    ) &&
                    !menuToggle.contains(
                        event.target
                    )
                ) {

                    sidebar.classList.remove(
                        "open"
                    );

                }

            }

        }
    );

}


/* =====================================================
   LOGOUT SETUP
===================================================== */

function setupLogout() {


    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    const logoutModal =
        document.getElementById(
            "logoutModal"
        );


    const cancelLogout =
        document.getElementById(
            "cancelLogout"
        );


    const confirmLogout =
        document.getElementById(
            "confirmLogout"
        );


    /*
     * Open Modal
     */

    if (
        logoutButton
    ) {

        logoutButton.addEventListener(
            "click",
            function () {

                logoutModal.classList.add(
                    "active"
                );

            }
        );

    }


    /*
     * Cancel
     */

    if (
        cancelLogout
    ) {

        cancelLogout.addEventListener(
            "click",
            function () {

                logoutModal.classList.remove(
                    "active"
                );

            }
        );

    }


    /*
     * Confirm Logout
     */

    if (
        confirmLogout
    ) {

        confirmLogout.addEventListener(
            "click",
            function () {

                performLogout();

            }
        );

    }


    /*
     * Click Outside Modal
     */

    if (
        logoutModal
    ) {

        logoutModal.addEventListener(
            "click",
            function (
                event
            ) {


                if (
                    event.target ===
                    logoutModal
                ) {

                    logoutModal.classList.remove(
                        "active"
                    );

                }

            }
        );

    }

}


/* =====================================================
   PERFORM LOGOUT
===================================================== */

function performLogout() {


    /*
     * Clear Login Session
     */

    localStorage.removeItem(
        "loggedIn"
    );


    localStorage.removeItem(
        "userName"
    );


    localStorage.removeItem(
        "username"
    );


    localStorage.removeItem(
        "role"
    );


    localStorage.removeItem(
        "status"
    );


    localStorage.removeItem(
        "loginTime"
    );


    localStorage.removeItem(
        "rememberMe"
    );


    /*
     * Redirect Login
     */

    window.location.replace(
        "../login.html"
    );

}


/* =====================================================
   PREVENT BACK BUTTON AFTER LOGOUT
===================================================== */

window.addEventListener(
    "pageshow",
    function () {


        const loggedIn =
            localStorage.getItem(
                "loggedIn"
            );


        const role =
            String(
                localStorage.getItem(
                    "role"
                ) ||
                ""
            )
            .trim()
            .toLowerCase();


        if (
            loggedIn !== "true" ||
            (
                role !== "admin" &&
                role !== "administrator"
            )
        ) {

            window.location.replace(
                "../login.html"
            );

        }

    }
);


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "System Management Admin Dashboard Loaded."
);
