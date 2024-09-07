"use strict";

let h1 = document.getElementById("h1");
let h2 = document.getElementById("h2");
let m1 = document.getElementById("m1");
let m2 = document.getElementById("m2");
let s1 = document.getElementById("s1");
let s2 = document.getElementById("s2");
let sepS = document.getElementById("sep-s");
let toggleSeconds = document.getElementById("toggleSeconds");
let darkModeToggle = document.getElementById("darkModeToggle");
let body = document.body;
let controls = document.getElementsByClassName("controls")[0];
let timeoutId;

function transitionText() {
    const d = new Date();
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");

    // Calculate the time for the next second
    const nextD = new Date(d.getTime() + 1000);
    const nextH = nextD.getHours().toString().padStart(2, "0");
    const nextM = nextD.getMinutes().toString().padStart(2, "0");

    // Create arrays for current and next digits
    const currentDigits = [h.charAt(0), h.charAt(1), m.charAt(0), m.charAt(1)];
    const nextDigits = [nextH.charAt(0), nextH.charAt(1), nextM.charAt(0), nextM.charAt(1)];

    // Get all clock elements
    const elements = [h1, h2, m1, m2];

    // Loop through the digits to check which will change
    for (let i = 0; i < elements.length; i++) {
        if (currentDigits[i] !== nextDigits[i]) {
            // Delay the fade-out to start 0.5 seconds later
            setTimeout(() => {
                elements[i].classList.add('fade-out');

                // Set a timeout to update the digit and fade-in
                setTimeout(() => {
                    elements[i].textContent = nextDigits[i];
                    elements[i].classList.remove('fade-out');
                    elements[i].classList.add('fade-in');
                }, 450);

                // Remove fade-in class after the animation
                setTimeout(() => {
                    elements[i].classList.remove('fade-in');
                }, 950);
            }, 500);
        }
    }
}

function updateClock() {
    const d = new Date();

    var h = d.getHours().toString().padStart(2, "0");
    var m = d.getMinutes().toString().padStart(2, "0");
    var s = d.getSeconds().toString().padStart(2, "0");

    h1.textContent = h.charAt(0);
    h2.textContent = h.charAt(1);
    m1.textContent = m.charAt(0);
    m2.textContent = m.charAt(1);
    s1.textContent = s.charAt(0);
    s2.textContent = s.charAt(1);

    document.title = "Time is " + h + ":" + m;

    transitionText();

    setTimeout(updateClock, 1000 - d.getMilliseconds() + 20);
}

updateClock();


// Check the saved state on page load
window.addEventListener("load", () => {
    const savedState = localStorage.getItem("secondsVisibility");

    if (savedState === "hidden") {
        s1.style.display = "none";
        s2.style.display = "none";
        sepS.style.display = "none";
        toggleSeconds.textContent = "Show seconds";
    } else {
        s1.style.display = "";
        s2.style.display = "";
        sepS.style.display = "";
        toggleSeconds.textContent = "Hide seconds";
    }
});

// Toggle seconds display
toggleSeconds.addEventListener("click", () => {
    const isHidden = s1.style.display === "none";

    s1.style.display = isHidden ? "" : "none";
    s2.style.display = isHidden ? "" : "none";
    sepS.style.display = isHidden ? "" : "none";
    toggleSeconds.textContent = isHidden ? "Hide seconds" : "Show seconds";
    localStorage.setItem("secondsVisibility", isHidden ? "visible" : "hidden");
});


// Check the saved theme preference on page load
window.addEventListener("load", () => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    } else {
        body.classList.remove("dark-mode");
        darkModeToggle.checked = false;
    }
});

// Toggle dark mode and save the preference
darkModeToggle.addEventListener("change", () => {
    toggleSeconds.style.transition = "background-color 0.3s, color 0.3s, border 0.3s";
    if (darkModeToggle.checked) {
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
    setTimeout(() => {
        toggleSeconds.style.transition = "none";
    }, 300);
});


// Hide cursor and controsl during inactivity
function hideCursorAndControls() {
    body.style.cursor = "none";
    controls.style.opacity = 0;
}

function showCursorAndControls() {
    body.style.cursor = "default";
    controls.style.opacity = 1;
}

document.addEventListener("mousemove", () => {
    clearTimeout(timeoutId);
    showCursorAndControls();
    timeoutId = setTimeout(hideCursorAndControls, 4000);
})
