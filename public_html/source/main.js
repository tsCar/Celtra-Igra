window.onload = function() {
    

    //screen.orientation.lock('portrait');
    let canvas = document.getElementById("canvas");
    let gumb=document.getElementById("jump");
    var ctx = canvas.getContext("2d");
    let width = canvas.width  = screen.width;
    let height = canvas.height = screen.height;

    var visineZaPlatforme=[20,20,20,20,20,20,10];
    var sirineZaPlatforme=[150,100,110,200,250,50,250]; 
    var ikseviZaPlatforme=[Math.ceil(width*0.7),Math.ceil(width*0.30), Math.ceil(width*0.8),Math.ceil(width*0), Math.ceil(width*0.7),Math.ceil(width*0.15),Math.ceil(width*0.15)];
    var ipsiloniZaPlatforme=[Math.ceil(height-visineZaPlatforme[0]-1), Math.ceil(height*0.4), Math.ceil(height*0.7),Math.ceil(height*0.25),Math.ceil(height*0.550),Math.ceil(height*0.4),Math.ceil(height*0.8)];
   
    var okomiti=[2,5];
    var okomitiSmjerovi=[1,1];
    var vodoravni=[0,3,4,6];
    var vodoravniSmjerovi=[1,1,1,1];
//igrac
    var igracX = width*0.15;
    var igracY = 20;
    var igracDx = 0;
    var igracDy = 0;
    var visinaIgraca=Math.round(height*0.1);
    var polaVisineIgraca=visinaIgraca/2; //cesto se koristi, žrtvujem malo prostora za brzi rad
    var sirinaIgraca=Math.round(height*0.1);
    var polaSirineIgraca=sirinaIgraca/2;
    var skok=0;
    var igrac=new Image();
    igrac.src='slicice/igrac.png';
//duh    
    var duhX = width;
    var duhY = height;
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
        for (let indeks=0;indeks<ipsiloniZaPlatforme.length;indeks++){
            if (ipsiloniZaPlatforme[indeks]===Math.ceil(igracY+visinaIgraca)||ipsiloniZaPlatforme[indeks]===Math.floor(igracY+visinaIgraca))
                if (igracX+sirinaIgraca>=ikseviZaPlatforme[indeks] && igracX<=ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]) return true;
        }
        return false;
    }
    function naLiftu(){
        for (let indeks=0;indeks<okomiti.length;indeks++){
            if (ipsiloniZaPlatforme[okomiti[indeks]]===Math.ceil(igracY+visinaIgraca)||ipsiloniZaPlatforme[okomiti[indeks]]===Math.floor(igracY+visinaIgraca))
                if (igracX+sirinaIgraca>=ikseviZaPlatforme[okomiti[indeks]] && igracX<=ikseviZaPlatforme[okomiti[indeks]]+sirineZaPlatforme[okomiti[indeks]]) return true;
        }
        return false;
    }
    function skoroNaLiftu(){
        for (let indeks=0;indeks<okomiti.length;indeks++){
            if (ipsiloniZaPlatforme[okomiti[indeks]]===Math.ceil(igracY+visinaIgraca+1)||ipsiloniZaPlatforme[okomiti[indeks]]===Math.floor(igracY+visinaIgraca+1))
                if (igracX+sirinaIgraca>=ikseviZaPlatforme[okomiti[indeks]] && igracX<=ikseviZaPlatforme[okomiti[indeks]]+sirineZaPlatforme[okomiti[indeks]]) return true;
        }
        return false;
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
            if(naDuhu()||naPodlozi()||skoroNaLiftu()) skok=height*0.2;
    };   
    function nacrtaj(){
        ctx.clearRect(0, 0, width,height);
        ctx.beginPath();
        for (let i=0;i<ikseviZaPlatforme.length;i++){
            ctx.rect(ikseviZaPlatforme[i],ipsiloniZaPlatforme[i],sirineZaPlatforme[i],visineZaPlatforme[i]);
            ctx.fillText(String(ipsiloniZaPlatforme[i]),ikseviZaPlatforme[i],ipsiloniZaPlatforme[i]);
//            ctx.fillText(String(ikseviZaPlatforme[i]+sirineZaPlatforme[i]),ikseviZaPlatforme[i]+sirineZaPlatforme[i],ipsiloniZaPlatforme[i]);


        }
        ctx.fillStyle = "#0099ee";
        ctx.fill();
        ctx.drawImage(igrac,igracX, igracY,sirinaIgraca, visinaIgraca);
        ctx.drawImage(duh,duhX,duhY,sirinaDuha,visinaDuha);
        ctx.font = "15px Arial";
        ctx.fillText(String(igracX),igracX+40,igracY+30);
        ctx.fillText(String(igracY),igracX,igracY);
    }
    function miciVodoravnePlatforme(){
        for (let i=0;i<vodoravni.length;i++){
            let indeks=vodoravni[i];
            if(vodoravniSmjerovi[i]===1){
                let mozeDesno=true;
                for (let j=0;j<ikseviZaPlatforme.length;j++){
                    if (ikseviZaPlatforme[j]===ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]+1)
                        if(ipsiloniZaPlatforme[j]+visineZaPlatforme[j]>=ipsiloniZaPlatforme[indeks]&&ipsiloniZaPlatforme[j]<=ipsiloniZaPlatforme[indeks]+visineZaPlatforme[indeks])
                            mozeDesno=false;
                }
                if(ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]<width&&mozeDesno)ikseviZaPlatforme[indeks]+=vodoravniSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
                else vodoravniSmjerovi[i]=-vodoravniSmjerovi[i];
            }
            else {
                let mozeLijevo=true;
                for (let j=0;j<ipsiloniZaPlatforme.length;j++){
                    if (ikseviZaPlatforme[j]+sirineZaPlatforme[j]===ikseviZaPlatforme[indeks]-1)
                        if(ipsiloniZaPlatforme[j]+visineZaPlatforme[j]>=ipsiloniZaPlatforme[indeks]&&ipsiloniZaPlatforme[j]<=ipsiloniZaPlatforme[indeks]+visineZaPlatforme[indeks])
                            mozeLijevo=false;
                }
                if(ikseviZaPlatforme[indeks]>0&&mozeLijevo)ikseviZaPlatforme[indeks]+=vodoravniSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
                else vodoravniSmjerovi[i]=-vodoravniSmjerovi[i];
            };
        }
    }
    function miciOkomitePlatforme(){
        for (let i=0;i<okomiti.length;i++){
            let indeks=okomiti[i];
            if(okomitiSmjerovi[i]===-1){
                let mozeGore=true;
                for (let j=0;j<ipsiloniZaPlatforme.length;j++){
                    if (ipsiloniZaPlatforme[j]+visineZaPlatforme[j]===ipsiloniZaPlatforme[indeks]-1)
                        if(ikseviZaPlatforme[j]+sirineZaPlatforme[j]>=ikseviZaPlatforme[indeks]&&ikseviZaPlatforme[j]<=ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks])
                            mozeGore=false;
                }
                if(ipsiloniZaPlatforme[indeks]>visinaIgraca&&mozeGore)ipsiloniZaPlatforme[indeks]+=okomitiSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
                else okomitiSmjerovi[i]=-okomitiSmjerovi[i];
            }
            else {
                let mozeDolje=true;
                for (let j=0;j<ipsiloniZaPlatforme.length;j++){
                    if (ipsiloniZaPlatforme[j]===ipsiloniZaPlatforme[indeks]+visineZaPlatforme[indeks]+1)
                        if(ikseviZaPlatforme[j]+sirineZaPlatforme[j]>=ikseviZaPlatforme[indeks]&&ikseviZaPlatforme[j]<=ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks])
                            mozeDolje=false;
                }
                if(ipsiloniZaPlatforme[indeks]+visineZaPlatforme[indeks]<height&&mozeDolje)ipsiloniZaPlatforme[indeks]+=okomitiSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
                else okomitiSmjerovi[i]=-okomitiSmjerovi[i];
            };
        }
    }
    function pomakniIgraca(){
        let naDuhuSam=naDuhu();
        if (naLiftu()) igracDy=-1;
        else if (skoroNaLiftu()||naPodlozi())igracDy=0;
        else if (naDuhuSam) igracDy=-Math.abs(duhDy);
        else igracDy=1;
        if (skok>0){
            if (skok<30)igracDy=-1;
            else if (skok<50)igracDy=-2;
            else igracDy=-3;
            skok-=2;
        }
        igracY += igracDy;
        if (igracX+igracDx>0 && igracX+igracDx< canvas.width) igracX += igracDx;
        return naDuhuSam;
    }
    function pomakniDuha(){
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
        if(duhY<igracY+visinaIgraca/2)duhY+=duhDy;
        else duhY-=duhDy;
    }
    function provjere(naDuhuSam){
        //jesam li pao u ponor
        if (igracY>=height||igracY<-height*0.2){ 
            alert('game over');
            location.reload();
        }
        //je li me duh pojeo
        if(naDuhuSam===false){ //ako sam na duhu, ne moram provjeravat
            if(duhPojeo()){
                alert('game over');
                location.reload();
            }
        } 
    }
    function azuriraj() {
        //platforme
        miciVodoravnePlatforme();
        miciOkomitePlatforme();  
        //igrac
        let naDuhuSam=pomakniIgraca();
        //duh
        pomakniDuha();
        //provjere za game over
        provjere(naDuhuSam);      
        //crtanje
        nacrtaj();
        requestAnimationFrame(azuriraj);
    }
    //main
    requestAnimationFrame(azuriraj);
    
};