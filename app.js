// 1. Elements ko select kiya 
const body = document.getElementById("my-body");
const colorCodeText = document.getElementById("color-code");
const colorBtn = document.getElementById("color-btn");
const copyBtn = document.getElementById("copy-btn");

// 2. Random color generate karne ka function
function getRandomColor() {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    return `#${randomColor}`;
}

// 3. Button par sirf ek Action (Event Listener) lagaya
colorBtn.addEventListener("click", () => {
    const newColor = getRandomColor();           // GENERATE NEW COLOR
    body.style.backgroundColor = newColor;       //  BACKGROUND COLOR
    colorCodeText.textContent = newColor;        //  TEXT ON SCREEN
});
copyBtn.addEventListener("click", () => {
    const currentColor = colorCodeText.textContent;

    navigator.clipboard.writeText(currentColor)
        .then(() => {
            copyBtn.textContent = "Copied!";
            setTimeout(() => {
                copyBtn.textContent = "Copy Color";
            }, 2000);
        })
        .catch(() => {
            alert("Failed to copy! Please try manually.");
        });
});