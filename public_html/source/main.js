window.onload = function() {
 
    //boost
    var boostZaSkokTrajeJos=0;
    var dostupanBoostZaSkok=2;
    var boostZaBrzinuTrajeJos=0;
    var dostupanBoostZaBrzinu=2;
    var mozeSkokIzNiceg=false;
    var dostupanSkokIzNiceg=1;
    var brojacKadrova=0;
    var bonusAktivan=false;
    var boost=new Image();
    boost.src='slicice/boost.png';
//canvas
    let canvas = document.getElementById("canvas");
    let gumbZaSkok=document.getElementById("jump");
    let gumbZaBoostSkok=document.getElementById("boostJump");
    gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
    let gumbZaBoostBrzina=document.getElementById("boostSpeed");
    gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
    let gumbZaSkokIzNiceg=document.getElementById("skokIzNiceg");
    gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
    var ctx = canvas.getContext("2d");
    let sirinaCanvasa = canvas.width  = screen.width;
    let visinaCanvasa = canvas.height = screen.height;
//platforme
    var platforme=new Image();
    platforme.src='slicice/platforme.png';
    var visineZaPlatforme=[20,20,20,20,20,20,10];
    var sirineZaPlatforme=[150,100,110,200,250,50,250]; 
    var ikseviZaPlatforme=[Math.ceil(sirinaCanvasa*0.7),Math.ceil(sirinaCanvasa*0.30), Math.ceil(sirinaCanvasa*0.8),Math.ceil(sirinaCanvasa*0), Math.ceil(sirinaCanvasa*0.7),Math.ceil(sirinaCanvasa*0.15),Math.ceil(sirinaCanvasa*0.15)];
    var ipsiloniZaPlatforme=[Math.ceil(visinaCanvasa-visineZaPlatforme[0]-1), Math.ceil(visinaCanvasa*0.4), Math.ceil(visinaCanvasa*0.7),Math.ceil(visinaCanvasa*0.25),Math.ceil(visinaCanvasa*0.550),Math.ceil(visinaCanvasa*0.4),Math.ceil(visinaCanvasa*0.8)];
    var okomiti=[2,5];
    var okomitiSmjerovi=[1,1];
    var vodoravni=[0,3,4,6];
    var vodoravniSmjerovi=[1,1,1,1];
//igrac
    var igracX = sirinaCanvasa*0.15;
    var igracY = 20;
    var igracDx = 0;
    var igracDy = 0;
    var visinaIgraca=Math.round(visinaCanvasa*0.1);
    var polaVisineIgraca=visinaIgraca/2; //cesto se koristi, žrtvujem malo prostora za brzi rad
    var sirinaIgraca=Math.round(visinaCanvasa*0.1);
    var polaSirineIgraca=sirinaIgraca/2;
    var skok=0;
    var igrac=new Image();
    igrac.src = "slicice/brodic.png";
    var up=new Image();
    up.src = "slicice/up.png";
//sprite za igraca
    var sirinaSpritesheeta = 422;//864; 
    var visinaSpritesheeta = 314;//280; 
    var brojRedakaSpritesheet = 4; 
    var brojStupacaSpritesheet = 3; 
    var redakZaGore=0;
    var redakZaLijevo = 1; 
    var redakZaDesno = 2; 
    var redakZaRavno=3;
    var sirinaSprite = sirinaSpritesheeta/brojStupacaSpritesheet; 
    var visinaSprite = visinaSpritesheeta/brojRedakaSpritesheet; 
    var aktivniKadarSprite = 0; 
    var brojKadrovaSprite = 3; 
    var kadarX=0; 
    var kadarY=0; 
    var tickCount = 0;
    var ticksPerFrame = 8;
//duh    
    var duhX = sirinaCanvasa;
    var duhY = visinaCanvasa;
    var visinaDuha=visinaCanvasa*0.1;
    var polaVisineDuha=visinaDuha/2;
    var sirinaDuha=visinaCanvasa*0.1;
    var polaSirineDuha=sirinaDuha/2;
    var duhDx=0.20;
    var duhDy=0.20;
    var duhDesno=new Image();
    duhDesno.src='slicice/duhDesno.png';
    var duhLijevo=new Image();
    duhLijevo.src='slicice/duhLijevo.png';
    var duh=duhDesno;
//bodovi
    var zvjezdica=new Image();
    zvjezdica.src = "slicice/zvjezdica.png";
    var rezultat=0;
    var prozirnost=1;
    var prozirnostD=-0.01;
    var zvjezdicaX=111;
    var zvjezdicaY=111;
   
    function animirajZvjezdicu(){
       prozirnost+=prozirnostD;
       if (prozirnost<0.5||prozirnost>=1)prozirnostD*=-1;
   } 
    function jeZvjezdicaSkupljena(){
        if(Math.abs((igracY+polaVisineIgraca)-(zvjezdicaY+polaVisineIgraca))<(2*visinaIgraca)/2 && Math.abs((igracX+polaSirineIgraca)-(zvjezdicaX+polaSirineDuha))<(2*sirinaIgraca)/3) {//zvjezdica i igrač su iste veličine
            zvjezdicaY=Math.random()*0.9*visinaCanvasa;
            zvjezdicaX=Math.random()*0.9*sirinaCanvasa;
            rezultat+=100;
       }; 
    }
    function jeBonusSkupljen(){
        if(Math.abs((igracY+polaVisineIgraca)-(duhY-visinaIgraca+polaVisineIgraca))<(2*visinaIgraca)/3 && Math.abs((igracX+polaSirineIgraca)-(duhX+polaSirineIgraca))<(2*sirinaIgraca)/3){ //bonus je iste veličine kao i duh
            bonusAktivan=false;
            let sreca=Math.random();
            if(sreca<0.05){
                dostupanSkokIzNiceg++;
                gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
            }
            else if(sreca<47.5){
                dostupanBoostZaBrzinu++;
                gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
            }
            else {
                dostupanBoostZaSkok++;
                gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
            }
        }        
    }
    function animirajIgraca(){
        tickCount += 1;
        if (tickCount > ticksPerFrame) {
            tickCount = 0;        	
            // Go to the next frame
            aktivniKadarSprite = ++aktivniKadarSprite % brojKadrovaSprite;
        }
        kadarX = aktivniKadarSprite * sirinaSprite; 
        if(igracDx<0 ){
            kadarY = redakZaLijevo * visinaSprite; 
        }
        else if(igracDx>0){
            kadarY = redakZaDesno * visinaSprite; 
        }
        else {
            kadarY = redakZaRavno * visinaSprite; 
        }
        if(skok>0) kadarY = redakZaGore * visinaSprite; 

    }
    window.ondevicemotion = function(event) {  
            let nagib = Math.floor(event.accelerationIncludingGravity.y*10) / 10;
            if(nagib>1) igracDx=1;
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
        if(Math.abs((igracY+polaVisineIgraca)-(duhY+polaVisineDuha))<(visinaDuha+visinaIgraca)/3 && Math.abs((igracX+polaSirineIgraca)-(duhX+polaSirineDuha))<(sirinaDuha+sirinaIgraca)/3) return true; // dodiruju se već kad je <blabla/2 ali u igri to loše izgleda jer slike igraca i duha nisu pravokutnici
        else return false;
    }
    gumbZaSkok.ontouchstart=function(){
        if (skok<=0)
            if(naDuhu()||naPodlozi()||skoroNaLiftu()) {
                if(boostZaSkokTrajeJos>0)skok=visinaCanvasa*0.15;
                else skok=visinaCanvasa*0.1;
            }
            else if(mozeSkokIzNiceg){
                mozeSkokIzNiceg=false;
                if(boostZaSkokTrajeJos>0)skok=visinaCanvasa*0.15;
                else skok=visinaCanvasa*0.1;                
            }
    };   
    gumbZaBoostSkok.ontouchstart=function(){
        if(boostZaSkokTrajeJos<=0&&dostupanBoostZaSkok>0){
            dostupanBoostZaSkok--;
            boostZaSkokTrajeJos=600;
            gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
        }
    };
    gumbZaBoostBrzina.ontouchstart=function(){
        if(boostZaBrzinuTrajeJos<=0&&dostupanBoostZaBrzinu>0){
            dostupanBoostZaBrzinu--;
            boostZaBrzinuTrajeJos=600;
            gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
        }
    };
    gumbZaSkokIzNiceg.ontouchstart=function(){
        if(dostupanSkokIzNiceg>0){
            dostupanSkokIzNiceg--;
            mozeSkokIzNiceg=true;
            gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
        }        
    };
    function nacrtaj(){
        ctx.clearRect(0, 0, sirinaCanvasa,visinaCanvasa);
        ctx.beginPath();
        //crtanje platformi
        for (let i=0;i<ikseviZaPlatforme.length;i++){
            ctx.drawImage(platforme,ikseviZaPlatforme[i],ipsiloniZaPlatforme[i],sirineZaPlatforme[i],visineZaPlatforme[i]);
        }
        //crtanje igrača
        animirajIgraca();
        ctx.font = "15px Arial";
        if(igracY+visinaIgraca>=0){ //ako je igrač u ekranu, nacrtaj ga
            ctx.drawImage(igrac,kadarX,kadarY,sirinaSprite,visinaSprite,igracX,igracY,sirinaIgraca,visinaIgraca);
            if(mozeSkokIzNiceg) { //ako je aktiviran bonus za skok iz ničeg, nacrtaj malu poluprozirnu platformicu ispod igrača
                ctx.globalAlpha=0.25;
                ctx.drawImage(platforme,igracX,igracY+visinaIgraca,sirinaIgraca,5);
                ctx.globalAlpha=1;
            }
        }
        else { //ako nije, nacrtaj strelicu na x i napiši koliko je udaljen po y
            ctx.drawImage(up,igracX,25,sirinaIgraca,visinaIgraca );
            ctx.fillText(String(Math.round(igracY+visinaIgraca)),igracX,40+visinaIgraca);
        }
        if (boostZaBrzinuTrajeJos>0)ctx.fillText(String(boostZaBrzinuTrajeJos),igracX+40,igracY+30);
        if(boostZaSkokTrajeJos>0)ctx.fillText(String(boostZaSkokTrajeJos),igracX,igracY);
        //crtanje duha
        ctx.drawImage(duh,duhX,duhY,sirinaDuha,visinaDuha);
        //crtanje zvjezdice
        animirajZvjezdicu();
        ctx.globalAlpha=prozirnost;
        ctx.drawImage(zvjezdica,zvjezdicaX,zvjezdicaY,visinaIgraca,sirinaIgraca);
        ctx.globalAlpha=1;
        //crtanje bonusa
        if (bonusAktivan)ctx.drawImage(boost,duhX,duhY-visinaIgraca,visinaIgraca,sirinaIgraca);
        //ispis bodova
        ctx.fillText(String(rezultat),12,40);
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
                if(ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]<sirinaCanvasa&&mozeDesno)ikseviZaPlatforme[indeks]+=vodoravniSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
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
                if(ipsiloniZaPlatforme[indeks]+visineZaPlatforme[indeks]<visinaCanvasa&&mozeDolje)ipsiloniZaPlatforme[indeks]+=okomitiSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
                else okomitiSmjerovi[i]=-okomitiSmjerovi[i];
            };
        }
    }
    function pomakniIgraca(){
        let naDuhuSam=naDuhu();
        if (naLiftu()) igracDy=-1;
        else if ((skoroNaLiftu()||naPodlozi())&&naDuhuSam===false)igracDy=0;
        else if (naDuhuSam) igracDy=-Math.abs(duhDy);
        else igracDy=1;
        if (skok>0){
            if (skok<15)igracDy=-1;
            else if (skok<25)igracDy=-2;
            else igracDy=-3;
            skok--;
        }
        if (boostZaBrzinuTrajeJos>0)igracDx*=2;
        igracY+=igracDy;
        if (igracX+igracDx>0 && igracX+igracDx<sirinaCanvasa) igracX+=igracDx;

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
        if (igracY>=visinaCanvasa||igracY<-visinaCanvasa){ 
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
        brojacKadrova++;
        //boost
        if (dostupanBoostZaBrzinu) gumbZaBoostBrzina.style.display = 'block';
        else gumbZaBoostBrzina.style.display = 'none';
        if (dostupanBoostZaSkok) gumbZaBoostSkok.style.display = 'block';
        else gumbZaBoostSkok.style.display = 'none';
        if (dostupanSkokIzNiceg) gumbZaSkokIzNiceg.style.display = 'block';
        else gumbZaSkokIzNiceg.style.display = 'none';
        boostZaBrzinuTrajeJos--;
        boostZaSkokTrajeJos--;
        //platforme
        miciVodoravnePlatforme();
        miciOkomitePlatforme();  
        //igrac
        let naDuhuSam=pomakniIgraca();
        //duh
        pomakniDuha();
        //provjere za game over
        provjere(naDuhuSam);      
        //zvjezdice i bonusi
        jeZvjezdicaSkupljena();
        if (rezultat%2000===1){ //duh se ubrzava sa bodovima
            duhDx+=0.05;
            duhDy+=0.05;
        }
        brojacKadrova=brojacKadrova%5000;
        if(brojacKadrova===2500) bonusAktivan=true;
        if (bonusAktivan) jeBonusSkupljen();
        //crtanje
        nacrtaj();
        requestAnimationFrame(azuriraj);
    }
    //main
    requestAnimationFrame(azuriraj);
    
};