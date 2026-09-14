// Current logged-in user
const currentUser = JSON.parse(
    localStorage.getItem("campusLoggedInUser")
);


// Create a separate storage key for each student
function getIssuesKey() {

    return `campusIssues_${currentUser.studentId}`;

}

// Migrate old issues to the current student's storage

function migrateOldIssues() {

    const oldIssues = localStorage.getItem("campusIssues");

    if (!oldIssues) {
        return;
    }


    const newKey = getIssuesKey();


    // Only migrate if this student doesn't already have issues

    if (!localStorage.getItem(newKey)) {

        localStorage.setItem(newKey, oldIssues);

    }


    // Remove old global storage

    localStorage.removeItem("campusIssues");

}

migrateOldIssues();


const reportBtn = document.getElementById("reportBtn");
const reportModal = document.getElementById("reportModal");
const closeModal = document.getElementById("closeModal");
const issueForm = document.getElementById("issueForm");

const issuesContainer = document.getElementById("issuesContainer");

const totalIssues = document.getElementById("totalIssues");
const activeIssues = document.getElementById("activeIssues");
const resolvedIssues = document.getElementById("resolvedIssues");


// ==========================================
// GET SAVED ISSUES
// ==========================================

function getIssues() {

    const savedIssues = localStorage.getItem(
        getIssuesKey()
    );

    if (savedIssues) {
        return JSON.parse(savedIssues);
    }

    return [];
}


// ==========================================
// SAVE ISSUES
// ==========================================

function saveIssues(issues) {

    localStorage.setItem(
        getIssuesKey(),
        JSON.stringify(issues)
    );
}


// ==========================================
// OPEN REPORT MODAL
// ==========================================

reportBtn.addEventListener("click", function () {

    reportModal.classList.remove("hidden");

});


// ==========================================
// CLOSE REPORT MODAL
// ==========================================

closeModal.addEventListener("click", function () {

    reportModal.classList.add("hidden");

});


// Close modal when clicking outside

reportModal.addEventListener("click", function (event) {

    if (event.target === reportModal) {

        reportModal.classList.add("hidden");

    }

});


// ==========================================
// DISPLAY ISSUES
// ==========================================

function displayIssues() {

    const issues = getIssues();

    issuesContainer.innerHTML = "";


    if (issues.length === 0) {

        issuesContainer.innerHTML = `
            <div class="empty-state">
                <p>No issues reported yet.</p>

                <small>
                    Report an issue when you find something
                    that needs attention.
                </small>
            </div>
        `;

        updateStatistics(issues);

        return;
    }


    issues.forEach(function (issue) {

        const issueCard = document.createElement("article");

        issueCard.className = "issue-card";


        issueCard.innerHTML = `

            <div class="issue-top">

                <span class="issue-category">
                    ${issue.category}
                </span>

                <span class="status ${getStatusClass(issue.status)}">
                    ${issue.status}
                </span>

            </div>


            <h3>
                ${issue.title}
            </h3>


            <p class="location">
                📍 ${issue.location}
            </p>


            <div class="issue-bottom">

                <span>
                    Issue #${issue.id}
                </span>

                <span>
                    ${issue.date}
                </span>

            </div>

        `;


        // Make card clickable

        issueCard.addEventListener("click", function () {

            openIssueDetails(issue);

        });


        issuesContainer.appendChild(issueCard);

    });


    updateStatistics(issues);

}


// ==========================================
// STATUS CLASS
// ==========================================

function getStatusClass(status) {

    if (status === "Pending") {
        return "pending";
    }

    if (status === "In Progress") {
        return "in-progress";
    }

    if (status === "Resolved") {
        return "resolved";
    }

    return "";
}


// ==========================================
// UPDATE STATISTICS
// ==========================================

function updateStatistics(issues) {

    const total = issues.length;

    const active = issues.filter(function (issue) {

        return issue.status !== "Resolved";

    }).length;


    const resolved = issues.filter(function (issue) {

        return issue.status === "Resolved";

    }).length;


    totalIssues.textContent = total;
    activeIssues.textContent = active;
    resolvedIssues.textContent = resolved;

}


// ==========================================
// SUBMIT ISSUE
// ==========================================

issueForm.addEventListener("submit", async function (event) {

    event.preventDefault();


    const category =
        document.getElementById("category").value;

    const location =
        document.getElementById("location").value.trim();

    const title =
        document.getElementById("title").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const priority =
        document.getElementById("priority").value;


    try {

        const response = await fetch(
            "http://localhost:5000/api/issues",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({

                    studentId: currentUser.student_id,

                    category: category,

                    location: location,

                    title: title,

                    description: description,

                    priority: priority

                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);
            return;

        }


        // Issue successfully saved in PostgreSQL

        const savedIssue = data.issue;


        // Convert database date into the format
        // the existing UI already expects

        savedIssue.date =
            new Date(savedIssue.created_at)
                .toLocaleDateString("en-IN");


        // Add the new issue temporarily to the
        // existing UI

        const issues = getIssues();

        issues.unshift(savedIssue);

        saveIssues(issues);


        // Update UI

        displayIssues();


        // Reset form

        issueForm.reset();


        // Close modal

        reportModal.classList.add("hidden");


        // Success message

        alert("Issue submitted successfully!");


    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});


// ==========================================
// LOAD ISSUES WHEN PAGE OPENS
// ==========================================

displayIssues();

// ==========================================
// COMPLAINT DETAILS
// ==========================================

const detailsModal =
    document.getElementById("detailsModal");

const closeDetails =
    document.getElementById("closeDetails");


function openIssueDetails(issue) {

    document.getElementById("detailsTitle").textContent =
        issue.title;


    const statusElement =
        document.getElementById("detailsStatus");

    statusElement.textContent =
        issue.status;

    statusElement.className =
        "status " + getStatusClass(issue.status);


    document.getElementById("detailsPriority").textContent =
        issue.priority + " Priority";


    document.getElementById("detailsId").textContent =
        "#" + issue.id;


    document.getElementById("detailsLocation").textContent =
        "📍 " + issue.location;


    document.getElementById("detailsCategory").textContent =
        issue.category;


    document.getElementById("detailsDate").textContent =
        issue.date;


    document.getElementById("detailsDescription").textContent =
        issue.description;


    detailsModal.classList.remove("hidden");

}


// Close details

closeDetails.addEventListener("click", function () {

    detailsModal.classList.add("hidden");

});


// Close when clicking outside

detailsModal.addEventListener("click", function (event) {

    if (event.target === detailsModal) {

        detailsModal.classList.add("hidden");

    }

});

// Profile

const profileBtn = document.querySelector(".profile-btn");
const profileModal = document.getElementById("profileModal");
const closeProfile = document.getElementById("closeProfile");

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileStudentId = document.getElementById("profileStudentId");
const profileCollegeEmail = document.getElementById("profileCollegeEmail");
const profileAvatar = document.getElementById("profileAvatar");

const homeProfileAvatar =
    document.getElementById("homeProfileAvatar");


// Set Home Profile Avatar
if (currentUser && homeProfileAvatar) {

    homeProfileAvatar.textContent =
        currentUser.name.charAt(0).toUpperCase();

}


// Open Profile
profileBtn.addEventListener("click", () => {

    const loggedInUser = JSON.parse(
        localStorage.getItem("campusLoggedInUser")
    );

    if (!loggedInUser) {
        window.location.href = "auth/login.html";
        return;
    }


    // Show exact signup information
    profileName.textContent = loggedInUser.name;

    profileEmail.textContent = loggedInUser.email;

    profileStudentId.textContent = loggedInUser.studentId;

    profileCollegeEmail.textContent = loggedInUser.email;


    // First letter of user's name
    profileAvatar.textContent =
        loggedInUser.name.charAt(0).toUpperCase();


    profileModal.classList.add("active");

});


// Close Profile
closeProfile.addEventListener("click", () => {

    profileModal.classList.remove("active");

});


// Close Profile when clicking outside the modal
profileModal.addEventListener("click", (event) => {

    if (event.target === profileModal) {

        profileModal.classList.remove("active");

    }

});


// Logout

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("campusLoggedInUser");

    window.location.href = "auth/login.html";

});