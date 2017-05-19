window.onload = function() {
//boost
//ToDo: sličicca za portrait mode
    window.scrollTo(0, 1);
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
    var ctx = canvas.getContext("2d");
    if(screen.width>screen.height){ 
        var sirinaCanvasa = canvas.width  = screen.width;
        var visinaCanvasa = canvas.height = screen.height;
    }
    else {
        var sirinaCanvasa = canvas.width  = screen.height;
        var visinaCanvasa = canvas.height = screen.width;
    }    
    var wrapper=document.getElementById("wrapper");
//gumbi
    let gumbZaSkok=document.getElementById("jump");    
    let gumbZaBoostSkok=document.getElementById("boostJump");
    let gumbZaBoostBrzina=document.getElementById("boostSpeed");
    let gumbZaSkokIzNiceg=document.getElementById("skokIzNiceg");
    var hideA=document.getElementById("hideA");
    var gumbPocni = document.getElementById("start");
    gumbPocni.ontouchstart= vrtiIgru;
    var gumbPomoc = document.getElementById("pomoc");
    var gumbPostavke= document.getElementById("postavke");
    gumbPostavke.ontouchstart= otvoriPostavke;
    gumbPomoc.ontouchstart= pomoc;
    gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
    gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
    gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
    ctx.font="15px Arial";

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
    var Igrac={
        X : sirinaCanvasa*0.15,
        Y : 20,
        Dx : 0,
        Dy : 0,
        visina:Math.round(visinaCanvasa*0.1),
        get polaVisine(){return this.visina/2;}, //cesto se koristi, žrtvujem malo prostora za brzi rad
        sirina:Math.round(visinaCanvasa*0.1),
        get polaSirine(){return this.sirina/2;},
        skok:0,
        //sprite za igraca
        sirinaSpritesheeta : 422,
        visinaSpritesheeta : 314, 
        brojRedakaSpritesheet : 4, 
        brojStupacaSpritesheet : 3, 
        redakZaGore : 0,
        redakZaLijevo : 1, 
        redakZaDesno : 2,
        redakZaRavno : 3,
        get sirinaSprite(){return this.sirinaSpritesheeta/this.brojStupacaSpritesheet;},
        get visinaSprite(){return this.visinaSpritesheeta/this.brojRedakaSpritesheet;},
        aktivniKadarSprite : 0,
        brojKadrovaSprite : 3,
        kadarX : 0,
        kadarY : 0, 
        tickCount : 0,
        ticksPerFrame : 8,
        idiLijevo:false,
        idiDesno:false
    };
    var igrac=new Image();
    igrac.src = "slicice/brodic.png";
    var up=new Image();
    up.src = "slicice/up.png";
//duh  
    var Duh={
        X : sirinaCanvasa,
        Y : visinaCanvasa,
        visina:visinaCanvasa*0.1,
        get polaVisine(){return this.visina/2;},
        sirina:visinaCanvasa*0.1,
        get polaSirine(){return this.sirina/2;},
        Dx:0.20,
        Dy:0.20
    };
    var duhDesno=new Image();
    duhDesno.src='slicice/duhDesno.png';
    var duhLijevo=new Image();
    duhLijevo.src='slicice/duhLijevo.png';
    var duh=duhDesno;
//bodovi
    var zvjezdica=new Image();
    zvjezdica.src = "slicice/zvjezdica.png";
    var rezultat=0;
    var topScore= document.getElementById("top");
    let topScoreValue=getCookie('rezultat');
    if (topScoreValue!=='') topScore.innerText='Top Score: '+topScoreValue;
    else topScore.innerText='Top Score: 0';

    var Zvjezdica={
        prozirnost:1,
        prozirnostD:-0.01,
        X:111,
        Y:111
    };
    //postavke
    var zvuk;
    if (getCookie('zvuk')==='upaljen')zvuk=true;
    else zvuk=false;
    var gyro;
    if (getCookie('gyro')==='ugasen')gyro=false;
    else gyro=true;    
    var mrtav=false;
    postaviGumbeZaMeni();

    function vrtiIgru(){
        makniGumbeZaMeni();
        postaviGumbeZaIgru();
        if(!mrtav)requestAnimationFrame(azuriraj);
        function animirajZvjezdicu(){
           Zvjezdica.prozirnost+=Zvjezdica.prozirnostD;
           if (Zvjezdica.prozirnost<0.5||Zvjezdica.prozirnost>=1)Zvjezdica.prozirnostD*=-1;
       } 
        function jeZvjezdicaSkupljena(){
            if(Math.abs((Igrac.Y+Igrac.polaVisine)-(Zvjezdica.Y+Igrac.polaVisine))<(2*Igrac.visina)/2 && Math.abs((Igrac.X+Igrac.polaSirine)-(Zvjezdica.X+Duh.polaSirine))<(2*Igrac.sirina)/3) {//zvjezdica i igrač su iste veličine
                Zvjezdica.Y=Math.random()*0.9*visinaCanvasa;
                Zvjezdica.X=Math.random()*0.9*sirinaCanvasa;
                rezultat+=100;
           }; 
        }
        function jeBonusSkupljen(){
            if(Math.abs((Igrac.Y+Igrac.polaVisine)-(Duh.Y-Igrac.visina+Igrac.polaVisine))<(2*Igrac.visina)/3 && Math.abs((Igrac.X+Igrac.polaSirine)-(Duh.X+Igrac.polaSirine))<(2*Igrac.sirina)/3){ //bonus je iste veličine kao i duh
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
            Igrac.tickCount += 1;
            if (Igrac.tickCount > Igrac.ticksPerFrame) {
                Igrac.tickCount = 0;        	
                // Go to the next frame
                Igrac.aktivniKadarSprite = ++Igrac.aktivniKadarSprite % Igrac.brojKadrovaSprite;
            }
            Igrac.kadarX = Igrac.aktivniKadarSprite * Igrac.sirinaSprite; 
            if(Igrac.Dx<0 ){
                Igrac.kadarY = Igrac.redakZaLijevo * Igrac.visinaSprite; 
            }
            else if(Igrac.Dx>0){
                Igrac.kadarY = Igrac.redakZaDesno * Igrac.visinaSprite; 
            }
            else {
                Igrac.kadarY = Igrac.redakZaRavno * Igrac.visinaSprite; 
            }
            if(Igrac.skok>0) Igrac.kadarY = Igrac.redakZaGore * Igrac.visinaSprite; 
        }
        if(gyro)window.ondevicemotion = function(event) {  
                let nagib = Math.floor(event.accelerationIncludingGravity.y*10) / 10;
                if(nagib>1) Igrac.idiDesno=true;
                else if(nagib<-1) Igrac.idiLijevo=true;
                else {
                    Igrac.idiDesno=false;
                    Igrac.idiLijevo=false;
                }
            };
        else {
            //pomakni gumbe za bonus
            gumbZaSkokIzNiceg.style.bottom='40vh';
            gumbZaBoostBrzina.style.bottom='15vh';
            gumbZaBoostSkok.style.bottom='15vh';
            //napravi strelice
            var kontrolaLijevo = document.createElement('button');
            wrapper.appendChild(kontrolaLijevo);
            postaviGumb(kontrolaLijevo,1,90);
            kontrolaLijevo.style.backgroundImage="url('slicice/left.png')";
            kontrolaLijevo.style.display = 'block';
            kontrolaLijevo.innerText='left';
            kontrolaLijevo.style.textIndent='-2222px';
            kontrolaLijevo.style.width='10%';
            kontrolaLijevo.style.height='10%';
            kontrolaLijevo.style.backgroundSize= '100% 100%';
            kontrolaLijevo.ontouchstart=function(){Igrac.idiLijevo=true;};
            kontrolaLijevo.ontouchend=function(){Igrac.idiLijevo=false;};
            
            var kontrolaDesno = document.createElement('button');
            wrapper.appendChild(kontrolaDesno);
            postaviGumb(kontrolaDesno,20,90);
            kontrolaDesno.style.backgroundImage='url("slicice/right.png")';
            kontrolaDesno.style.display = 'block';
            kontrolaDesno.innerText='right';
            kontrolaDesno.style.textIndent='-2222px';
            kontrolaDesno.style.width='10%';
            kontrolaDesno.style.height='10%';
            kontrolaDesno.style.backgroundSize= '100% 100%';
            kontrolaDesno.ontouchstart=function(){Igrac.idiDesno=true;};
            kontrolaDesno.ontouchend=function(){Igrac.idiDesno=false;};
        };
        function naPodlozi(){
            for (let indeks=0;indeks<ipsiloniZaPlatforme.length;indeks++){
                if (ipsiloniZaPlatforme[indeks]===Math.ceil(Igrac.Y+Igrac.visina)||ipsiloniZaPlatforme[indeks]===Math.floor(Igrac.Y+Igrac.visina))
                    if (Igrac.X+Igrac.sirina>=ikseviZaPlatforme[indeks] && Igrac.X<=ikseviZaPlatforme[indeks]+sirineZaPlatforme[indeks]) return true;
            }
            return false;
        }
        function naLiftu(){
            for (let indeks=0;indeks<okomiti.length;indeks++){
                if (ipsiloniZaPlatforme[okomiti[indeks]]===Math.ceil(Igrac.Y+Igrac.visina)||ipsiloniZaPlatforme[okomiti[indeks]]===Math.floor(Igrac.Y+Igrac.visina))
                    if (Igrac.X+Igrac.sirina>=ikseviZaPlatforme[okomiti[indeks]] && Igrac.X<=ikseviZaPlatforme[okomiti[indeks]]+sirineZaPlatforme[okomiti[indeks]]) return true;
            }
            return false;
        }
        function skoroNaLiftu(){
            for (let indeks=0;indeks<okomiti.length;indeks++){
                if (ipsiloniZaPlatforme[okomiti[indeks]]===Math.ceil(Igrac.Y+Igrac.visina+1)||ipsiloniZaPlatforme[okomiti[indeks]]===Math.floor(Igrac.Y+Igrac.visina+1))
                    if (Igrac.X+Igrac.sirina>=ikseviZaPlatforme[okomiti[indeks]] && Igrac.X<=ikseviZaPlatforme[okomiti[indeks]]+sirineZaPlatforme[okomiti[indeks]]) return true;
            }
            return false;
        }
        function naDuhu(){
            if(Math.abs(Duh.Y-Igrac.Y-Igrac.visina)<=2 && Igrac.X+Igrac.sirina>=Duh.X && Igrac.X<=Duh.X+Duh.sirina) return true;
            else return false;
        }
        gumbZaSkok.ontouchstart=function(){
            if (Igrac.skok<=0)
                if(naDuhu()||naPodlozi()||skoroNaLiftu()) {
                    if(boostZaSkokTrajeJos>0)Igrac.skok=visinaCanvasa*0.15;
                    else Igrac.skok=visinaCanvasa*0.1;
                }
                else if(mozeSkokIzNiceg){
                    mozeSkokIzNiceg=false;
                    if(boostZaSkokTrajeJos>0)Igrac.skok=visinaCanvasa*0.15;
                    else Igrac.skok=visinaCanvasa*0.1;                
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
            if (mrtav){
                ctx.drawImage(duhLijevo,0,0);
                ctx.fillText('Game over',sirinaCanvasa*0.7,visinaCanvasa*0.3);
                setTimeout(function() {location.reload();}, 1500);
            }
            else{
                //crtanje platformi
                for (let i=0;i<ikseviZaPlatforme.length;i++){
                    ctx.drawImage(platforme,ikseviZaPlatforme[i],ipsiloniZaPlatforme[i],sirineZaPlatforme[i],visineZaPlatforme[i]);
                }
                //crtanje igrača
                animirajIgraca();
                ctx.font = "15px Arial";
                ctx.fillStyle = 'Black';
                if(Igrac.Y+Igrac.visina>=0){ //ako je igrač u ekranu, nacrtaj ga
                    ctx.drawImage(igrac,Igrac.kadarX,Igrac.kadarY,Igrac.sirinaSprite,Igrac.visinaSprite,Igrac.X,Igrac.Y,Igrac.sirina,Igrac.visina);
                    if(mozeSkokIzNiceg) { //ako je aktiviran bonus za Igrac.skok iz ničeg, nacrtaj malu poluprozirnu platformicu ispod igrača
                        ctx.globalAlpha=0.25;
                        ctx.drawImage(platforme,Igrac.X,Igrac.Y+Igrac.visina,Igrac.sirina,5);
                        ctx.globalAlpha=1;
                    }
                }
                else { //ako nije, nacrtaj strelicu na x i napiši koliko je udaljen po y
                    ctx.drawImage(up,Igrac.X,25,Igrac.sirina,Igrac.visina );
                    ctx.fillText(String(Math.round(Igrac.Y+Igrac.visina)),Igrac.X,40+Igrac.visina);
                }
                if (boostZaBrzinuTrajeJos>0)ctx.fillText(String(boostZaBrzinuTrajeJos),Igrac.X+40,Igrac.Y+30);
                if(boostZaSkokTrajeJos>0)ctx.fillText(String(boostZaSkokTrajeJos),Igrac.X,Igrac.Y);
                //crtanje duha
                ctx.drawImage(duh,Duh.X,Duh.Y,Duh.sirina,Duh.visina);
                //crtanje zvjezdice
                animirajZvjezdicu();
                ctx.globalAlpha=Zvjezdica.prozirnost;
                ctx.drawImage(zvjezdica,Zvjezdica.X,Zvjezdica.Y,Igrac.visina,Igrac.sirina);
                ctx.globalAlpha=1;
                //crtanje bonusa
                if (bonusAktivan)ctx.drawImage(boost,Duh.X,Duh.Y-Igrac.visina,Igrac.visina,Igrac.sirina);
                //ispis bodova
                ctx.font = "25px Arial";
                ctx.fillStyle = 'Wheat';
                ctx.fillText(String(rezultat) , (canvas.width/2) - (ctx.measureText(String(rezultat)).width / 2), 50);
            }
            
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
                    if(ipsiloniZaPlatforme[indeks]>Igrac.visina&&mozeGore)ipsiloniZaPlatforme[indeks]+=okomitiSmjerovi[i];  //ako može kamo želi, pomakni ga, ako ne, promijeni smjer i ne miči          
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
            //pomak po y
            if (naLiftu()) Igrac.Dy=-1;
            else if ((skoroNaLiftu()||naPodlozi())&&naDuhuSam===false)Igrac.Dy=0;
            else if (naDuhuSam) Igrac.Dy=-Math.abs(Duh.Dy);
            else Igrac.Dy=1;
            if (Igrac.skok>0){
                if (Igrac.skok<15)Igrac.Dy=-1;
                else if (Igrac.skok<25)Igrac.Dy=-2;
                else Igrac.Dy=-3;
                Igrac.skok--;
            }
            Igrac.Y+=Igrac.Dy;
            //pomak po x
            if (Igrac.X+Igrac.Dx>0 && Igrac.X+Igrac.Dx<sirinaCanvasa) {
                if(Igrac.idiDesno)Igrac.Dx=1;
                else if (Igrac.idiLijevo)Igrac.Dx=-1;
                else Igrac.Dx=0;
            }
            else Igrac.Dx=0;
            if (boostZaBrzinuTrajeJos>0)Igrac.Dx*=2;
            Igrac.X+=Igrac.Dx;
            return naDuhuSam;
        }
        function pomakniDuha(){
            if(Math.round(Duh.X)===Igrac.X) {
                duh=duhDesno;
            }
            else if(Duh.X<Igrac.X){
                Duh.X+=Duh.Dx;
                duh=duhDesno;
            }
            else {
                Duh.X-=Duh.Dx;
                duh=duhLijevo;
            }
            if(Duh.Y<Igrac.Y+Igrac.visina/2)Duh.Y+=Duh.Dy;
            else Duh.Y-=Duh.Dy;
        }
        function provjere(naDuhuSam){
            //jesam li pao u ponor
            if (Igrac.Y>=visinaCanvasa||Igrac.Y<-visinaCanvasa) return true;
            //je li me duh pojeo
            if(naDuhuSam===false) //ako sam na duhu, ne moram provjeravat
                if(Math.abs((Igrac.Y+Igrac.polaVisine)-(Duh.Y+Duh.polaVisine))<(Duh.visina+Igrac.visina)/3 && Math.abs((Igrac.X+Igrac.polaSirine)-(Duh.X+Duh.polaSirine))<(Duh.sirina+Igrac.sirina)/3) return true; // dodiruju se već kad je <blabla/2 ali u igri to loše izgleda jer slike igraca i duha nisu pravokutnici
            return false;
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
            mrtav=provjere(naDuhuSam);   
            if(mrtav){
                let cookieZaRezultat=getCookie('rezultat');
                if(cookieZaRezultat ==='')setCookie('rezultat',String(rezultat));
                else if( rezultat>parseInt(cookieZaRezultat)) setCookie('rezultat',String(rezultat));
            }
            //zvjezdice i bonusi
            jeZvjezdicaSkupljena();
            if (rezultat%2000===1){ //duh se ubrzava sa bodovima
                Duh.Dx+=0.05;
                Duh.Dy+=0.05;
            }
            brojacKadrova=brojacKadrova%5000;
            if(brojacKadrova===2500) bonusAktivan=true;
            if (bonusAktivan) jeBonusSkupljen();
            //crtanje
            nacrtaj();
            if(!mrtav)requestAnimationFrame(azuriraj);
        }
    }
    function pomoc(){
        let svaPomoc=[];
        let count=0;
        //ToDo: napravit i dodat prave sličice
        svaPomoc[0]=new Image();
        svaPomoc[0].src = "slicice/skok.png";
        svaPomoc[1]=new Image();
        svaPomoc[1].src = "slicice/RCW49.jpg";
        makniGumbeZaMeni();
        window.addEventListener("touchstart",funkcijaZaEventHandler);
        function funkcijaZaEventHandler(){ 
            if(count<svaPomoc.length){
                ctx.drawImage(svaPomoc[count],sirinaCanvasa*0.1,visinaCanvasa*0.1,sirinaCanvasa*0.8,visinaCanvasa*0.8);
                ctx.fillText('tap to continue',sirinaCanvasa*0.1+20,visinaCanvasa*0.1+20);
                count++;
            }
            else {
                ctx.clearRect(0, 0, sirinaCanvasa,visinaCanvasa);
                window.removeEventListener("touchstart",funkcijaZaEventHandler);
                postaviGumbeZaMeni();
            }
        }
    };
    function otvoriPostavke(){
        makniGumbeZaMeni();
        ctx.drawImage(igrac,sirinaCanvasa*0.1,visinaCanvasa*0.1,sirinaCanvasa*0.8,visinaCanvasa*0.8);//ToDo prava slika
        //napravi gumbe za zvuk i kontrole
        var gumbZvukOn = document.createElement('button');
        wrapper.appendChild(gumbZvukOn);
        postaviGumb(gumbZvukOn,10,30);
        gumbZvukOn.innerText='Sound ON';
        gumbZvukOn.style.display = 'block';
        gumbZvukOn.style.width='40%';
        gumbZvukOn.style.textAlign='center';
        gumbZvukOn.ontouchstart=function(){
            zvuk=true;
            obojajPozadinu();
        };
        
        var gumbZvukOff = document.createElement('button');
        wrapper.appendChild(gumbZvukOff);
        postaviGumb(gumbZvukOff,50,30);
        gumbZvukOff.innerText='Sound OFF';
        gumbZvukOff.style.display = 'block';
        gumbZvukOff.style.width='40%';
        gumbZvukOff.style.textAlign='center';
        gumbZvukOff.ontouchstart=function(){
            zvuk=false;
            obojajPozadinu();
        } ;  
        
        var gumbGyroOn = document.createElement('button');
        wrapper.appendChild(gumbGyroOn);
        postaviGumb(gumbGyroOn,10,60);
        gumbGyroOn.innerText='Controls: Gyro';
        gumbGyroOn.style.display = 'block';
        gumbGyroOn.style.width='40%';
        gumbGyroOn.style.textAlign='center';
        gumbGyroOn.ontouchstart=function(){
            gyro=true;
            obojajPozadinu();
        };
        
        
        var gumbGyroOff = document.createElement('button');
        wrapper.appendChild(gumbGyroOff);
        postaviGumb(gumbGyroOff,50,60);
        gumbGyroOff.innerText='Controls: Arrows';
        gumbGyroOff.style.display = 'block';
        gumbGyroOff.style.width='40%';
        gumbGyroOff.style.textAlign='center';
        gumbGyroOff.ontouchstart=function(){
            gyro=false;
            obojajPozadinu();
        } ;  
        
        var gumbZatvoriPostavke = document.createElement('button');
        wrapper.appendChild(gumbZatvoriPostavke);
        postaviGumb(gumbZatvoriPostavke,80,80);
        gumbZatvoriPostavke.innerText='Done';
        gumbZatvoriPostavke.style.display = 'block';
        gumbZatvoriPostavke.ontouchstart=function(){
            gumbZvukOn.parentNode.removeChild(gumbZvukOn);
            gumbZvukOff.parentNode.removeChild(gumbZvukOff);
            gumbGyroOn.parentNode.removeChild(gumbGyroOn);
            gumbGyroOff.parentNode.removeChild(gumbGyroOff);
            gumbZatvoriPostavke.parentNode.removeChild(gumbZatvoriPostavke);
            ctx.clearRect(0, 0, sirinaCanvasa,visinaCanvasa);
            postaviGumbeZaMeni();
            if (zvuk) setCookie('zvuk','upaljen',30);
            else setCookie('zvuk','ugasen',30);
            if (gyro) setCookie('gyro','upaljen',30);
            else setCookie('gyro','ugasen',30);
        } ;  
        //obojaj pozadinu
        obojajPozadinu();
        function obojajPozadinu(){
            if(zvuk){
                gumbZvukOn.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
                gumbZvukOff.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
            }
            else {
                gumbZvukOn.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbZvukOff.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
            }
            if(gyro){
                gumbGyroOn.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
                gumbGyroOff.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
            }
            else {
                gumbGyroOn.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbGyroOff.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
            }
        }
    }
    function postaviGumbeZaIgru(){
        gumbZaSkok.style.display = 'block';
        gumbZaBoostSkok.style.display = 'block';
        gumbZaBoostBrzina.style.display = 'block';
        gumbZaSkokIzNiceg.style.display = 'block';
    }
    function postaviGumbeZaMeni(){
        gumbPocni.style.display = 'block';
        gumbPomoc.style.display = 'block';
        hideA.style.display = 'block';
        gumbPostavke.style.display = 'block';
        topScore.style.display = 'block';
    }
    function makniGumbeZaIgru(){
        gumbZaSkok.style.display = 'none';
        gumbZaBoostSkok.style.display = 'none';
        gumbZaBoostBrzina.style.display = 'none';
        gumbZaSkokIzNiceg.style.display = 'none';
    }
    function makniGumbeZaMeni(){
        gumbPocni.style.display = 'none';
        gumbPomoc.style.display = 'none';
        hideA.style.display = 'none';
        gumbPostavke.style.display = 'none';
        topScore.style.display = 'none';
    }
    function postaviGumb(gumb, x, y) {
            gumb.style.position = "absolute";
            gumb.style.left = x+'%';
            gumb.style.top = y+'%';
        }      
    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires="+d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
};