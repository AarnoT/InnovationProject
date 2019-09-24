function main() {
    const canvas = document.querySelector("#drawcanvas");
    const ctx = canvas.getContext("2d");
    const video = document.querySelector("#drawvideo");

    function drawStartScreen() {    
        video.pause();

        ctx.beginPath();
        ctx.rect(0, 0, 500, 500);
        ctx.fillStyle = "lightgrey";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        const txt = "Click to start";
        const size = ctx.measureText(txt);
        ctx.fillText(txt, canvas.width/2 - size.width/2, canvas.height/2);
    }

    video.addEventListener("play", () => {
        function step() {
            if (!video.paused) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
        setTimeout(drawStartScreen, 15000);
    });

    canvas.addEventListener("click", () => {
        if (video.paused) {
            video.play();
        }
    });

    drawStartScreen();
}

window.onload = main;
