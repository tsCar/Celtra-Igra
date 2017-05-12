window.onload = function() {
    

    //screen.orientation.lock('portrait');
    let canvas = document.getElementById("canvas");
    let gumb=document.getElementById("jump");
    let ctx = canvas.getContext("2d");
    let width = canvas.width  = screen.width;
    let height = canvas.height = screen.height;


    var ikseviZaKvadrate=[50,285];
    var ipsiloniZaKvadrate=[height-40, height-80];
    var visineZaKvadrate=[20,20];
    var sirineZaKvadrate=[200,200];    

    var playerx = 150;
    var playery = 20;
    var playerdx = 0;
    var playerdy = 0;
    var skok=0;
    window.ondevicemotion = function(event) {  
            let nagib = Math.round(event.accelerationIncludingGravity.y*10) / 10;
            if(nagib>1)
                playerdx=1;
            else if(nagib<-1)
                playerdx=-1;
            else playerdx=0;  
        };
    function naPodlozi(){
        var indeks=ipsiloniZaKvadrate.indexOf(playery+10);
        if (indeks>=0){
            if (playerx>ikseviZaKvadrate[indeks] && playerx<ikseviZaKvadrate[indeks]+sirineZaKvadrate[indeks]) return true;
        }
        else return false;
    }
    gumb.ontouchstart=function(){
        if (skok<=0 && naPodlozi()) skok=70;
    };
    update();

    function update() {
        ctx.clearRect(0, 0, width,height);
        for (let i=0;i<ikseviZaKvadrate.length;i++){
            ctx.rect(ikseviZaKvadrate[i],ipsiloniZaKvadrate[i],sirineZaKvadrate[i],visineZaKvadrate[i]);
        }
        ctx.fillStyle = "#0099ee";
        ctx.fill();
        if (naPodlozi())playerdy=0;
        else playerdy=1;
        function drawPlayer() {
            ctx.beginPath();
            ctx.fillStyle = "#dd0000";
            ctx.arc(playerx, playery, 10, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
        function draw() {
            drawPlayer();
            if (playerx+playerdx>0 && playerx+playerdx< canvas.width) playerx += playerdx;
            if (skok>0){
                if (skok<30)playerdy=-1;
                else if (skok<50)playerdy=-2;
                else playerdy=-3;
                skok-=2;
            }
            playery += playerdy;
        }
        
        draw();
        requestAnimationFrame(update);
    }
    
};