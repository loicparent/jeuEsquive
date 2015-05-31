( function() {
    "use strict";

    var app = {
        "animation" : {
                        "canvas": null,
                        "context": null,
                        "width": 0,
                        "height": 0
                    },
        'mouse' : {
            "x": null,
            "y": null
        },
        'bonus' : {
            "x": null,
            "y": null,
            "level": 10,
            "size": 30
        },
        "utils" : {}
    };
    var aBubbles = [],
        nBonus = 0,
        start = new Audio("./sounds/start.mp3"),
        gOSound = new Audio("./sounds/lose.mp3"),
        bubbleAdd = new Audio("./sounds/bubble+.mp3");

    app.utils.isCanvasSupported = function( $canvas ) {
        return !!$canvas.getContext; // !! permet de convertir en booleen.
    };

    app.animation.setup = function() {
        this.canvas = document.querySelector( '#canvas' );
        // detecter si canvas est supporté:
        if ( !app.utils.isCanvasSupported( this.canvas ) ) {
            return console.error( "Canvas n'est pas supporté. " );
        }
        this.context = this.canvas.getContext( "2d" );
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        var BonusSize = app.bonus.size;
        app.bonus.x = Math.floor(Math.random() * (( this.width - BonusSize ) - BonusSize)) + BonusSize;
        app.bonus.y = Math.floor(Math.random() * (( this.height - BonusSize ) - BonusSize)) + BonusSize;

        var that = this;

        // récupérer la position de la souris:
        function getMousePos(canvas, evt) {
            var rect = canvas.getBoundingClientRect();
            return {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
        }
        canvas.addEventListener('mousemove', function(evt) {
            var mousePos = getMousePos(canvas, evt);            
            app.mouse.x=mousePos.x;
            app.mouse.y=mousePos.y;
            });

        //Initialiser les bulles
        this.adBubbles(10);

        // Lancer le jeu au clic sur le H2
        document.querySelector( 'h2' ).addEventListener('mousedown', function(evt) {
            start.play();
            var button = document.querySelector( 'h2' );
            button.parentNode.removeChild(button);
            that.createBonus();
            setInterval(function(){
                that.draw();
            }, 60);
        });
    };

    var Bubbles = function () {
            this.posX = app.animation.width/8,
            this.posY = app.animation.height/8,
            this.radius = Math.floor(Math.random() * (50 - 30)) + 30,
            this.speedX = Math.floor(Math.random() * (15 - 8)) + 8,
            this.speedY = Math.floor(Math.random() * (15 - 8)) + 8,
            this.colour = Math.floor(Math.random() * (350 - 30)) + 30;
            this.bounce = new Audio("./sounds/bounce.mp3");
    };

    app.animation.createBonus = function() {
        var x = app.bonus.x,
            y = app.bonus.y,
            size = app.bonus.size;
        this.context.beginPath();
        this.context.rect( x-size, y-size, size, size );
        this.context.fillStyle = 'black';
        this.context.fill();

        // vérifier si on a touché le bonus
        if ( app.mouse.x > ( x - size ) && app.mouse.x < ( x + size ) && app.mouse.y > ( y - size ) && app.mouse.y < ( y + size ) ) {
            var bonusSound = new Audio("./sounds/bonus.mp3");
            bonusSound.play();
            this.changeBonus();
        }
        if( nBonus === app.bonus.level ){
            bubbleAdd.play();
            app.bonus.level += 10;
            this.adBubbles( 1 );
        }
    };

    app.animation.changeBonus = function() {
        nBonus++;
        var BonusSize = app.bonus.size;
        app.bonus.x = Math.floor(Math.random() * (( this.width - BonusSize ) - BonusSize )) + BonusSize;
        app.bonus.y = Math.floor(Math.random() * (( this.height - BonusSize ) - BonusSize )) + BonusSize;
    };

    app.animation.adBubbles = function( nbre ) {
        for (var j = 0; j < nbre; j++) {
            var maBulle = new Bubbles();
            aBubbles.push( maBulle );
        };
    }

    var gameOver = function (){
        alert('GAME OVER \n\n\n votre score est de: '+ nBonus +' \n\n\n cliquez sur OK pour recommencer');
        window.location.reload( true );
    }

    app.animation.drawBubbles = function (){

        for (var i = 0; i <aBubbles.length; i++) {
            this.context.fillStyle = 'hsl(' + aBubbles[i].colour + ',80%,60%)';
             this.context.beginPath();
             this.context.arc(aBubbles[i].posX,aBubbles[i].posY,aBubbles[i].radius,0,2*Math.PI,false);
             this.context.fill();
        };
        for (var j = 0; j <aBubbles.length; j++) {
            // vérifier si on ricoche sur la largeur
            if((aBubbles[j].posX + aBubbles[j].speedX + aBubbles[j].radius > 0 + this.width) || (aBubbles[j].posX - aBubbles[j].radius + aBubbles[j].speedX < 0)){
                aBubbles[j].bounce.play();
                aBubbles[j].speedX = - aBubbles[j].speedX;
             }
             // vérifier si on ricoche sur le hauteur
             if((aBubbles[j].posY + aBubbles[j].speedY + aBubbles[j].radius > 0 + this.height) || (aBubbles[j].posY - aBubbles[j].radius + aBubbles[j].speedY < 0)){
                aBubbles[j].bounce.play();
                aBubbles[j].speedY = - aBubbles[j].speedY;
             }
            // Vérifier si on touche une boule.
            var iDeltaX = Math.abs( aBubbles[j].posX - app.mouse.x ),
                iDeltaY = Math.abs( aBubbles[j].posY - app.mouse.y ),
                iDistance = Math.sqrt( ( Math.pow(  iDeltaX, 2 ) + Math.pow( iDeltaY, 2 ) ), 2 );

            if ( iDistance, iDistance < aBubbles[j].radius ) {
                gOSound.play();
                gameOver();
            }
            aBubbles[j].posX += aBubbles[j].speedX;
            aBubbles[j].posY += aBubbles[j].speedY;
        };
    };

    app.animation.draw = function() {
        this.context.clearRect(0, 0, canvas.width, canvas.height);

        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';
        this.context.fillRect(0, 0, this.width, this.height);
        
        this.createBonus();
        this.drawBubbles();
        document.querySelector( '.scoreResult' ).innerHTML = nBonus;

    };

    app.animation.setup();

} )();