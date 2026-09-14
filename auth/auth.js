const loginSection = document.getElementById("loginSection");
const signupSection = document.getElementById("signupSection");

const showSignup = document.getElementById("showSignup");
const showLogin = document.getElementById("showLogin");

const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");


// Switch to Sign Up
showSignup.addEventListener("click", () => {

    loginSection.classList.add("hidden");
    signupSection.classList.remove("hidden");

});


// Switch to Login
showLogin.addEventListener("click", () => {

    signupSection.classList.add("hidden");
    loginSection.classList.remove("hidden");

});


// Get users from localStorage
function getUsers() {

    return JSON.parse(localStorage.getItem("campusUsers")) || [];

}


// Save users to localStorage
function saveUsers(users) {

    localStorage.setItem("campusUsers", JSON.stringify(users));

}


// Sign Up
signupForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const studentId = document.getElementById("signupStudentId").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;


    // Check passwords
    if (password !== confirmPassword) {

        alert("Passwords do not match.");
        return;

    }


    const users = getUsers();


    // Check duplicate student ID
    const existingStudent = users.find(
        user => user.studentId.toLowerCase() === studentId.toLowerCase()
    );

    if (existingStudent) {

        alert("A student account with this ID already exists.");
        return;

    }


    // Check duplicate email
    const existingEmail = users.find(
        user => user.email.toLowerCase() === email.toLowerCase()
    );

    if (existingEmail) {

        alert("An account with this email already exists.");
        return;

    }


    // Create user
    const newUser = {

        id: Date.now(),

        name: name,

        studentId: studentId,

        email: email,

        password: password

    };


    users.push(newUser);

    saveUsers(users);


    // Create login session
    localStorage.setItem("campusLoggedInUser", JSON.stringify(newUser));


    alert("Account created successfully.");

    window.location.href = "../index.html";

});


// Login
loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const identifier = document
        .getElementById("loginIdentifier")
        .value
        .trim()
        .toLowerCase();

    const password = document
        .getElementById("loginPassword")
        .value;


    const users = getUsers();


    const user = users.find(user =>

        (
            user.email.toLowerCase() === identifier ||
            user.studentId.toLowerCase() === identifier
        )

        && user.password === password

    );


    if (!user) {

        alert("Invalid email/student ID or password.");
        return;

    }


    // Create session
    localStorage.setItem(
        "campusLoggedInUser",
        JSON.stringify(user)
    );


    window.location.href = "../index.html";

});