window.onload = function() {
    

    //screen.orientation.lock('portrait');
    let canvas = document.getElementById("canvas");
    let gumb=document.getElementById("jump");
    var ctx = canvas.getContext("2d");
    let width = canvas.width  = screen.width;
    let height = canvas.height = screen.height;

    var visineZaPlatforme=[20,20,20,20,20,20,10];
    var sirineZaPlatforme=[150,100,110,200,250,50,250]; 
    var ikseviZaPlatforme=[Math.floor(width*0.7),Math.floor(width*0.30), Math.floor(width*0.8),Math.floor(width*0), Math.floor(width*0.7),Math.floor(width*0.200),Math.floor(width*0.15)];
    var ipsiloniZaPlatforme=[Math.floor(height-visineZaPlatforme[0]-1), Math.floor(height*0.45), Math.floor(height*0.7),Math.floor(height*0.3),Math.floor(height*0.350),Math.floor(height*0.500),Math.floor(height*0.75)];
   
    var okomiti=[2,5];
    var okomitiSmjerovi=[1,1];
    var vodoravni=[0,3,4,6];
    var vodoravniSmjerovi=[1,1,1,1];
//igrac
    var igracX = 150;
    var igracY = 20;
    var igracDx = 0;
    var igracDy = 0;
    var visinaIgraca=height*0.1;
    var polaVisineIgraca=visinaIgraca/2; //cesto se koristi, žrtvujem malo prostora za brzi rad
    var sirinaIgraca=height*0.1;
    var polaSirineIgraca=sirinaIgraca/2;
    var skok=0;
    var igrac=new Image();
    igrac.src='slicice/igrac.png';
//duh    
    var duhX = 300;
    var duhY = 300;
    var visinaDuha=height*0.08;
    var polaVisineDuha=visinaDuha/2;
    var sirinaDuha=height*0.08;
    var polaSirineDuha=sirinaDuha/2;
    var duhDx=0.35;
    var duhDy=0.35;
    var duhDesno=new Image();
    duhDesno.src='slicice/duhDesno.png';
    var duhLijevo=new Image();
    duhLijevo.src='slicice/duhLijevo.png';
    var duh=duhDesno;
    
    window.ondevicemotion = function(event) {  
            let nagib = Math.floor(event.accelerationIncludingGravity.y*10) / 10;
            if(nagib>1)
                igracDx=1;
            else if(nagib<-1)
                igracDx=-1;
            else igracDx=0;  
        };
    function naPodlozi(){
        var indeks=ipsiloniZaPlatforme.indexOf(Math.ceil(igracY+visinaIgraca));
        if (indeks>=0){ 
            if (igracX+sirinaIgraca>=ikseviZaPlatforme[indeks] && igracX<=ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]) return true;
        }
        else return false;
    }
    function naDuhu(){
        if(Math.abs(duhY-igracY-visinaIgraca)<=2 && igracX+sirinaIgraca>=duhX && igracX<=duhX+sirinaDuha) return true;
        else return false;
    }
    function duhPojeo(){
        if(Math.abs((igracY+polaVisineIgraca)-(duhY+polaVisineDuha))<(visinaDuha+visinaIgraca)/2 && Math.abs((igracX+polaSirineIgraca)-(duhX+polaSirineDuha))<(sirinaDuha+sirinaIgraca)/2) return true;
        else return false;
    }
    gumb.ontouchstart=function(){
        if (skok<=0)
            if((naPodlozi()||naDuhu())) skok=height*0.2;
    };   
    function nacrtaj(){
        ctx.clearRect(0, 0, width,height);
        ctx.beginPath();
        for (let i=0;i<ikseviZaPlatforme.length;i++){
            ctx.rect(ikseviZaPlatforme[i],ipsiloniZaPlatforme[i],sirineZaPlatforme[i],visineZaPlatforme[i]);
        }
        ctx.fillStyle = "#0099ee";
        ctx.fill();
        ctx.drawImage(igrac,igracX, igracY,sirinaIgraca, visinaIgraca);
        ctx.drawImage(duh,duhX,duhY,sirinaDuha,visinaDuha);
        ctx.font = "30px Arial";
        ctx.fillText(String(igracX),igracX+40,igracY+30);
        ctx.fillText(String(igracY),igracX,igracY);
    }
    function azuriraj() {
        //igrac
        let naDuhuSam=false;
        if (naPodlozi())igracDy=0;
        else if (naDuhu()){
            igracDy=-Math.abs(duhDy);
            naDuhuSam=true;
        }
        else igracDy=1;
        if (skok>0){
            if (skok<30)igracDy=-1;
            else if (skok<50)igracDy=-2;
            else igracDy=-3;
            skok-=2;
        }
        igracY += igracDy;
        if (igracX+igracDx>0 && igracX+igracDx< canvas.width) igracX += igracDx;
        //duh
        if(Math.round(duhX)===igracX) {
            duh=duhDesno;
        }
        else if(duhX<igracX){
            duhX+=duhDx;
            duh=duhDesno;
        }
        else {
            duhX-=duhDx;
            duh=duhLijevo;
        }
        if(duhY<igracY)duhY+=duhDy;
        else duhY-=duhDy;
                
        //jesam li pao u ponor
        if (igracY>=height||igracY<-visinaIgraca){ 
            alert('game over');
            location.reload();
        }
        //je li me duh pojeo
//        if(naDuhuSam===false){ //ako sam na duhu, ne moram provjeravat
//            if(duhPojeo()){
//                alert('game over');
//                location.reload();
//            }
//        } 
        //platforme
            //vodoravne
        for (let i=0;i<vodoravni.length;i++){
            let indeks=vodoravni[i];
            let mozeUsmjeru;
            if(vodoravniSmjerovi[i]===1){
                let mozeDesno=true;
                let tmp=ikseviZaPlatforme.indexOf(ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]+1);
                if(tmp>=0)
                    if(ipsiloniZaPlatforme[tmp]+visineZaPlatforme[tmp]>=ipsiloniZaPlatforme[indeks]&&ipsiloniZaPlatforme[tmp]+visineZaPlatforme[tmp]<=ipsiloniZaPlatforme[indeks]+visineZaPlatforme[indeks])
                        mozeDesno=false;
                if(ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]<width&&mozeDesno)mozeUsmjeru=true;
                else mozeUsmjeru=false;
            }
            else {
                let mozeLijevo=true;
                let tmp=ikseviZaPlatforme.indexOf(ikseviZaPlatforme[indeks]-1);
                if(tmp>=0)
                    if(ipsiloniZaPlatforme[tmp]+visineZaPlatforme[tmp]>=ipsiloniZaPlatforme[indeks]&&ipsiloniZaPlatforme[tmp]+visineZaPlatforme[tmp]<=ipsiloniZaPlatforme[indeks]+visineZaPlatforme[indeks])
                        mozeLijevo=false;
                if(ikseviZaPlatforme[indeks]>0&&mozeLijevo)mozeUsmjeru=true;
                else mozeUsmjeru=false;
            };
            if( mozeUsmjeru) ikseviZaPlatforme[indeks]+=vodoravniSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
            else vodoravniSmjerovi[i]=-vodoravniSmjerovi[i];
        }
        
        //crtanje
        nacrtaj();
        requestAnimationFrame(azuriraj);
    }
    //main
    requestAnimationFrame(azuriraj);
    
};