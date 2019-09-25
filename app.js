function main() {
    const canvas = document.querySelector("#drawcanvas");
    const ctx = canvas.getContext("2d");
    const video = document.querySelector("#drawvideo");

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

        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        const txt = "Well done!";
        const size = ctx.measureText(txt);
        ctx.fillText(txt, canvas.width/2 - size.width/2, canvas.height/5);
        const txt2 = "Points: " + text;
        const size2 = ctx.measureText(txt2);
        ctx.fillText(txt2, canvas.width/2 - size2.width/2, canvas.height/5 * 3);
    }

    video.addEventListener("play", () => {
    	const time = Math.floor(Date.now() / 1000);
	const timer = 15;
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
