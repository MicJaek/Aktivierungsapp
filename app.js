const methods = [
  {
    title: "Blitz-Check-in",
    short: "Jede Person nennt in 5 Sekunden ihre aktuelle Energie auf einer Skala von 1–5.",
    steps: [
      "Bitte alle, aufzustehen und kurz zu atmen.",
      "Gehe reihum oder lasse die Gruppe gleichzeitig die Handzahl zeigen.",
      "Fordere je zwei Freiwillige auf, ein Wort zur Zahl zu teilen.",
      "Bedanke dich und leite mit einer kurzen Überleitung in den Workshop über.",
    ],
    tip: "Ideal als schneller Einstieg, dauert 2–3 Minuten.",
    color: "#4f46e5",
    accent: "#eef0ff",
    label: "Skala",
  },
  {
    title: "Energiewelle",
    short: "Eine Person startet einen Applaus, die Welle läuft einmal durch die Gruppe.",
    steps: [
      "Stelle dich sichtbar hin und starte mit leichtem Klatschen.",
      "Bitte die nächste Person, den Applaus zu übernehmen.",
      "Lass die Welle einmal im Kreis laufen.",
      "Beende die Runde mit einem gemeinsamen, lauten Klatscher.",
    ],
    tip: "Hebt die Stimmung und synchronisiert die Gruppe.",
    color: "#16a34a",
    accent: "#e9fbe9",
    label: "Welle",
  },
  {
    title: "Zwei Wahrheiten",
    short: "Alle teilen zwei Aussagen, eine stimmt, eine ist erfunden – die Gruppe rät.",
    steps: [
      "Gib 30 Sekunden Vorbereitungszeit.",
      "Lass 3–4 Personen ihre zwei Aussagen nennen.",
      "Die Gruppe stimmt per Handzeichen ab.",
      "Löse auf und sammle kurze Reaktionen ein.",
    ],
    tip: "Gut für Gruppen, die sich kennenlernen sollen.",
    color: "#f97316",
    accent: "#fff2e6",
    label: "Rätsel",
  },
  {
    title: "Mini-Perspektivwechsel",
    short: "Teilnehmende sprechen in Paaren 60 Sekunden über ein Thema, dann wechseln sie die Seite.",
    steps: [
      "Bilde spontane Zweiergruppen.",
      "Stelle eine aktivierende Frage zum Workshop-Thema.",
      "Lass 60 Sekunden sprechen, dann wechseln die Rollen.",
      "Bitte zwei Paare, einen Impuls zu teilen.",
    ],
    tip: "Bringt Bewegung und inhaltlichen Fokus in 4 Minuten.",
    color: "#0ea5e9",
    accent: "#e6f6ff",
    label: "Talk",
  },
];

const methodImage = document.getElementById("methodImage");
const methodTitle = document.getElementById("methodTitle");
const methodShort = document.getElementById("methodShort");
const methodSteps = document.getElementById("methodSteps");
const methodTip = document.getElementById("methodTip");
const detailsPanel = document.getElementById("detailsPanel");
const newMethodBtn = document.getElementById("newMethodBtn");
const detailsBtn = document.getElementById("detailsBtn");
const ttsBtn = document.getElementById("ttsBtn");

let currentMethod = null;
let speechUtterance = null;

const createImageDataUrl = ({ title, color, accent, label }) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400">
      <defs>
        <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${accent}" />
          <stop offset="100%" stop-color="${color}" stop-opacity="0.2" />
        </linearGradient>
      </defs>
      <rect width="600" height="400" rx="32" fill="url(#grad)" />
      <circle cx="480" cy="110" r="80" fill="${color}" opacity="0.15" />
      <circle cx="140" cy="310" r="90" fill="${color}" opacity="0.1" />
      <text x="48" y="160" font-family="Inter, Arial, sans-serif" font-size="32" fill="${color}" font-weight="700">
        ${title}
      </text>
      <text x="48" y="205" font-family="Inter, Arial, sans-serif" font-size="18" fill="#1f2333">
        Aktivierungsmethode
      </text>
      <rect x="48" y="240" width="130" height="40" rx="20" fill="${color}" />
      <text x="74" y="266" font-family="Inter, Arial, sans-serif" font-size="16" fill="#ffffff" font-weight="600">
        ${label}
      </text>
    </svg>
  `;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const stopSpeech = () => {
  if (speechSynthesis.speaking || speechSynthesis.pending) {
    speechSynthesis.cancel();
  }
  speechUtterance = null;
  ttsBtn.textContent = "Anleitung vorlesen";
};

const updateDetails = (method) => {
  methodSteps.innerHTML = "";
  method.steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    methodSteps.appendChild(li);
  });
  methodTip.textContent = method.tip;
};

const setMethod = (method) => {
  currentMethod = method;
  methodTitle.textContent = method.title;
  methodShort.textContent = method.short;
  methodImage.src = createImageDataUrl(method);
  methodImage.alt = `Illustration für ${method.title}`;
  updateDetails(method);
  detailsBtn.disabled = false;
  ttsBtn.disabled = false;
  detailsPanel.hidden = true;
  stopSpeech();
};

const getRandomMethod = () => {
  const options = methods.filter((method) => method !== currentMethod);
  return options[Math.floor(Math.random() * options.length)] || methods[0];
};

newMethodBtn.addEventListener("click", () => {
  setMethod(getRandomMethod());
});

detailsBtn.addEventListener("click", () => {
  detailsPanel.hidden = !detailsPanel.hidden;
  detailsBtn.textContent = detailsPanel.hidden
    ? "Anleitung anzeigen"
    : "Anleitung ausblenden";
});

ttsBtn.addEventListener("click", () => {
  if (!currentMethod) return;

  if (speechSynthesis.speaking || speechSynthesis.pending) {
    stopSpeech();
    return;
  }

  const text = [
    currentMethod.title,
    "Schritt-für-Schritt:",
    ...currentMethod.steps,
    currentMethod.tip,
  ].join(" ");

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "de-DE";
  utterance.rate = 1;
  utterance.pitch = 1;
  utterance.onend = () => {
    ttsBtn.textContent = "Anleitung vorlesen";
  };
  utterance.onerror = () => {
    ttsBtn.textContent = "Anleitung vorlesen";
  };

  speechUtterance = utterance;
  ttsBtn.textContent = "Vorlesen stoppen";
  speechSynthesis.speak(utterance);
});

const initializeApp = () => {
  setMethod(methods[0]);
};

window.addEventListener("beforeunload", stopSpeech);
window.addEventListener("DOMContentLoaded", initializeApp);
