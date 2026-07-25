/* =====================================================
   LINK4 COMMUNICATION
   DASHBOARD JAVASCRIPT
===================================================== */


/* =====================================================
   LOGIN SECURITY
===================================================== */

(function () {

    const loggedIn =
        localStorage.getItem("loggedIn");

    /*
        Login না করা থাকলে
        Dashboard access বন্ধ করে
        login.html এ পাঠানো হবে
    */

    if (loggedIn !== "true") {

        window.location.replace(
            "login.html"
        );

    }

})();


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadUserData();

        setCurrentDate();

        setupSidebar();

        setupLogout();

        setupNotifications();

    }
);


/* =====================================================
   LOAD USER DATA
===================================================== */

function loadUserData() {


    /*
        Login System থেকে User Data নেওয়া হচ্ছে
    */

    const userName =
        localStorage.getItem("userName") ||
        localStorage.getItem("name") ||
        "User";


    const username =
        localStorage.getItem("username") ||
        "—";


    const role =
        localStorage.getItem("role") ||
        "Staff";


    /*
        Welcome User Name
    */

    const welcomeUserName =
        document.getElementById(
            "welcomeUserName"
        );


    if (welcomeUserName) {

        welcomeUserName.textContent =
            userName;

    }


    /*
        Header User Name
    */

    const headerUserName =
        document.getElementById(
            "headerUserName"
        );


    if (headerUserName) {

        headerUserName.textContent =
            userName;

    }


    /*
        Header User Role
    */

    const headerUserRole =
        document.getElementById(
            "headerUserRole"
        );


    if (headerUserRole) {

        headerUserRole.textContent =
            role;

    }


    /*
        Account Name
    */

    const accountName =
        document.getElementById(
            "accountName"
        );


    if (accountName) {

        accountName.textContent =
            userName;

    }


    /*
        Account Username
    */

    const accountUsername =
        document.getElementById(
            "accountUsername"
        );


    if (accountUsername) {

        accountUsername.textContent =
            username;

    }


    /*
        Account Role
    */

    const accountRole =
        document.getElementById(
            "accountRole"
        );


    if (accountRole) {

        accountRole.textContent =
            role;

    }


    /*
        User Avatar
    */

    const userAvatar =
        document.getElementById(
            "userAvatar"
        );


    if (userAvatar) {

        const firstLetter =
            userName
                .trim()
                .charAt(0)
                .toUpperCase();


        userAvatar.textContent =
            firstLetter || "U";

    }

}


/* =====================================================
   CURRENT DATE
===================================================== */

function setCurrentDate() {


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
   SIDEBAR
===================================================== */

function setupSidebar() {


    const menuToggle =
        document.getElementById(
            "menuToggle"
        );


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (
        !menuToggle ||
        !sidebar ||
        !overlay
    ) {

        return;

    }


    /*
        Open Sidebar
    */

    menuToggle.addEventListener(
        "click",
        function () {

            sidebar.classList.add(
                "show"
            );

            overlay.classList.add(
                "show"
            );

            document.body.style.overflow =
                "hidden";

        }
    );


    /*
        Close Sidebar
    */

    overlay.addEventListener(
        "click",
        function () {

            closeSidebar();

        }
    );


    /*
        Mobile Sidebar Link Click
    */

    const navLinks =
        document.querySelectorAll(
            ".nav-link"
        );


    navLinks.forEach(
        function (link) {

            link.addEventListener(
                "click",
                function () {

                    if (
                        window.innerWidth <= 900
                    ) {

                        closeSidebar();

                    }

                }
            );

        }
    );

}


/* =====================================================
   CLOSE SIDEBAR
===================================================== */

function closeSidebar() {


    const sidebar =
        document.getElementById(
            "sidebar"
        );


    const overlay =
        document.getElementById(
            "sidebarOverlay"
        );


    if (sidebar) {

        sidebar.classList.remove(
            "show"
        );

    }


    if (overlay) {

        overlay.classList.remove(
            "show"
        );

    }


    document.body.style.overflow =
        "";

}


/* =====================================================
   WINDOW RESIZE
===================================================== */

window.addEventListener(
    "resize",
    function () {


        if (
            window.innerWidth > 900
        ) {

            closeSidebar();

        }

    }
);


/* =====================================================
   LOGOUT
===================================================== */

function setupLogout() {


    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {

        return;

    }


    logoutBtn.addEventListener(
        "click",
        function () {

            performLogout();

        }
    );

}


/* =====================================================
   PERFORM LOGOUT
===================================================== */

function performLogout() {


    /*
        Login Session Remove
    */

    localStorage.removeItem(
        "loggedIn"
    );


    /*
        User Information Remove
    */

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


    /*
        অন্যান্য Session Data থাকলে
        এখানে Remove করা যাবে
    */


    /*
        Login Page এ Redirect
    */

    window.location.replace(
        "login.html"
    );

}


/* =====================================================
   NOTIFICATION
===================================================== */

function setupNotifications() {


    const notificationBtn =
        document.getElementById(
            "notificationBtn"
        );


    if (!notificationBtn) {

        return;

    }


    notificationBtn.addEventListener(
        "click",
        function () {


            /*
                আপাতত Notification Demo
                পরে Google Sheet থেকে
                Real Notification নেওয়া যাবে
            */


            alert(
                "You have 3 new notifications."
            );


        }
    );

}


/* =====================================================
   PREVENT DASHBOARD AFTER LOGOUT
===================================================== */

window.addEventListener(
    "pageshow",
    function () {


        const loggedIn =
            localStorage.getItem(
                "loggedIn"
            );


        if (
            loggedIn !== "true"
        ) {

            window.location.replace(
                "login.html"
            );

        }

    }
);


/* =====================================================
   BROWSER BACK BUTTON SECURITY
===================================================== */

window.history.pushState(
    null,
    "",
    window.location.href
);


window.addEventListener(
    "popstate",
    function () {


        const loggedIn =
            localStorage.getItem(
                "loggedIn"
            );


        if (
            loggedIn !== "true"
        ) {

            window.location.replace(
                "login.html"
            );

            return;

        }


        window.history.pushState(
            null,
            "",
            window.location.href
        );

    }
);


/* =====================================================
   ACTIVE MENU
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {


        const currentPage =
            window.location.pathname
                .split("/")
                .pop();


        const navLinks =
            document.querySelectorAll(
                ".nav-link"
            );


        navLinks.forEach(
            function (link) {


                const linkPage =
                    link
                        .getAttribute("href")
                        .split("/")
                        .pop();


                if (
                    linkPage === currentPage
                ) {

                    navLinks.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    link.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


/* =====================================================
   DASHBOARD DEMO STATISTICS
===================================================== */

function updateDashboardStats(
    pendingSupport,
    pendingCall,
    completed,
    totalUsers
) {


    const support =
        document.getElementById(
            "pendingSupportCount"
        );


    const call =
        document.getElementById(
            "pendingCallCount"
        );


    const complete =
        document.getElementById(
            "completedCount"
        );


    const users =
        document.getElementById(
            "totalUsersCount"
        );


    if (support) {

        support.textContent =
            pendingSupport;

    }


    if (call) {

        call.textContent =
            pendingCall;

    }


    if (complete) {

        complete.textContent =
            completed;

    }


    if (users) {

        users.textContent =
            totalUsers;

    }

}


/* =====================================================
   INITIAL DEMO DATA
===================================================== */

/*
    এখন Demo হিসেবে 0 দেখাবে।

    পরে Google Apps Script / Google Sheet
    Backend থেকে Real Data এনে এই Function
    ব্যবহার করা যাবে।

    Example:

    updateDashboardStats(
        15,
        8,
        125,
        20
    );
*/


updateDashboardStats(
    0,
    0,
    0,
    0
);


/* =====================================================
   CONSOLE MESSAGE
===================================================== */

console.log(
    "LINK4 Dashboard System Loaded Successfully."
);
