const loggedInUser = localStorage.getItem("campusLoggedInUser");

if (loggedInUser) {
    window.location.href = "../index.html";
}

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
signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const studentId = document.getElementById("signupStudentId").value.trim();
    const email = document.getElementById("signupEmail").value.trim();
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("signupConfirmPassword").value;


    if (password !== confirmPassword) {

        alert("Passwords do not match.");
        return;

    }


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    studentId: studentId,
                    email: email,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);
            return;

        }


        localStorage.setItem(
            "campusLoggedInUser",
            JSON.stringify(data.user)
        );


        alert("Account created successfully.");

        window.location.href = "../index.html";


    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});


// Login
loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const identifier = document
        .getElementById("loginIdentifier")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value;


    try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    identifier: identifier,
                    password: password
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            alert(data.message);
            return;

        }


        localStorage.setItem(
            "campusLoggedInUser",
            JSON.stringify(data.user)
        );


        window.location.href = "../index.html";


    } catch (error) {

        console.error(error);

        alert("Unable to connect to the server.");

    }

});