javascript:(function(){
window.features = {
videoSpoof: true,
questionSpoof: true,
rgbLogo: true,
customBanner: true,
minuteFarmer: true,
autoAnswer: true,
showAnswers: true,
};

window.featureConfigs = {
customUsername: "",
customPfp: "",
autoAnswerDelay: 1
};

window.user = { nickname: "Usuario" };

window.sendToast = function(msg, duration) {
const toast = document.createElement('div');
toast.style.cssText = 'position:fixed;top:20px;right:20px;background:#333;color:white;padding:10px;border-radius:5px;z-index:10000;';
toast.textContent = msg;
document.body.appendChild(toast);
setTimeout(() => toast.remove(), duration);
};

window.plppdo = {
on: (event, callback) => {
if (event === 'domChanged') {
const observer = new MutationObserver(callback);
observer.observe(document.body, { childList: true, subtree: true });
callback();
}
}
};

window.findAndClickBySelector = function(selector) {
const element = document.querySelector(selector);
if (element) element.click();
};

window.playAudio = function(url) {
const audio = new Audio(url);
audio.play().catch(() => {});
};

window.delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const originalFetch = window.fetch;
window.fetch = async function (input, init) {
let body;
if (input instanceof Request) body = await input.clone().text();
else if (init && init.body) body = init.body;

if (window.features.videoSpoof && body && body.includes('"operationName":"updateUserVideoProgress"')) {
try {
let bodyObj = JSON.parse(body);
if (bodyObj.variables && bodyObj.variables.input) {
const durationSeconds = bodyObj.variables.input.durationSeconds;
bodyObj.variables.input.secondsWatched = durationSeconds;
bodyObj.variables.input.lastSecondWatched = durationSeconds;
body = JSON.stringify(bodyObj);
if (input instanceof Request) { input = new Request(input, { body: body }); }
else init.body = body;
if (window.sendToast) window.sendToast("🔓 Vídeo exploitado.", 1000);
}
} catch (e) {}
}

if (window.features.minuteFarmer && body && (typeof input === 'object' && input.url?.includes("mark_conversions"))) {
try {
if (body.includes("termination_event")) {
if (window.sendToast) window.sendToast("🚫 Limitador de tempo bloqueado.", 1000);
return;
}
} catch (e) {}
}

const originalResponse = await originalFetch.apply(this, arguments);

if (window.features.questionSpoof) {
const phrases = [
"🩵 The Best [KhanTool](https://discord.gg/PYNQfcDvZy/)!",
"🤍 Made by [! foquisi(https://e-z.bio/sounix).",
"☄️ By [/KhanTool](https://discord.gg/PYNQfcDvZy/).",
"🌟 Star the project on [GitHub](https://github.com/OnePrism0/KhanTool/)!",
"🪶 Vem pra KhanTool",
];

const clonedResponse = originalResponse.clone();
try {
const responseBody = await clonedResponse.text();
let responseObj = JSON.parse(responseBody);
if (responseObj?.data?.assessmentItem?.item?.itemData) {
let itemData = JSON.parse(responseObj.data.assessmentItem.item.itemData);
if (itemData.question.content[0] === itemData.question.content[0].toUpperCase()) {
itemData.answerArea = {"calculator": false, "chi2Table": false, "periodicTable": false, "tTable": false, "zTable": false};
itemData.question.content = phrases[Math.floor(Math.random() * phrases.length)] + `[[☃ radio 1]]`;
itemData.question.widgets = {
"radio 1": {
type: "radio",
options: {choices: [
{ content: "Resposta correta.", correct: true },
{ content: "Resposta incorreta.", correct: false }
]}
}
};
responseObj.data.assessmentItem.item.itemData = JSON.stringify(itemData);
if (window.sendToast) window.sendToast("🔓 Questão exploitada.", 1000);
return new Response(JSON.stringify(responseObj), {
status: originalResponse.status,
statusText: originalResponse.statusText,
headers: originalResponse.headers
});
}
}
} catch (e) {}
}

return originalResponse;
};

window.plppdo.on('domChanged', () => {
const pfpElement = document.querySelector('.avatar-pic');
const nicknameElement = document.querySelector('.user-deets.editable h2');
const desiredUsername = window.featureConfigs?.customUsername || (window.user ? window.user.nickname : "");
if (nicknameElement && nicknameElement.textContent !== desiredUsername)
nicknameElement.textContent = desiredUsername;
if (window.featureConfigs?.customPfp && pfpElement) {
if (pfpElement.src !== window.featureConfigs.customPfp) {
Object.assign(pfpElement, { src: window.featureConfigs.customPfp, alt: "Not an image URL" });
pfpElement.style.borderRadius = "50%";
}
}

const khanLogo = document.querySelector('svg._1rt6g9t')?.querySelector('path:nth-last-of-type(2)');
const styleElement = document.createElement('style');
styleElement.className = "RGBLogo";
styleElement.textContent = `
@keyframes colorShift {
0% { fill: rgb(255, 0, 0); }
33% { fill: rgb(0, 255, 0); }
66% { fill: rgb(0, 0, 255); }
100% { fill: rgb(255, 0, 0); }
}
`;
if (window.features.rgbLogo && khanLogo) {
if (!document.getElementsByClassName('RGBLogo')[0])
document.head.appendChild(styleElement);
if (khanLogo.getAttribute('data-darkreader-inline-fill') != null)
khanLogo.removeAttribute('data-darkreader-inline-fill');
khanLogo.style.animation = 'colorShift 5s infinite';
}
});

const phrases = [
"[🔹] Sem nota? Sem chance.",
"[🔹] KhanTool no topo.",
"[🔹] KhanTool mandou um salve!",
"[🔹] Queria tanto ter o KhanTool.",
"[🔹] Ganhe Tempo, use KhanTool!",
"[🔹] KhanTool tá voandooo"
];
setInterval(function(){
const greeting = document.querySelector('.stp-animated-banner h2');
if (greeting && window.features.customBanner)
greeting.textContent = phrases[Math.floor(Math.random() * phrases.length)];
}, 3000);

const baseSelectors = [
`[data-testid="choice-icon__library-choice-icon"]`,
`[data-testid="exercise-check-answer"]`,
`[data-testid="exercise-next-question"]`,
`._1udzurba`,
`._awve9b`
];
window.khanwareDominates = true;
(async function () {
while (window.khanwareDominates) {
if (window.features.autoAnswer && window.features.questionSpoof) {
const selectorsToCheck = [...baseSelectors];
if (window.features.nextRecomendation) selectorsToCheck.push("._hxicrxf");
if (window.features.repeatQuestion) selectorsToCheck.push("._ypgawqo");
for (const q of selectorsToCheck) {
if (typeof findAndClickBySelector === "function") findAndClickBySelector(q);
if (
document.querySelector(q + "> div") &&
document.querySelector(q + "> div").innerText === "Mostrar resumo"
) {
if (window.sendToast) window.sendToast("🎉 Exercício concluído!", 3000);
if (typeof playAudio === "function") playAudio("https://r2.e-z.host/4d0a0bea-60f8-44d6-9e74-3032a64a9f32/4x5g14gj.wav");
await new Promise(r => setTimeout(r, (window.featureConfigs?.autoAnswerDelay || 1) * 800));
}
}
}
await new Promise(r=>setTimeout(r, 250));
}
})();

const originalParse = JSON.parse;
JSON.parse = function (e, t) {
let body = originalParse(e, t);
try {
if (body?.data) {
Object.keys(body.data).forEach(key => {
const data = body.data[key];
if (window.features.showAnswers && key === "assessmentItem" && data?.item) {
const itemData = JSON.parse(data.item.itemData);
if (
itemData.question &&
itemData.question.widgets &&
itemData.question.content[0] === itemData.question.content[0].toUpperCase()
) {
Object.keys(itemData.question.widgets).forEach(widgetKey => {
const widget = itemData.question.widgets[widgetKey];
if (widget.options && widget.options.choices) {
widget.options.choices.forEach(choice => {
if (choice.correct) {
choice.content = "✅ " + choice.content;
if (window.sendToast) window.sendToast("🔓 Respostas reveladas.", 1000);
}
});
}
});
data.item.itemData = JSON.stringify(itemData);
}
}
});
}
} catch (e) {}
return body;
};

})();
