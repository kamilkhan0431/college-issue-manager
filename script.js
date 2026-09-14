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
    const savedIssues = localStorage.getItem("campusIssues");

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
        "campusIssues",
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

issueForm.addEventListener("submit", function (event) {

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


    // Get existing issues

    const issues = getIssues();


    // Create new issue

    const newIssue = {

        id: 1000 + issues.length + 1,

        category: category,

        location: location,

        title: title,

        description: description,

        priority: priority,

        status: "Pending",

        date: new Date().toLocaleDateString("en-IN")

    };


    // Add new issue

    issues.unshift(newIssue);


    // Save

    saveIssues(issues);


    // Update UI

    displayIssues();


    // Reset form

    issueForm.reset();


    // Close modal

    reportModal.classList.add("hidden");


    // Success message

    alert("Issue submitted successfully!");

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

