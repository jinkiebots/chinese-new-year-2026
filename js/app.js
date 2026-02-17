/* ========================================
   Hong Kong Tram Fortune Ticket Machine
   Main application logic
   ======================================== */

/* ---------- Ticket images ---------- */
const ticketImages = [
    'assets/images/Ticket 1.png',
    'assets/images/Ticket 2.png',
    'assets/images/Ticket 3.png',
    'assets/images/Ticket 4.png',
    'assets/images/Ticket 5.png',
    'assets/images/Ticket 6.png',
];
let usedTicketIndices = [];

/* ---------- State ---------- */
let ticketCount = 0;
let isDispensing = false;
let usedFortuneIndices = [];

/* ---------- DOM ---------- */
const pushButton      = document.getElementById('push-button');
const ticketCounter   = document.getElementById('ticket-counter');
const ticketStage     = document.getElementById('ticket-stage');
const collectionArea  = document.getElementById('collection-area');
const collectionTray  = document.getElementById('collection-tray');
const collectionCount = document.getElementById('collection-count'); // may be null if label removed

/* ========================================
   Sound Effects (using your audio files)
   ======================================== */
const buttonSound  = new Audio('assets/sounds/dragon-studio-button-press-3-386171.mp3');
const loadingSound = new Audio('assets/sounds/paper loading.mp3');

function playButtonClick() {
    buttonSound.currentTime = 0;
    buttonSound.play().catch(() => {});
}

function playTicketLoading() {
    loadingSound.currentTime = 0;
    loadingSound.play().catch(() => {});
}

function stopTicketLoading() {
    loadingSound.pause();
    loadingSound.currentTime = 0;
}

/* ========================================
   Core Logic
   ======================================== */

/* ---------- Get a fortune (non-repeating until all used) ---------- */
function getRandomFortune() {
    if (usedFortuneIndices.length >= fortunes.length) {
        usedFortuneIndices = [];
    }
    let idx;
    do {
        idx = Math.floor(Math.random() * fortunes.length);
    } while (usedFortuneIndices.includes(idx));
    usedFortuneIndices.push(idx);
    return fortunes[idx];
}

/* ---------- Format ticket number ---------- */
function formatTicketNumber(n) {
    return String(n).padStart(3, '0');
}

/* ---------- Pick a random ticket image (non-repeating until all used) ---------- */
function getRandomTicketImage() {
    if (usedTicketIndices.length >= ticketImages.length) {
        usedTicketIndices = [];
    }
    let idx;
    do {
        idx = Math.floor(Math.random() * ticketImages.length);
    } while (usedTicketIndices.includes(idx));
    usedTicketIndices.push(idx);
    return ticketImages[idx];
}

/* ---------- Build ticket HTML ---------- */
function createTicketHTML(imageSrc) {
    return `<img src="${imageSrc}" alt="Fortune ticket" draggable="false">`;
}

/* ---------- Dispense a ticket ---------- */
const LOADING_DELAY = 1200;
const SLIDE_DURATION = 3500;

function dispenseTicket() {
    if (isDispensing) return;
    isDispensing = true;

    ticketCount++;
    const ticketImage = getRandomTicketImage();

    // 1) Button press — click sound + visual press
    playButtonClick();
    pushButton.classList.add('pressed');

    setTimeout(() => {
        pushButton.classList.remove('pressed');
    }, 200);

    // 2) Loading phase — paper loading sound starts and keeps playing
    setTimeout(() => {
        playTicketLoading();
    }, 200);
    animateCounter(ticketCount, LOADING_DELAY);

    // 3) After loading delay — ticket starts sliding out (sound keeps playing)
    setTimeout(() => {
        ticketStage.innerHTML = '';

        const ticket = document.createElement('div');
        ticket.className = 'ticket';
        ticket.innerHTML = createTicketHTML(ticketImage);
        ticketStage.appendChild(ticket);

    }, LOADING_DELAY);

    // 4) After ticket fully slides out — stop sound, ready for next
    setTimeout(() => {
        stopTicketLoading();
        isDispensing = false;
    }, LOADING_DELAY + SLIDE_DURATION + 200);
}

/* ---------- Animate counter digits ---------- */
function animateCounter(target, duration) {
    const formatted = formatTicketNumber(target);
    const frameInterval = 60;
    const totalFrames = Math.floor(duration / frameInterval);
    let frame = 0;
    const interval = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
            ticketCounter.textContent = formatted;
            clearInterval(interval);
        } else {
            ticketCounter.textContent =
                Math.floor(Math.random() * 10).toString() +
                Math.floor(Math.random() * 10).toString() +
                Math.floor(Math.random() * 10).toString();
        }
    }, frameInterval);
}

/* ---------- Add ticket to collection tray ---------- */
function addToCollection(ticketImage) {
    collectionArea.classList.add('has-tickets');
    if (collectionCount) collectionCount.textContent = `(${ticketCount})`;

    const collected = document.createElement('div');
    collected.className = 'collected-ticket';
    collected.innerHTML = createTicketHTML(ticketImage);

    collectionTray.insertBefore(collected, collectionTray.firstChild);
}

/* ---------- Event listeners ---------- */
pushButton.addEventListener('click', dispenseTicket);

pushButton.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        dispenseTicket();
    }
});
