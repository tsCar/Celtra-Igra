window.onload = function() {
//boost
//ToDo riješit duha/ bonus da ne titra
//ToDo dokumentacija
//ToDo možda teleportere dodat
//ToDo možda animacije za skupljanje
//ToDo custom zvukići za playful skin

    var skin;
        if (getCookie('skin')!=='')skin=getCookie('skin');
        else skin='normalSkin/';
    document.getElementById("warning-message").style.backgroundImage='url('.concat(skin,'slicice/portrait.png)');
    var paused=false;
    var boostZaSkokTrajeJos=0;
    var dostupanBoostZaSkok=2;
    var boostZaBrzinuTrajeJos=0;
    var dostupanBoostZaBrzinu=2;
    var mozeSkokIzNiceg=false;
    var dostupanSkokIzNiceg=1;
    var brojacKadrova=0;
    var bonusAktivan=false;
    var boost=new Image();
        boost.src =skin.concat('slicice/boost.png');
//canvas
    let canvas = document.getElementById("canvas");
        canvas.style.backgroundImage='url('.concat(skin,'slicice/pozadina0.png)');
        if(screen.width>screen.height){ 
        var sirinaCanvasa = canvas.width  = screen.width;
        var visinaCanvasa = canvas.height = screen.height;
    }
        else {
        var sirinaCanvasa = canvas.width  = screen.height;
        var visinaCanvasa = canvas.height = screen.width;
    }    
    var ctx = canvas.getContext("2d");
    var wrapper=document.getElementById("wrapper");
    //postavke
    var zvuk;
        if (getCookie('zvuk')==='upaljen')zvuk=true;
        else zvuk=false;
    var gyro;
        if (getCookie('gyro')==='ugasen')gyro=false;
        else gyro=true;   
    var brzinaDuha;
        if (getCookie('brzinaDuha')==='medium')brzinaDuha=0.35;
        else if (getCookie('brzinaDuha')==='hard')brzinaDuha=0.5;
        else brzinaDuha=0.2;
    //muzika
    var muzikaZaMenu = new Audio(skin.concat('zvukici/menu.wav'));
        muzikaZaMenu.loop = true;
    var muzikaZaIgru = new Audio(skin.concat('zvukici/igra.mp3'));
        muzikaZaIgru.loop = true;
    var maliSkok = new Audio(skin.concat('zvukici/maliSkok.mp3'));
    var velikiSkok = new Audio(skin.concat('zvukici/velikiSkok.mp3'));
    var boostSound = new Audio(skin.concat('zvukici/boost.mp3'));
    var zaKraj = new Audio(skin.concat('zvukici/zaKraj.mp3'));
    var skupi = new Audio(skin.concat('zvukici/skupi.mp3'));
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
        sirinaSpritesheeta : 844,
        visinaSpritesheeta : 629, 
        brojRedakaSpritesheet : 4, 
        brojStupacaSpritesheet : 3, 
        redakZaGore : 0,
        redakZaLijevo : 1, 
        redakZaDesno : 2,
        redakZaRavno : 3,
        get sirinaSprite(){return this.sirinaSpritesheeta/this.brojStupacaSpritesheet;},
        get visinaSprite(){return this.visinaSpritesheeta/this.brojRedakaSpritesheet;},
        aktivniKadarSprite : 0,
        kadarX : 0,
        kadarY : 0, 
        tickCount : 0,
        ticksPerFrame : 4,
        idiLijevo:false,
        idiDesno:false,
        mrtav:true
    };
    var igrac=new Image();
        igrac.src =skin.concat( "slicice/brodic.png");
    var up=new Image();
        up.src =skin.concat( "slicice/up.png");
//duh  
    var Duh={
        X : sirinaCanvasa,
        Y : visinaCanvasa,
        visina:visinaCanvasa*0.1,
        get polaVisine(){return this.visina/2;},
        sirina:visinaCanvasa*0.1,
        get polaSirine(){return this.sirina/2;},
        Dx:brzinaDuha,
        Dy:brzinaDuha,
        ubrzava:0
    };
    var duhDesno=new Image();
    var duhLijevo=new Image();
    var duh;
    //gumbi
    let gumbZaSkok=document.getElementById("jump");  
        gumbZaSkok.style.backgroundImage='url('.concat(skin,'slicice/skok.png)');
        gumbZaSkok.ontouchstart=function(){
            if (Igrac.skok<=0)
                if(naDuhu()||naPodlozi()||skoroNaLiftu()) {
                    if(zvuk){
                        if(boostZaSkokTrajeJos>0)velikiSkok.play();
                        else maliSkok.play();
                    }
                    if(boostZaSkokTrajeJos>0)Igrac.skok=visinaCanvasa*0.15;
                    else Igrac.skok=visinaCanvasa*0.1;
                }
                else if(mozeSkokIzNiceg){
                    if(zvuk){
                        if(boostZaSkokTrajeJos>0)velikiSkok.play();
                        else maliSkok.play();
                    }
                    mozeSkokIzNiceg=false;
                    if(boostZaSkokTrajeJos>0)Igrac.skok=visinaCanvasa*0.15;
                    else Igrac.skok=visinaCanvasa*0.1;                
                }
        };     
    let gumbZaBoostSkok=document.getElementById("boostJump");
        gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
        gumbZaBoostSkok.style.backgroundImage='url('.concat(skin,'slicice/boostSkok.png)');
        gumbZaBoostSkok.ontouchstart=function(){
            if(boostZaSkokTrajeJos<=0&&dostupanBoostZaSkok>0){
                dostupanBoostZaSkok--;
                boostZaSkokTrajeJos=600;
                gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
                if(zvuk)boostSound.play();
            }
        };    
    let gumbZaBoostBrzina=document.getElementById("boostSpeed");
        gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
        gumbZaBoostBrzina.style.backgroundImage='url('.concat(skin,'slicice/boostBrzina.png)');
        gumbZaBoostBrzina.ontouchstart=function(){
            if(boostZaBrzinuTrajeJos<=0&&dostupanBoostZaBrzinu>0){
                dostupanBoostZaBrzinu--;
                boostZaBrzinuTrajeJos=600;
                gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
                if(zvuk)boostSound.play();
            }
        };
    let gumbZaSkokIzNiceg=document.getElementById("skokIzNiceg");
        gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
        gumbZaSkokIzNiceg.style.backgroundImage='url('.concat(skin,'slicice/skokIzNiceg.png)');
        gumbZaSkokIzNiceg.ontouchstart=function(){
            if(dostupanSkokIzNiceg>0){
                dostupanSkokIzNiceg--;
                mozeSkokIzNiceg=true;
                gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
                if(zvuk)boostSound.play();
            }        
        };
    let gumbZaZvuk=document.getElementById("zvuk");
        if(zvuk) gumbZaZvuk.style.backgroundImage='url('.concat(skin,'slicice/sound.png)');
        else gumbZaZvuk.style.backgroundImage='url('.concat(skin,'slicice/noSound.png)');
        gumbZaZvuk.ontouchstart=function(){
        if (zvuk){
            zvuk=false;
            muzikaZaIgru.pause();
            setCookie('zvuk','ugasen',30);
            gumbZaZvuk.style.backgroundImage='url('.concat(skin,'slicice/noSound.png)');
        }
        else { 
            zvuk=true;
            muzikaZaIgru.play();
            setCookie('zvuk','upaljen',30);
            gumbZaZvuk.style.backgroundImage='url('.concat(skin,'slicice/sound.png)'); 
        }
    };
    var hideA=document.getElementById("hideA");
    var gumbPocni = document.getElementById("start");
        gumbPocni.ontouchstart=function(){
            Igrac.mrtav=false;
            if(zvuk) {
                muzikaZaMenu.pause();
                muzikaZaIgru.play();
        }
        pokreniIgru();
    };
    var gumbPomoc = document.getElementById("pomoc");
        gumbPomoc.ontouchstart= pomoc;
    var gumbPostavke= document.getElementById("postavke");
        gumbPostavke.ontouchstart= otvoriPostavke;
    var gumbOdpauziraj;
    var gumbOdustani;
    var gumbMenu = document.createElement('button');
        wrapper.appendChild(gumbMenu);
        postaviGumb(gumbMenu,2,10);
        gumbMenu.innerText='Menu';
        gumbMenu.style.width='15%';
        gumbMenu.style.textAlign='left';
        gumbMenu.ontouchstart=function(){
            paused=true;
            gumbOdpauziraj=document.createElement('button');
                wrapper.appendChild(gumbOdpauziraj);
                postaviGumb(gumbOdpauziraj,2,25);
                gumbOdpauziraj.innerText='Resume';
                gumbOdpauziraj.style.width='15%';
                gumbOdpauziraj.style.textAlign='left';
                gumbOdpauziraj.style.display = 'block';
                gumbOdpauziraj.ontouchstart=function(){
                    paused=false;
                    azuriraj();
                    gumbOdpauziraj.parentNode.removeChild(gumbOdpauziraj);
                    gumbOdustani.parentNode.removeChild(gumbOdustani);
                };
            gumbOdustani=document.createElement('button');
                wrapper.appendChild(gumbOdustani);
                postaviGumb(gumbOdustani,20,25);
                gumbOdustani.innerText='Quit';
                gumbOdustani.style.width='15%';
                gumbOdustani.style.textAlign='left';
                gumbOdustani.style.display = 'block';
                gumbOdustani.ontouchstart=function(){
                    //ako samo stavim window.location.reload()sve se ponovo učitava pa se vidi refresh i ružno je
                    Igrac.X = sirinaCanvasa*0.15;
                    Igrac.Y = 20;
                    Igrac.mrtav=true;
                    Duh.X=sirinaCanvasa;
                    Duh.Y=visinaCanvasa;
                    Duh.Dx=brzinaDuha;
                    Duh.Dy=brzinaDuha;
                    Duh.ubrzava=0;
                    rezultat=0;
                    paused=false;
                    boostZaSkokTrajeJos=0;
                    dostupanBoostZaSkok=2;
                    gumbZaBoostSkok.innerText=dostupanBoostZaSkok;
                    boostZaBrzinuTrajeJos=0;
                    dostupanBoostZaBrzinu=2;
                    gumbZaBoostBrzina.innerText=dostupanBoostZaBrzinu;
                    mozeSkokIzNiceg=false;
                    dostupanSkokIzNiceg=1;
                    gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
                    brojacKadrova=0;
                    bonusAktivan=false;
                    gumbOdpauziraj.parentNode.removeChild(gumbOdpauziraj);
                    gumbOdustani.parentNode.removeChild(gumbOdustani);
                    ctx.clearRect(0, 0, sirinaCanvasa,visinaCanvasa);
                    makniGumbeZaIgru();
                    postaviGumbeZaMeni();
                };
            
        };

    ctx.font="15px Arial";
//pozadine
    var pozadine=[];
    for (let i=0;i<=6;i++){
        pozadine[i]=new Image;
        pozadine[i].src =skin.concat('slicice/pozadina'.concat(String(i),'.png'));
    }
    var efektZaPozadinu=0;

//platforme
    var platforme=new Image();
        platforme.src =skin.concat('slicice/platforme.png');
    var visineZaPlatforme=[20,20,20,20,20,20,10];
    var sirineZaPlatforme=[150,100,110,200,250,50,250]; 
    var ikseviZaPlatforme=[Math.ceil(sirinaCanvasa*0.7),Math.ceil(sirinaCanvasa*0.30), Math.ceil(sirinaCanvasa*0.8),Math.ceil(sirinaCanvasa*0), Math.ceil(sirinaCanvasa*0.7),Math.ceil(sirinaCanvasa*0.15),Math.ceil(sirinaCanvasa*0.15)];
    var ipsiloniZaPlatforme=[Math.ceil(visinaCanvasa-visineZaPlatforme[0]-1), Math.ceil(visinaCanvasa*0.4), Math.ceil(visinaCanvasa*0.7),Math.ceil(visinaCanvasa*0.25),Math.ceil(visinaCanvasa*0.550),Math.ceil(visinaCanvasa*0.4),Math.ceil(visinaCanvasa*0.8)];
    var okomiti=[2,5];
    var okomitiSmjerovi=[1,1];
    var vodoravni=[0,3,4,6];
    var vodoravniSmjerovi=[1,1,1,1];

//bodovi
    var zvjezdica=new Image();
    zvjezdica.src =skin.concat( "slicice/zvjezdica.png");
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
//kontrole
    var kontrolaLijevo;
    var kontrolaDesno;
//pomoć
    let svaPomoc=[];
    for(let i=0;i<5;i++){
        svaPomoc[i]=new Image();
        svaPomoc[i].src =skin.concat( "slicice/pomoc".concat(i,".png"));
    }          
    postaviGumbeZaMeni();
    function pokreniIgru(){
    //kontrole
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
            kontrolaLijevo = document.createElement('button');
            wrapper.appendChild(kontrolaLijevo);
            postaviGumb(kontrolaLijevo,1,90);
            kontrolaLijevo.style.backgroundImage='url('.concat(skin,'slicice/left.png)');
            kontrolaLijevo.style.display = 'block';
            kontrolaLijevo.innerText='left';
            kontrolaLijevo.style.textIndent='-2222px';
            kontrolaLijevo.style.width='10%';
            kontrolaLijevo.style.height='10%';
            kontrolaLijevo.style.backgroundSize= '100% 100%';
            kontrolaLijevo.ontouchstart=function(){Igrac.idiLijevo=true;};
            kontrolaLijevo.ontouchend=function(){Igrac.idiLijevo=false;};

            kontrolaDesno = document.createElement('button');
            wrapper.appendChild(kontrolaDesno);
            postaviGumb(kontrolaDesno,20,90);
            kontrolaDesno.style.backgroundImage='url('.concat(skin,'slicice/right.png)');
            kontrolaDesno.style.display = 'block';
            kontrolaDesno.innerText='right';
            kontrolaDesno.style.textIndent='-2222px';
            kontrolaDesno.style.width='10%';
            kontrolaDesno.style.height='10%';
            kontrolaDesno.style.backgroundSize= '100% 100%';
            kontrolaDesno.ontouchstart=function(){Igrac.idiDesno=true;};
            kontrolaDesno.ontouchend=function(){Igrac.idiDesno=false;};
        };
//Izbor slike za duha
        if (brzinaDuha===0.35) duhDesno.src =skin.concat('slicice/duhDesnoMedium.png');
        else if(brzinaDuha===0.5)duhDesno.src =skin.concat('slicice/duhDesnoHard.png');
        else duhDesno.src =skin.concat('slicice/duhDesno.png');
        if (brzinaDuha===0.35) duhLijevo.src =skin.concat('slicice/duhLijevoMedium.png');
        else if(brzinaDuha===0.5)duhLijevo.src =skin.concat('slicice/duhLijevoHard.png');
        else duhLijevo.src =skin.concat('slicice/duhLijevo.png');
        duh=duhLijevo;
//počni igru
        makniGumbeZaMeni();
        postaviGumbeZaIgru();
        if(!Igrac.mrtav)azuriraj();
    }
    function animirajZvjezdicu(){
        Zvjezdica.prozirnost+=Zvjezdica.prozirnostD;
        if (Zvjezdica.prozirnost<0.5||Zvjezdica.prozirnost>=1)Zvjezdica.prozirnostD*=-1;
    } 
    function jeZvjezdicaSkupljena(){
        if(Math.abs((Igrac.Y+Igrac.polaVisine)-(Zvjezdica.Y+Igrac.polaVisine))<(2*Igrac.visina)/2 && Math.abs((Igrac.X+Igrac.polaSirine)-(Zvjezdica.X+Duh.polaSirine))<(2*Igrac.sirina)/3) {//zvjezdica i igrač su iste veličine
            Zvjezdica.Y=Math.random()*0.9*visinaCanvasa;
            Zvjezdica.X=Math.random()*0.9*sirinaCanvasa;
            rezultat+=100;
            if(zvuk)skupi.play();
       }; 
    }
    function jeBonusSkupljen(){
        if(Math.abs((Igrac.Y+Igrac.polaVisine)-(Duh.Y-Igrac.visina+Igrac.polaVisine))<(2*Igrac.visina)/3 && Math.abs((Igrac.X+Igrac.polaSirine)-(Duh.X+Igrac.polaSirine))<(2*Igrac.sirina)/3){ //bonus je iste veličine kao i igrac
            bonusAktivan=false;
            let sreca=Math.random();
            if(sreca<0.1){
                dostupanSkokIzNiceg++;
                gumbZaSkokIzNiceg.innerText=dostupanSkokIzNiceg;
            }
            else if(sreca<0.55){
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
        Igrac.tickCount ++;
        if (Igrac.tickCount > Igrac.ticksPerFrame) {
            Igrac.tickCount = 0;        	
            // Go to the next frame
            Igrac.aktivniKadarSprite = ++Igrac.aktivniKadarSprite % Igrac.brojStupacaSpritesheet;
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
    function nacrtaj(){
        ctx.clearRect(0, 0, sirinaCanvasa,visinaCanvasa);
        ctx.beginPath();
        if(efektZaPozadinu<7){
            ctx.drawImage(pozadine[efektZaPozadinu],0,0,sirinaCanvasa,visinaCanvasa);
            efektZaPozadinu++;
        }
        else if (efektZaPozadinu<14){
            ctx.drawImage(pozadine[13-efektZaPozadinu],0,0,sirinaCanvasa,visinaCanvasa);//unatrag od 6 do 0
            efektZaPozadinu++;
        }

        if (Igrac.mrtav){
            ctx.drawImage(duhLijevo,0,0);
            ctx.fillText('Game over',sirinaCanvasa*0.7,visinaCanvasa*0.3);
            setTimeout(function() {location.reload();}, 2000);
            if(zvuk)zaKraj.play();
        }
        else{
            //crtanje platformi
            for (let i=0;i<ikseviZaPlatforme.length;i++){
                ctx.drawImage(platforme,ikseviZaPlatforme[i],ipsiloniZaPlatforme[i],sirineZaPlatforme[i],visineZaPlatforme[i]+5);
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
            if(Duh.ubrzavaTimerZaPoruku>0)ctx.fillText('Ghost speed increased',Duh.X,Duh.Y);
            //crtanje zvjezdice
            animirajZvjezdicu();
            ctx.globalAlpha=Zvjezdica.prozirnost;
            ctx.drawImage(zvjezdica,Zvjezdica.X,Zvjezdica.Y,Igrac.sirina,Igrac.visina);
            ctx.globalAlpha=1;
            //crtanje bonusa
            if (bonusAktivan)ctx.drawImage(boost,Duh.X,Duh.Y-Igrac.visina,Igrac.sirina,Igrac.visina);
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
        if(Igrac.idiDesno)Igrac.Dx=1;
        else if (Igrac.idiLijevo)Igrac.Dx=-1;
        else Igrac.Dx=0;
        if (boostZaBrzinuTrajeJos>0)Igrac.Dx*=2;
        if (Igrac.X+Igrac.Dx>=0 && Igrac.X+Igrac.Dx+Igrac.sirina<=sirinaCanvasa) Igrac.X+=Igrac.Dx;
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
        //boost
        if (dostupanBoostZaBrzinu) gumbZaBoostBrzina.style.display = 'block';
        else gumbZaBoostBrzina.style.display = 'none';
        if (dostupanBoostZaSkok) gumbZaBoostSkok.style.display = 'block';
        else gumbZaBoostSkok.style.display = 'none';
        if (dostupanSkokIzNiceg) gumbZaSkokIzNiceg.style.display = 'block';
        else gumbZaSkokIzNiceg.style.display = 'none';
        boostZaBrzinuTrajeJos--;
        boostZaSkokTrajeJos--;
        if(Duh.ubrzavaTimerZaPoruku!==0)Duh.ubrzavaTimerZaPoruku--;
        //platforme
        miciVodoravnePlatforme();
        miciOkomitePlatforme();  
        //igrac
        let naDuhuSam=pomakniIgraca();
        //duh
        pomakniDuha();
        //provjere za game over
        Igrac.mrtav=provjere(naDuhuSam);   
        if(Igrac.mrtav){
            muzikaZaIgru.pause();
            let cookieZaRezultat=getCookie('rezultat');
            if(cookieZaRezultat ==='')setCookie('rezultat',String(rezultat));
            else if( rezultat>parseInt(cookieZaRezultat)) setCookie('rezultat',String(rezultat));
        }
        //zvjezdice i bonusi
        jeZvjezdicaSkupljena();
        if (rezultat%2000===500){ //duh se ubrzava sa bodovima
            Duh.ubrzavaTimerZaPoruku=100;
            rezultat+=100;
            efektZaPozadinu=0;
            Duh.Dx+=0.05;
            Duh.Dy+=0.05;
        }
        brojacKadrova=++brojacKadrova%5000;
        if(brojacKadrova===2500) bonusAktivan=true;
        if (bonusAktivan) jeBonusSkupljen();
        //crtanje
        nacrtaj();
        if(!Igrac.mrtav&&!paused)requestAnimationFrame(azuriraj);
    }
    function pomoc(){
        makniGumbeZaMeni();
        let count=0;
        window.addEventListener("touchstart",funkcijaZaEventHandler);
        function funkcijaZaEventHandler(){ 
            if(count<svaPomoc.length){
                nacrtajPomoc();
            }
            else {
                ctx.clearRect(0, 0, sirinaCanvasa,visinaCanvasa);
                window.removeEventListener("touchstart",funkcijaZaEventHandler);
                postaviGumbeZaMeni();
            }
        }
        function nacrtajPomoc(){
            if(svaPomoc[count].complete){ //preloading ne pomaže jer browser zaboravi stvari nakon nekog vremena.
                ctx.drawImage(svaPomoc[count],sirinaCanvasa*0.1,visinaCanvasa*0.1,sirinaCanvasa*0.8,visinaCanvasa*0.8);
                if(count===0)ctx.fillText('tap to continue',sirinaCanvasa*0.1+20,visinaCanvasa*0.1);
                count++;
            }
            else{
                ctx.fillText('please wait for just a moment, the image is being loaded',sirinaCanvasa*0.1+20,visinaCanvasa*0.1+20);
                setTimeout(nacrtajPomoc, 200);                
            } 
        }
    };
    function otvoriPostavke(){
        makniGumbeZaMeni();
        let diraoSkin=false;
        //napravi gumbe 
        var gumbDiffEasy = document.createElement('button');
        wrapper.appendChild(gumbDiffEasy);
        postaviGumb(gumbDiffEasy,8,10);
        gumbDiffEasy.innerText='Easy';
        gumbDiffEasy.style.display = 'block';
        gumbDiffEasy.style.width='28%';
        gumbDiffEasy.style.textAlign='center';
        gumbDiffEasy.ontouchstart=function(){
            brzinaDuha=0.2;
            obojajPozadinu();
        };
        
        var gumbDiffMedium = document.createElement('button');
        wrapper.appendChild(gumbDiffMedium);
        postaviGumb(gumbDiffMedium,36,10);
        gumbDiffMedium.innerText='Medium';
        gumbDiffMedium.style.display = 'block';
        gumbDiffMedium.style.width='28%';
        gumbDiffMedium.style.textAlign='center';
        gumbDiffMedium.ontouchstart=function(){
            brzinaDuha=0.35;
            obojajPozadinu();
        };
        
        var gumbDiffHard = document.createElement('button');
        wrapper.appendChild(gumbDiffHard);
        postaviGumb(gumbDiffHard,64,10);
        gumbDiffHard.innerText='Hard';
        gumbDiffHard.style.display = 'block';
        gumbDiffHard.style.width='28%';
        gumbDiffHard.style.textAlign='center';
        gumbDiffHard.ontouchstart=function(){
            brzinaDuha=0.5;
            obojajPozadinu();
        };
        
        var gumbZvukOn = document.createElement('button');
        wrapper.appendChild(gumbZvukOn);
        postaviGumb(gumbZvukOn,8,30);
        gumbZvukOn.innerText='Sound ON';
        gumbZvukOn.style.display = 'block';
        gumbZvukOn.style.width='42%';
        gumbZvukOn.style.textAlign='center';
        gumbZvukOn.ontouchstart=function(){
            zvuk=true;
            muzikaZaMenu.play();
            obojajPozadinu();
        };
        
        var gumbZvukOff = document.createElement('button');
        wrapper.appendChild(gumbZvukOff);
        postaviGumb(gumbZvukOff,50,30);
        gumbZvukOff.innerText='Sound OFF';
        gumbZvukOff.style.display = 'block';
        gumbZvukOff.style.width='42%';
        gumbZvukOff.style.textAlign='center';
        gumbZvukOff.ontouchstart=function(){
            zvuk=false;
            muzikaZaMenu.pause();
            obojajPozadinu();
        } ;  
        
        var gumbGyroOn = document.createElement('button');
        wrapper.appendChild(gumbGyroOn);
        postaviGumb(gumbGyroOn,8,50);
        gumbGyroOn.innerText='Controls: Gyro';
        gumbGyroOn.style.display = 'block';
        gumbGyroOn.style.width='42%';
        gumbGyroOn.style.textAlign='center';
        gumbGyroOn.ontouchstart=function(){
            gyro=true;
            obojajPozadinu();
        };
        
        var gumbGyroOff = document.createElement('button');
        wrapper.appendChild(gumbGyroOff);
        postaviGumb(gumbGyroOff,50,50);
        gumbGyroOff.innerText='Controls: Arrows';
        gumbGyroOff.style.display = 'block';
        gumbGyroOff.style.width='42%';
        gumbGyroOff.style.textAlign='center';
        gumbGyroOff.ontouchstart=function(){
            gyro=false;
            obojajPozadinu();
        } ;        
   
        var gumbSkinNormal = document.createElement('button');
        wrapper.appendChild(gumbSkinNormal);
        postaviGumb(gumbSkinNormal,8,70);
        gumbSkinNormal.innerText='Serious skin';
        gumbSkinNormal.style.display = 'block';
        gumbSkinNormal.style.width='42%';
        gumbSkinNormal.style.textAlign='center';
        gumbSkinNormal.ontouchstart=function(){
            skin='normalSkin/';
            obojajPozadinu();
            diraoSkin=true;
        };
        
        var gumbSkinNotSoNormal = document.createElement('button');
        wrapper.appendChild(gumbSkinNotSoNormal);
        postaviGumb(gumbSkinNotSoNormal,50,70);
        gumbSkinNotSoNormal.innerText='Not so serious skin';
        gumbSkinNotSoNormal.style.display = 'block';
        gumbSkinNotSoNormal.style.width='42%';
        gumbSkinNotSoNormal.style.textAlign='center';
        gumbSkinNotSoNormal.ontouchstart=function(){
            skin='notSoNormalSkin/';
            obojajPozadinu();
            diraoSkin=true;
        } ;  
        
        var gumbZatvoriPostavke = document.createElement('button');
        wrapper.appendChild(gumbZatvoriPostavke);
        postaviGumb(gumbZatvoriPostavke,80,90);
        gumbZatvoriPostavke.innerText='Done';
        gumbZatvoriPostavke.style.display = 'block';
        gumbZatvoriPostavke.ontouchstart=function(){
            gumbZvukOn.parentNode.removeChild(gumbZvukOn);
            gumbZvukOff.parentNode.removeChild(gumbZvukOff);
            gumbGyroOn.parentNode.removeChild(gumbGyroOn);
            gumbGyroOff.parentNode.removeChild(gumbGyroOff);
            gumbDiffEasy.parentNode.removeChild(gumbDiffEasy);
            gumbDiffMedium.parentNode.removeChild(gumbDiffMedium);
            gumbDiffHard.parentNode.removeChild(gumbDiffHard);
            gumbSkinNotSoNormal.parentNode.removeChild(gumbSkinNotSoNormal);
            gumbSkinNormal.parentNode.removeChild(gumbSkinNormal);
            gumbZatvoriPostavke.parentNode.removeChild(gumbZatvoriPostavke);
            ctx.clearRect(0, 0, sirinaCanvasa,visinaCanvasa);
            postaviGumbeZaMeni();
            if (zvuk) setCookie('zvuk','upaljen',30);
            else setCookie('zvuk','ugasen',30);
            if (gyro) setCookie('gyro','upaljen',30);
            else setCookie('gyro','ugasen',30);
            if (brzinaDuha===0.2) setCookie('brzinaDuha','easy',30);
            else if (brzinaDuha===0.35)setCookie('brzinaDuha','medium',30);        
            else setCookie('brzinaDuha','hard',30);
            if(skin==='notSoNormalSkin/')setCookie('skin','notSoNormalSkin/',30);
            else setCookie('skin','normalSkin/',30);
            if(diraoSkin)location.reload();
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
            if (brzinaDuha===0.2){
                gumbDiffEasy.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
                gumbDiffMedium.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbDiffHard.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
            }
            else if (brzinaDuha===0.35){
                gumbDiffEasy.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbDiffMedium.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
                gumbDiffHard.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena               
            }
            else{
                gumbDiffEasy.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbDiffMedium.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbDiffHard.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena                
            }
            if(skin==='normalSkin/'){
                gumbSkinNotSoNormal.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbSkinNormal.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
            }
            else{
                gumbSkinNormal.style.backgroundColor = "rgba(181, 19, 6  ,0.75)";//crvena
                gumbSkinNotSoNormal.style.backgroundColor = "rgba(6, 181, 43  ,0.75)";//zelena
            }
        }
    }
    function postaviGumbeZaIgru(){
        gumbZaSkok.style.display = 'block';
        gumbZaBoostSkok.style.display = 'block';
        gumbZaBoostBrzina.style.display = 'block';
        gumbZaSkokIzNiceg.style.display = 'block';
        gumbZaZvuk.style.display='block';  
        gumbMenu.style.display='block';  
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
        gumbZaZvuk.style.display='none';  
        gumbMenu.style.display='none'; 
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