// *****VARIABLES*****
// Appel du canvas
var canvas = document.getElementById("canvas");

// Insertion du contexte 2d
var ctx = canvas.getContext("2d");

// Taille de la balle
var ballRadius = 10;

// Placement du point d'origine de la balle
var x = canvas.width / 2;
var y = canvas.height - 30;

// Deplacement de la balle
var dx = 3;
var dy = -3;

// Taille du paddle
var paddleHeight = 10;
var paddleWidth = 60;

// Placement d'origine du paddle
var paddleX = (canvas.width - paddleWidth) / 2;

// Boolean d'origine pour les touches de déplacement
var rightPressed = false;
var leftPressed = false;

// Compte des rangs des bricks
var brickRowCount = 8;

// Compte des colonnes des bricks
var brickColumnCount = 6;

// Taille des bricks
var brickWidth = 60;
var brickHeight = 20;

// Padding des bricks entre elles, le top et la gauche
var brickPadding = 1;
var brickOffsetTop = 1;
var brickOffsetLeft = 1;

// Depart du score
var score = 0;

// Depart des vies
var lives = 3;

// boolean pour touche pause
var paused = false;

// Tableaux imbriqués pour former les rangs et colonnes des bricks
var bricks = [];
for (var c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (var r = 0; r < brickRowCount; r++) {
    bricks[c][r] = {
      x: 0,
      y: 0,
      status: 1
    };
  }
}


// ****MOUVEMENTS TOUCHES/SOURIS*****
// Ecoute des touches gauche, droite, et du mouvement de la souris
document.addEventListener("keydown", keyDownHandler, false); // false vaut touche non pressée
document.addEventListener("keyup", keyUpHandler, false); // false faut touche non pressée
document.addEventListener("mousemove", mouseMoveHandler, false); // false vaut pas de mouvement de la souris

// Fonction de reglage des touches droite et gauche quand elles sont appuyees
function keyDownHandler(p) {
  if (p.key == "Right" || p.key == "ArrowRight") { // droite
    rightPressed = true; // true vaut touche pressée
  } else if (p.key == "Left" || p.key == "ArrowLeft") { // gauche
    leftPressed = true; // true vaut touche pressée
  }
}

// Fonction de reglage des touches droite et gauche quand elles ne sont pas appuyees
function keyUpHandler(p) {
  if (p.key == "Right" || p.key == "ArrowRight") { // droite
    rightPressed = false; // touche non pressée
  } else if (p.key == "Left" || p.key == "ArrowLeft") { //gauche
    leftPressed = false; // touche non pressée
  }
}

// Deplacement du paddle avec la souris
function mouseMoveHandler(p) {
  var relativeX = p.clientX - canvas.offsetLeft; //distance entre le pointeur de la souris et le bord gauche du canvas
  if (relativeX > 0 && relativeX < canvas.width) { // si le mouvement de la souris est supérieuur à 0 ou inférieur à la largeur du canvas
    paddleX = relativeX - paddleWidth / 2; 
  }
}

window.addEventListener('keydown', pauseGameKeyHandler, false); // écouteur d'évènement de la touche pause

function pauseGameKeyHandler(p) {
    var keyCode = p.keyCode;
    switch(keyCode){ // compare le résultat et exécute l'instruction quand on presse P
        case 80: // touche P du clavier
        togglePause(); // appel du toggle de pause
        break; // permet de terminer l'instruction switch
    }

}

function togglePause() { // interrupteur pour mettre en pause ou enlever la pause
    paused = !paused; 
    draw(); // appel fonction principal draw
}


// DETECTION COLLISIONS
// Detection des collisions en parcourant les tableaux imbriqués pour savoir si une brick est touchée
function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) { // boucle for pour parcourir les colonnes
    for (var r = 0; r < brickRowCount; r++) { // boucle for imbriquée pour parcourir les rangs
      var b = bricks[c][r]; // var des tableaux imbriqués colonnes et rangs
      if (b.status == 1) { // brick présente dans le dessin
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) { // détection des collisions de la balle avec les bricks en x et en y
          dy = -dy; // alors la balle change de sens
          b.status = 0; // brick supprimée du dessin
          score++; // score incrémenté de 1
          if (score == brickRowCount * brickColumnCount) { // si le score est égal aux rangs bricks * colonnes bricks
            alert("VOUS AVEZ GAGNE ! BRAVO !"); // alors c'est gagné
            document.location.reload(); // le document se recharge 
          }
        }
      }
    }
  }
}



// *****DESSINS DES ITEMS*****
// Dessin de la balle
function drawBall() {
  ctx.beginPath(); //début du chemin pour dessiner l'élement
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2); //Math.PI*2 pour faire un cercle complet, arc pour dire qu'on fait un cercle
  ctx.fillStyle = "#000"; // couleur du cercle
  ctx.fill(); // dit que c'est une cercle plein
  ctx.closePath(); // fin du chemin
}

// Dessin du paddle
function drawPaddle() {
  ctx.beginPath(); // début du chemin
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight); // rect pour faire un rectangle
  //      coord. x          coord. y               largeur        hauteur 
  ctx.fillStyle = "red"; // couleur du rectangle
  ctx.fill(); // rectangle plein
  ctx.closePath(); // fin du chemin
}

// Dessin des bricks par colonnes et rangs via tableaux imbriqués
function drawBricks() {
  for (var c = 0; c < brickColumnCount; c++) { // boucle for pour parcourir les colonnes de bricks et incrémenter
    for (var r = 0; r < brickRowCount; r++) { // boucle for imbriquée pour parcourir les rangs de bricks et incrémenter
      if (bricks[c][r].status == 1) { // status ==1 vaut brick présente
        var brickX = (r * (brickWidth + brickPadding)) + brickOffsetLeft; 
        var brickY = (c * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX; // placement des bricks sur âxe x
        bricks[c][r].y = brickY; // placement des bricks sur âxe y
        ctx.beginPath(); // début du chemin
        ctx.rect(brickX, brickY, brickWidth, brickHeight); // fait des rectangles
        ctx.fillStyle = "red"; // couleur des rectangles
        ctx.fill(); // rectangle plein
        ctx.closePath(); // fin du chemin
      }
    }
  }
}

// Dessin du score
function drawScore() {
  ctx.font = "900 16px 'Rock Salt'"; // style de l'écriture du score
  ctx.fillStyle = "black"; // couleur de l'écriture
  ctx.fillText("Score: " + score, 8, 20); // fillText pour dire que c'est un texte, plus le score et son placement en x et y
}

// Dessin des vies
function drawLives() {
  ctx.font = "900 16px 'Rock Salt'"; // style de l'écriture des vies
  ctx.fillStyle = "black"; // couleur de l'écriture
  ctx.fillText("Lives: " + lives, canvas.width - 75, 20); // texte, plus nombre de vie et son placement
}



// *****FONCTION 1ST ET APPEL DES FONCTIONS
// fonction principale qui fait appel aux differentes fonctions pour le jeu
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // remise à zéro des dessins du canvas pour donner l'impression que la balle se déplace
  drawBricks(); // appel de la fonction pour dessiner les bricks
  drawBall(); // appel de la fonction pour dessiner la balle
  drawPaddle(); // appel de la fonction pour dessiner le paddle
  drawScore(); // appel de la fonction pour écrire le score
  drawLives(); // appel de la fonctiobn pour écrire les vies restantes
  collisionDetection(); // appel de la fonction de détection des collisions

  if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) { // détection des collisions avec les murs droit et gauche
    dx = -dx; // déplacement de la balle dans l'autre sens sur âxe x
  }
  if(y + dy < ballRadius) {
    dy = -dy; // déplacement de la balle dans l'autre sens sur âxe y
  } else if(y + dy > canvas.height - ballRadius) { // détection de la collision avec le mur du haut ou le vide du bas
    if(x > paddleX && x < paddleX + paddleWidth) {  // détection de la balle avec le paddle
      dy = -dy; // alors la balle change de direction
    } else {
      lives--; // décrémentation d'une vie
      if(!lives) { // s'il n'y a plus de vie
        alert("GAME OVER !!!"); // Game over
        document.location.reload(); // le document se recharge
      } else { // s'il y a encore des vies
        x = canvas.width / 2; // en x la balle se place à la moitié de la largeur du canvas
        y = canvas.height - 30; // en y elle se place à -30
        dx = 3; // déplacement de la balle en x
        dy = -3; // déplacement de la balle en y
        paddleX = (canvas.width - paddleWidth) / 2; // le paddle se place à la moitié de la largeur du canvas moins sa propre largeur
      }
    }
  }

  if(rightPressed && paddleX < canvas.width - paddleWidth) { //si la touche gauche est pressée et que le paddle est inférieur à la largeur du canvas - la largeur du paddle
    paddleX += 5; // mouvement du paddle sur l'âxe x de + 5 en + 5... si on presse la touche droite
  } else if(leftPressed && paddleX > 0) {  // sinon si la touche gauche et le paddle sont supérieurs à 0
    paddleX -= 5; // mouvement du paddle sur l'âxe x de - 5 en -5... si on presse la touche gauche
  }

  x += dx; // déplacement de la balle sur l'âxe x
  y += dy; // déplacement de la balle sur l'âxe y

  if(!paused) { // si le jeu n'est pas en pause
    requestAnimationFrame(draw);} // rafraichit l'animation et appelle le callback environ 60 fois par seconde
}

// Appel de la fonction 1st
draw();