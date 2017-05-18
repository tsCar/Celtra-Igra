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
    var ctx = canvas.getContext("2d");
    let sirinaCanvasa = canvas.width  = screen.width;
    let visinaCanvasa = canvas.height = screen.height;
//gumbi
    let gumbZaSkok=document.getElementById("jump");    
    let gumbZaBoostSkok=document.getElementById("boostJump");
    let gumbZaBoostBrzina=document.getElementById("boostSpeed");
    let gumbZaSkokIzNiceg=document.getElementById("skokIzNiceg");
    let hideA=document.getElementById("hideA");
    var gumbPocni = document.getElementById("start");
    gumbPocni.ontouchstart= vrtiIgru;
    var gumbPomoc = document.getElementById("pomoc");
    var gumbPostavke= document.getElementById("postavke");
    gumbPostavke.ontouchstart= otvoriPostavke;
    gumbPomoc.ontouchstart= pomoc;
    gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
    gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
    gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
    postaviGumbeZaMeni();
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
        ticksPerFrame : 8
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
    var Zvjezdica={
        prozirnost:1,
        prozirnostD:-0.01,
        X:111,
        Y:111
    };
    //postavke
    var zvuk=false;
    var gyro=true;
    var mrtav=false;

    function vrtiIgru(){
        //sakrij nepotrebna gumbe
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
                if(nagib>1) Igrac.Dx=1;
                else if(nagib<-1)
                    Igrac.Dx=-1;
                else Igrac.Dx=0;
            };
            else //napravi strelice, pomakni bonuse, napravi upravljanje strelicama
                ;
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
            if (boostZaBrzinuTrajeJos>0)Igrac.Dx*=2;
            Igrac.Y+=Igrac.Dy;
            if (Igrac.X+Igrac.Dx>0 && Igrac.X+Igrac.Dx<sirinaCanvasa) Igrac.X+=Igrac.Dx;

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
        //main
    }
    function pomoc(){
        let svePostavke=[];
        let count=0;
        svePostavke[0]=new Image();
        svePostavke[0].src = "slicice/skok.png";
        svePostavke[1]=new Image();
        svePostavke[1].src = "slicice/RCW49.jpg";
        makniGumbeZaMeni();
        window.addEventListener("touchstart",funkcijaZaEventHandler);
        function funkcijaZaEventHandler(){ 
            if(count<svePostavke.length){
                ctx.drawImage(svePostavke[count],sirinaCanvasa*0.1,visinaCanvasa*0.1,sirinaCanvasa*0.8,visinaCanvasa*0.8);
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
        alert('?');
        //pogasi sve druge gumbe
        //napravi gumbe za zvuk i kontrole
        //sound on, sound off, kontrole gyro, kontrole strelice - izabrani ima pozadinu u boji
        //dodaj im lstenere
        //napravi gumb za zatvorit postavke koji pobriše sve nove gumbe(i sebe) i upali gumbe za meni.
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
    }
};