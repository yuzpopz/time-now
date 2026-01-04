"use strict";

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('Service Worker registered!'))
      .catch(err => console.log('Service Worker registration failed:', err));
  });
}

let h1 = document.getElementById("h1");
let h2 = document.getElementById("h2");
let m1 = document.getElementById("m1");
let m2 = document.getElementById("m2");
let s1 = document.getElementById("s1");
let s2 = document.getElementById("s2");
let sepS = document.getElementById("sep-s");
let toggleSeconds = document.getElementById("toggleSeconds");
let darkModeToggle = document.getElementById("darkModeToggle");
let darkModeText = document.getElementById("darkModeText");
let fullScreenToggle = document.getElementById("fullScreenToggle");
let fullScreenText = document.getElementById("fullScreenText");
let switch1 = document.querySelector('.switch1');
let switch2 = document.querySelector('.switch2');
let body = document.body;
let controls = document.getElementsByClassName("controls")[0];
let timeoutId;
let confettiFired = false;

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

    // Check if it's New Years (January 01 00:00:00 to 00:00:59)
    const isDate = d.getMonth() === 0 && d.getDate() === 1;
    const isTime = d.getHours() === 0 && d.getMinutes() === 0 && d.getSeconds() >= 0 && d.getSeconds() <= 59;

    if (isDate && isTime && !confettiFired) {
        launchConfetti({
            duration: 800,
            startVelocity: 50,
            ticks: undefined // using default value
        });
        setTimeout(() => {
            launchConfetti({
                duration: 1300,
                startVelocity: 60,
                ticks: 300
            });
        }, 2000);

        confettiFired = true;
    }

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

    updateFullScreenState(); // Add this
});

// Toggle dark mode and save the preference
darkModeToggle.addEventListener("change", () => {
    toggleSeconds.style.transition = "background-color 0.3s, color 0.3s, border-color 0.3s";
    darkModeText.style.transition = "color 0.3s";
    fullScreenText.style.transition = "color 0.3s";
    switch1.style.transition = "background-color 0.3s, color 0.3s, border-color 0.3s";
    switch2.style.transition = "background-color 0.3s, color 0.3s, border-color 0.3s";
    document.querySelector('.switch1').classList.add('transition-on');
    document.querySelector('.switch2').classList.add('transition-on');
    if (darkModeToggle.checked) {
        body.classList.add("dark-mode");
        localStorage.setItem("theme", "dark");
    } else {
        body.classList.remove("dark-mode");
        localStorage.setItem("theme", "light");
    }
    setTimeout(() => {
        toggleSeconds.style.transition = "none";
        darkModeText.style.transition = "none";
        fullScreenText.style.transition = "none";
        switch1.style.transition = "none";
        switch2.style.transition = "none";
        document.querySelector('.switch1').classList.remove('transition-on');
        document.querySelector('.switch2').classList.remove('transition-on');

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
});

// --- Awesome Easter Egg Configuration ---
const FLASH_PERIOD = 200;
const FLASH_COLORS = ['#36c900', '#7200ff', '#fd4ab6', '#00609f', '#0afff7', '#ddff20'];

let typingBuffer = "";
let awesomeConsent = null; // Session-based consent
let isFlashing = false;
let flashIntervalId = null;
let lastColorIndex = -1;

function triggerAwesomeMode() {
    // 1 & 2. Handle Consent
    if (awesomeConsent === null) {
        awesomeConsent = confirm("The following contains flashing lights that may trigger seizures for people with photosensitive epilepsy. Continue?");
    }
    if (!awesomeConsent) return;

    if (isFlashing) {
        stopAwesomeMode();
        return;
    }

    isFlashing = true;
    body.classList.add('awesome-active');
    
    let tickCount = 0;

    flashIntervalId = setInterval(() => {
        tickCount++;

        // 2. Only apply white text/shadows AFTER one period [Requirement 2]
        if (tickCount === 1) {
            body.classList.add('awesome-styled');
        }

        // 3. Select random color avoiding consecutive repeats
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * FLASH_COLORS.length);
        } while (newIndex === lastColorIndex);
        
        lastColorIndex = newIndex;
        const color = FLASH_COLORS[newIndex];

        // 4. Update backgrounds for body and UI elements [Requirement 3 & 4]
        body.style.backgroundColor = color;
        const uiBackgrounds = document.querySelectorAll('button, .switch1, .switch2');
        uiBackgrounds.forEach(el => el.style.backgroundColor = color);
    }, FLASH_PERIOD);
}

function stopAwesomeMode() {
    isFlashing = false;
    clearInterval(flashIntervalId);

    // 1. Add a temporary class to kill all transitions/animations immediately
    body.classList.add('no-transitions');

    // 2. Perform the reset
    body.classList.remove('awesome-active', 'awesome-styled');
    body.style.backgroundColor = "";
    document.querySelectorAll('button, .switch1, .switch2').forEach(el => {
        el.style.backgroundColor = "";
    });

    // 3. Force a reflow (tells the browser to apply styles right now)
    void body.offsetWidth;

    // 4. Remove the helper class so normal transitions (like clock fades) work again
    body.classList.remove('no-transitions');
}

// --- Enhanced Keyboard Listener ---
document.addEventListener('keydown', (event) => {
    if (event.target.tagName !== 'INPUT') {
        const key = event.key.toLowerCase();
        
        // Activity tracking
        clearTimeout(timeoutId);
        showCursorAndControls();
        timeoutId = setTimeout(hideCursorAndControls, 4000);

        // Awesome sequence tracking
        typingBuffer += key;
        if (!"awesome".startsWith(typingBuffer)) {
            typingBuffer = "awesome".startsWith(key) ? key : "";
        }

        if (typingBuffer === "awesome") {
            triggerAwesomeMode();
            typingBuffer = "";
            return;
        }

        // 5. Block shortcuts if user is typing "awesome" [Requirement 5]
        const isTypingAwesome = typingBuffer.length > 0 && "awesome".startsWith(typingBuffer);

        if (!isTypingAwesome) {
            if (key === 'd') {
                event.preventDefault();
                darkModeToggle.checked = !darkModeToggle.checked;
                darkModeToggle.dispatchEvent(new Event('change'));
            } else if (key === 'f') {
                event.preventDefault();
                toggleFullScreen();
            } else if (key === 's') {
                event.preventDefault();
                toggleSeconds.click();
            }
        }
    }
});

// Create function to update toggle state
function updateFullScreenState() {
    const isFullscreen = !!document.fullscreenElement ||
        !!document.webkitFullscreenElement ||
        !!document.mozFullScreenElement ||
        !!document.msFullscreenElement;

    fullScreenToggle.checked = isFullscreen;
}

// Add fullscreen change event listeners
document.addEventListener('fullscreenchange', updateFullScreenState);
document.addEventListener('webkitfullscreenchange', updateFullScreenState);
document.addEventListener('mozfullscreenchange', updateFullScreenState);
document.addEventListener('MSFullscreenChange', updateFullScreenState);

// Add toggle event listener
fullScreenToggle.addEventListener('change', toggleFullScreen);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            /* Chrome, Safari and Opera */
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            /* IE/Edge */
            document.documentElement.msRequestFullscreen();
        }
        fullScreenToggle.checked = true; // Update toggle state
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            /* Firefox */
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            /* Chrome, Safari and Opera */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            /* IE/Edge */
            document.msExitFullscreen();
        }
        fullScreenToggle.checked = false; // Update toggle state
    }
}

function launchConfetti(options) {
    const {
        duration,
        startVelocity,
        ticks
    } = options;

    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 60,
            scalar: 1.1,
            startVelocity,
            ticks,
            origin: {
                x: 0
            }
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 60,
            scalar: 1.1,
            startVelocity,
            ticks,
            origin: {
                x: 1
            }
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}