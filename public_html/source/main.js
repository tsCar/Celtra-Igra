window.onload = function() {
    //screen.orientation.lock('portrait');

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    let tekst=  document.getElementById("tu");

    let width = canvas.width ;
    let height = canvas.height;

    var x = canvas.width/2;
    var y = canvas.height-60;
    var dx = 0;
    var dy = 0;
    let count=0;
    let posy = null;

    //load tilesets
    let background = new Image();
    background.src = "slicice/pozadina.jpg";
    ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, width, height);

//    window.addEventListener('devicemotion', function(event) {
//        alert(event.accelerationIncludingGravity.x)

//    }, false);

    window.ondevicemotion = function(event) {  
        let nagib = Math.round(event.accelerationIncludingGravity.y*10) / 10;
        if(nagib>1)
            dx=2;
        else if(nagib<-1)
            dx=-2;
        else dx=0;
  
    };
        update();

    function update() {
//        ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, width, height);
        ctx.clearRect(0,0, width, height);
        ctx.drawImage(background, 0, 0, background.width, background.height, 0, 0, width, height);

        function drawBall() {
            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI*2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();

//            ctx.fillText(count,x,y);
//            count++;
        }

        function draw() {
            drawBall();
            x += dx;
            y += dy;
        }

        draw();
        requestAnimationFrame(update);
    }
};