/* =====================================================
   SYSTEM MANAGEMENT
   ADMIN DASHBOARD JAVASCRIPT
===================================================== */


/* =====================================================
   DASHBOARD SECURITY
===================================================== */

(function () {

    const loggedIn =
        localStorage.getItem("loggedIn");

    const role =
        String(
            localStorage.getItem("role") || ""
        )
        .trim()
        .toLowerCase();


    /*
     * Login না করলে Login Page
     */

    if (loggedIn !== "true") {

        window.location.replace("../login.html");

        return;

    }


    /*
     * শুধু Admin Access
     */

    if (
        role !== "admin" &&
        role !== "administrator"
    ) {

        window.location.replace("../login.html");

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

    loadUserInformation();

    displayCurrentDate();

    setupMobileSidebar();

    setupLogout();

}


/* =====================================================
   LOAD USER INFORMATION
===================================================== */

function loadUserInformation() {

    const userName =
        localStorage.getItem("userName") ||
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


    if (sidebarUserName) {

        sidebarUserName.textContent =
            userName;

    }


    if (headerUserName) {

        headerUserName.textContent =
            userName;

    }


    if (welcomeUserName) {

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


    if (!dateElement) {

        return;

    }


    const today =
        new Date();


    const options = {

        weekday: "long",

        year: "numeric",

        month: "long",

        day: "numeric"

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


    /*
     * Create Overlay Automatically
     */

    let sidebarOverlay =
        document.querySelector(
            ".sidebar-overlay"
        );


    if (!sidebarOverlay) {

        sidebarOverlay =
            document.createElement(
                "div"
            );

        sidebarOverlay.className =
            "sidebar-overlay";

        document.body.appendChild(
            sidebarOverlay
        );

    }


    /*
     * Open / Close Sidebar
     */

    menuToggle.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();

            sidebar.classList.toggle(
                "mobile-open"
            );

            sidebarOverlay.classList.toggle(
                "active"
            );

        }
    );


    /*
     * Close Sidebar
     * Overlay Click
     */

    sidebarOverlay.addEventListener(
        "click",
        function () {

            closeMobileSidebar();

        }
    );


    /*
     * Close Sidebar
     * Outside Click
     */

    document.addEventListener(
        "click",
        function (event) {

            if (
                window.innerWidth <= 768
            ) {

                if (
                    !sidebar.contains(
                        event.target
                    ) &&
                    !menuToggle.contains(
                        event.target
                    )
                ) {

                    closeMobileSidebar();

                }

            }

        }
    );


    /*
     * Close Sidebar
     * Navigation Click
     */

    const navItems =
        sidebar.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        function (item) {

            item.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 768
                    ) {

                        closeMobileSidebar();

                    }

                }
            );

        }
    );


    /*
     * Window Resize
     */

    window.addEventListener(
        "resize",
        function () {

            if (
                window.innerWidth > 768
            ) {

                closeMobileSidebar();

            }

        }
    );


    /*
     * Close Function
     */

    function closeMobileSidebar() {

        sidebar.classList.remove(
            "mobile-open"
        );

        sidebarOverlay.classList.remove(
            "active"
        );

    }

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
     * Logout Button
     */

    if (
        logoutButton &&
        logoutModal
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
     * Cancel Logout
     */

    if (
        cancelLogout &&
        logoutModal
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

    if (confirmLogout) {

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

    if (logoutModal) {

        logoutModal.addEventListener(
            "click",
            function (event) {

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


    /*
     * ESC Key
     */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                if (
                    logoutModal
                ) {

                    logoutModal.classList.remove(
                        "active"
                    );

                }

            }

        }
    );

}


/* =====================================================
   PERFORM LOGOUT
===================================================== */

function performLogout() {

    /*
     * Clear Session
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
     * Prevent Cached Dashboard
     */

    sessionStorage.clear();


    /*
     * Redirect Login
     */

    window.location.replace(
        "../login.html"
    );

}


/* =====================================================
   PAGE SECURITY
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
                ) || ""
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
   PREVENT BFCACHE
===================================================== */

window.addEventListener(
    "pagehide",
    function () {

        /*
         * Browser Back/Forward Cache
         * Handling
         */

    }
);


/* =====================================================
   CONSOLE
===================================================== */

console.log(
    "System Management Admin Dashboard Loaded."
);
