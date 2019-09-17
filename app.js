function main() {
    const canvas = document.querySelector("#drawcanvas");
    const ctx = canvas.getContext("2d");
    const video = document.querySelector("#drawvideo");

    video.addEventListener("play", () => {
        function step() {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });

    video.play();
}

window.onload = main;
