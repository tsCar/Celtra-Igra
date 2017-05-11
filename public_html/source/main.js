window.onload = function() {
    //screen.orientation.lock('portrait');
    let canvas = document.getElementById("canvas");
    let gumb=document.getElementById("jump");
    let ctx = canvas.getContext("2d");
    let width = canvas.width  = screen.width;
    let height = canvas.height = screen.height;

    let recty= height-40;
    let rectx=50;
    let rectdy=20;
    let rectdx=200;

    var ballx = 150;
    var bally = 20;
    var balldx = 0;
    var balldy = 0;

    window.ondevicemotion = function(event) {  
            let nagib = Math.round(event.accelerationIncludingGravity.y*10) / 10;
            if(nagib>1)
                balldx=2;
            else if(nagib<-1)
                balldx=-2;
            else balldx=0;  
        };
    gumb.ontouchstart=function(){
        for (i=60;i>0;i--){
            bally-=i;
            draw();
        }
    };
    update();

    function update() {
        ctx.clearRect(0, 0, width,height);
        ctx.rect(rectx,recty,rectdx,rectdy);
        ctx.fill();
        if (naPodlozi())balldy=0;
        else balldy=1;
        function drawBall() {
            ctx.beginPath();
            ctx.arc(ballx, bally, 10, 0, Math.PI*2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            ctx.closePath();
        }
        function draw() {
            drawBall();
            if (ballx+balldx>0 && ballx+balldx< canvas.width) ballx += balldx;
            bally += balldy;
        }
        function naPodlozi(){
            if (bally===recty && ballx>rectx && ballx<rectx+rectdx) return true;
            else return false;
        }
        draw();
        requestAnimationFrame(update);
    }
    
};