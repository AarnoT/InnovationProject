var video;
var video1;
var video2;
var video3;
var audio;
var img;
var ctx;
var canvas;
var count = 0;
var points = 0;
var menuOpen = true;

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
        points = parseInt(req.responseText, 10);
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

    if (points % 3 == 0) {
	ctx.fillStyle = "white";
    	ctx.font = "150% Arial";
        const txt3 = "Doing exercise helps to regulate the blood pressure, body presure, aids locomotion and helps burn excess fat in the body"
	const txt4 = "Constant or regular exercise helps to increase life expectancy rate of individuals!";
        const size3 = ctx.measureText(txt3);
        const size4 = ctx.measureText(txt4);
        ctx.fillText(txt3, canvas.width/2 - size3.width/2, canvas.height/5 * 4);
        ctx.fillText(txt4, canvas.width/2 - size4.width/2, canvas.height/10 * 9);
    }

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

function drawMenu() {    
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "lightgreen";
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "250% Arial";
    const txt = "Choose exercise";
    const size = ctx.measureText(txt);
    ctx.fillText(txt, canvas.width/2 - size.width/2, canvas.height/5);

    ctx.font = "150% Arial";
    const txt2 = "Stretching";
    const size2 = ctx.measureText(txt2);
    ctx.fillText(txt2, canvas.width/8, canvas.height/2);

    ctx.font = "150% Arial";
    const txt3 = "Bar raise";
    const size3 = ctx.measureText(txt3);
    ctx.fillText(txt3, canvas.width/9 * 4, canvas.height/2);

    ctx.font = "150% Arial";
    const txt4 = "Leg raise";
    const size4 = ctx.measureText(txt4);
    ctx.fillText(txt4, canvas.width/8 * 6, canvas.height/2);
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
    video3 = getVideoElement();
    video3.oncanplaythrough = function() {
        video3.loaded = true;
    };
    video1.src = "https://giant.gfycat.com/ViciousCriminalGelada.webm";
    video2.src = "https://giant.gfycat.com/MixedLeadingApatosaur.webm";
    video3.src = "https://giant.gfycat.com/NaturalLimpGermanpinscher.webm";

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

    const url_parts = window.location.href.split('?');
    if (url_parts.length >= 2) {
        const search = new URLSearchParams(url_parts[1]);
        const user = search.get('user');
        const req = new XMLHttpRequest();
        req.open('GET', '/getPoints?name=' + user, false);
        req.send();
        points = parseInt(req.responseText, 10);
    }

    canvas.addEventListener("click", (event) => {
        const canvasRect = canvas.getBoundingClientRect();
        const xOffset = window.innerWidth - canvasRect.right;
        const yOffset = canvasRect.bottom - canvas.width;
        const clickX = event.clientX - xOffset;
        const clickY = event.clientY - yOffset;

        var videoSet = false;
	if (clickY > canvas.height/5 * 2 &&
	    clickY < canvas.height/4 * 3) {
	    if (clickX < canvas.width/9 * 4) {
		video = video1;
	    } else if (clickX < canvas.width/8 * 6) {
		video = video2;
	    } else {
		video = video3;
	    }
	    videoSet = true;
	}

        if (videoSet && menuOpen && video.loaded && audio.loaded && video.paused && img.loaded) {
	    menuOpen = false;
	    playVideo();
	} else if (!menuOpen && video.paused) {
	    menuOpen = true;
	    drawMenu();
	}
    });

    drawMenu();
}

window.onload = main;
