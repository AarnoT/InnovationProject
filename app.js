var video;
var video1;
var video2;
var audio;
var img;
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

    ctx.drawImage(
	img,
	canvas.width / 4 * 3, canvas.height / 4,
	canvas.width / 4, canvas.width / 4
    );

    ctx.fillStyle = "white";
    ctx.font = "250% Arial";
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
            ctx.font = "250% Arial";
    	    const t = Math.floor(Date.now() / 1000);
            ctx.fillText(timer - (t - time), 15, 45);
            requestAnimationFrame(step);
        }
    }
    requestAnimationFrame(step);
    setTimeout(drawStatusScreen, timer * 1000);
    count++;
};

function getVideoElement()  {
    v = document.createElement("video");
    v.loaded = false;
    v.loop = true;
    v.controls = false;
    v.autoplay = false;
    return v;
}

function main() {
    canvas = document.querySelector("#drawcanvas");
    ctx = canvas.getContext("2d");
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;

    video1 = getVideoElement();
    video1.oncanplaythrough = function() {
        video1.loaded = true;
    };
    video2 = getVideoElement();
    video2.oncanplaythrough = function() {
        video2.loaded = true;
    };
    video1.src = "https://giant.gfycat.com/ViciousCriminalGelada.webm";
    video2.src = "https://giant.gfycat.com/MixedLeadingApatosaur.webm";

    audio = document.createElement("audio");
    audio.loaded = false;
    audio.oncanplaythrough = function() {
        audio.loaded = true;
    };
    audio.loop = false;
    audio.controls = false;
    audio.autoplay = false;
    audio.src = '/sound.mp3';

    img = new Image(500, 500);
    img.onload = function() {
        img.loaded = true;
    }
    img.src = 'tiger.png';

    function drawStartScreen() {    
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "lightgrey";
        ctx.fill();

        ctx.fillStyle = "white";
        ctx.font = "250% Arial";
        const txt = "Click to start";
        const size = ctx.measureText(txt);
        ctx.fillText(txt, canvas.width/2 - size.width/2, canvas.height/2);
    }

    canvas.addEventListener("click", (event) => {
        if (count == 0) {
            video = video1;
        } else {
            video = video2;
        }

        const canvasRect = canvas.getBoundingClientRect();
        const xOffset = window.innerWidth - canvasRect.right;
        const yOffset = canvasRect.bottom - canvas.width;
        const clickX = event.clientX - xOffset;
        const clickY = event.clientY - yOffset;

        if (video.loaded && audio.loaded && video.paused && img.loaded) {
	    playVideo();
	}
    });

    drawStartScreen();
}

window.onload = main;
