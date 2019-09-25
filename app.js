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
    	const time = Math.floor(Date.now() / 1000);
        function step() {
            if (!video.paused) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                ctx.fillStyle = "white";
                ctx.font = "30px Arial";
    		const t = Math.floor(Date.now() / 1000);
                ctx.fillText(15 - (t - time), 15, 45);
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
        setTimeout(drawStartScreen, 15000);
    });

    canvas.addEventListener("click", (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        const xOffset = window.innerWidth - canvasRect.right;
        const yOffset = canvasRect.bottom - canvas.width;
        const clickX = event.clientX - xOffset;
        const clickY = event.clientY - yOffset;

        if (video.paused) {
            video.play();
        }
    });

    drawStartScreen();
}

window.onload = main;
