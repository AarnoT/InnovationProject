var video;
var audio;
var ctx;
var canvas;
var count = 0;

function drawStatusScreen() {    
    video.pause();

    const url_parts = window.location.href.split('?');
    var text = '0';
    if (url_parts.length >= 2) {
        const search = new URLSearchParams(url_parts[1]);
        const user = search.get('user');
        const req = new XMLHttpRequest();
        req.open('GET', '/addPoint?name=' + user, false);
        req.send();
        text = req.responseText;
    }

    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lightblue";
    ctx.fill();

    const img = new Image(500, 500);
    img.onload = function() {
        ctx.drawImage(img, canvas.width / 4 * 3, canvas.height / 4, 120, 120);
    }
    img.src = 'tiger.png';

    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    const txt = "Well done!";
    const size = ctx.measureText(txt);
    ctx.fillText(txt, canvas.width/2 - size.width/2, canvas.height/5);
    const txt2 = "Points: " + text;
    const size2 = ctx.measureText(txt2);
    ctx.fillText(txt2, canvas.width/2 - size2.width/2, canvas.height/5 * 3);

    audio.play();
}

function playVideo() { 
    video.play();
    const time = Math.floor(Date.now() / 1000);
    const timer = 5;

    function step() {
        if (!video.paused) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "white";
            ctx.font = "30px Arial";
    	    const t = Math.floor(Date.now() / 1000);
            ctx.fillText(timer - (t - time), 15, 45);
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
    setTimeout(drawStatusScreen, timer * 1000);
    count++;
};

function main() {
    canvas = document.querySelector("#drawcanvas");
    ctx = canvas.getContext("2d");

    video = document.createElement("video");
    video.loaded = false;
    video.oncanplaythrough = function() {
        video.loaded = true;
    };
    video.loop = true;
    video.controls = false;
    video.autoplay = false;
    video.src = "https://giant.gfycat.com/MixedLeadingApatosaur.webm";

    audio = document.createElement("audio");
    audio.loaded = false;
    audio.oncanplaythrough = function() {
        audio.loaded = true;
    };
    audio.loop = false;
    audio.controls = false;
    audio.autoplay = false;
    audio.src = '/sound.mp3';

    function drawStartScreen() {    
        video.pause();

        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "lightgrey";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        const txt = "Click to start";
        const size = ctx.measureText(txt);
        ctx.fillText(txt, canvas.width/2 - size.width/2, canvas.height/2);
    }

    canvas.addEventListener("click", (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        const xOffset = window.innerWidth - canvasRect.right;
        const yOffset = canvasRect.bottom - canvas.width;
        const clickX = event.clientX - xOffset;
        const clickY = event.clientY - yOffset;

        if (video.loaded && audio.loaded && video.paused) {
	    playVideo();
	}
    });

    drawStartScreen();
}

window.onload = main;
