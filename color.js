const hueSlider = document.querySelector('.hue-slider-input');
const colorPreview = document.querySelector('.color-preview');
const pickercircle = document.querySelector('.picker-circle');
const hexInput = document.querySelector('.hex-input-box span:first-child');
const allFormatValues = document.querySelectorAll('.format-value');
const rgbValue = allFormatValues[0];
const cmykValue = allFormatValues[1];
const hsvValue = allFormatValues[2];
const hslValue = allFormatValues[3];
const copyBtn = document.getElementById("copy-btn");
const hexText = document.getElementById("hex-text");
const colorGradient = document.querySelector('.color-gradient');
const shareBtn = document.querySelector(".share-btn");
const shareOverlay = document.getElementById('share-overlay');
const closeShareBtn = document.getElementById('close-share-btn');
const shareLinkInput = document.getElementById('share-link-input');


let currentSaturation = 100;
let currentValue = 100;



// Function to update the color preview and values based on the hue slider and drag
function updateColor() {
    const hue = hueSlider.value;

    colorGradient.style.backgroundColor = `hsl(${hue}, 100%, 50%)`;

    const [r, g, b] = hsvToRgb(hue, currentSaturation, currentValue);
    const hexColor = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

    colorPreview.style.backgroundColor = hexColor;
    hexInput.textContent = hexColor;
    hexText.textContent = hexColor;
    rgbValue.textContent = `${r}, ${g}, ${b}`;
    cmykValue.textContent = `${((255 - r) / 255 * 100).toFixed(0)}%, ${((255 - g) / 255 * 100).toFixed(0)}%, ${((255 - b) / 255 * 100).toFixed(0)}%, ${(Math.min(r, g, b) / 255 * 100).toFixed(0)}%`;
    hsvValue.textContent = `${hue}°, ${Math.round(currentSaturation)}%, ${Math.round(currentValue)}%`;
    hslValue.textContent = `${hue}°, ${Math.round(currentSaturation)}%, 50%`;
}

// Function to convert HSV to RGBx
function hsvToRgb(h, s, v) {
    v = v / 100;
    s = s / 100;
    const i = Math.floor(h / 60);
    const f = h / 60 - i;
    const p = v * 255 * (1 - s);
    const q = v * 255 * (1 - f * s);
    const t = v * 255 * (1 - (1 - f) * s);
    v = v * 255;

    let r, g, b;
    switch (i) {

        case 0:
            r = v;
            g = t;
            b = p;
            break;

        case 1:
            r = q;
            g = v;
            b = p;
            break;

        case 2:
            g = v;
            b = p;
            r = p;
            break;

        case 3:
            g = q;
            b = v;
            r = p;
            break;

        case 4:
            r = p;
            g = p;
            b = v;
            break;

        default:
            r = v;
            g = p;
            b = q;
    }
    return [Math.round(r), Math.round(g), Math.round(b)];
}
hueSlider.addEventListener('input', updateColor);

// Initial color update on page load
updateColor();
copyBtn.addEventListener("click", () => {

    const currentHex = hexText.textContent;

    navigator.clipboard.writeText(currentHex)
        .then(() => {

            copyBtn.classList.remove("fa-copy");
            copyBtn.classList.add("fa-check");
            copyBtn.style.color = "#32a854";


            hexText.textContent = "Copied! 🎉";
            hexText.style.color = "#32a854"; // 

            setTimeout(() => {
                copyBtn.classList.remove("fa-check");
                copyBtn.classList.add("fa-copy");
                copyBtn.style.color = "";

                hexText.textContent = currentHex;
                hexText.style.color = "";
            }, 2000);
        })
        .catch(() => {
            alert("Failed to copy! Please try manually.");
        });
});

let isDragging = false;
colorGradient.addEventListener('mousedown', (e) => {
    isDragging = true;
    mouseCircle(e);
});
document.addEventListener('mousemove', (e) => {
    if (isDragging === true) {
        mouseCircle(e);
    }
});
document.addEventListener('mouseup', () => {
    isDragging = false;
});
// Touch events for mobile devices
pickercircle.addEventListener('touchstart', () => {
    isDragging = true;
});
function mouseCircle(e) {
    const rect = colorGradient.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = Math.max(0, Math.min(x, rect.width));
    y = Math.max(0, Math.min(y, rect.height));

    pickercircle.style.left = `${x}px`;
    pickercircle.style.top = `${y}px`;

    currentSaturation = (x / rect.width) * 100;
    currentValue = 100 - (y / rect.height) * 100;
    updateColor();

}

//1 click events for share button and overlay
shareBtn.addEventListener("click", () => {
    shareOverlay.style.display = "flex";
});

//2 Close button for share overlay
closeShareBtn.addEventListener("click", () => {
    shareOverlay.style.display = "none";
});

//3 Click event for share link input to copy the link
shareOverlay.addEventListener("click", (e) => {
    if (e.target === shareOverlay) {
        shareOverlay.style.display = "none";
    }
});

//4 Click event for share link input to copy the link
shareLinkInput.addEventListener("click", () => {
    const shareLink = shareLinkInput.value;
    navigator.clipboard.writeText(shareLink)
        .then(() => {
            shareLinkInput.value = "Link Copied! ";
            setTimeout(() => {
                shareLinkInput.value = shareLink;
            }, 2000);
        })
        .catch(() => {
            alert("Failed to copy! Please try manually.");
        });
});

