//HW: add the "explosion" property to each layer
// using an if, render the explosion only when the torpedo
// is in the same layer as the ship

// Array of Objects
let layers = [
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  },
  {
    ship: false,
    torpedo: false,
    explosion: false
  }
];

let score = 0;

let ship = {
  x: 0,
  dir: 1,
  layer: 0
};

let scope = {
  x: 0
}

let torpedo = {
  x: 0,
  layer: 0,
  shot: false
}

let explosion = {
  x: 0,
  layer: 0
}

let timerShip;
let timerTorpedo;

const render = () => {
  let seaDiv = document.querySelector('.sea');

  seaDiv.innerHTML = "";

  for (let i=1; i<=9; i++) {

    let objects = '';

    if (layers[i].ship) {
      objects += `
        <div class="ship" style="left: ${ship.x}px">
          <div class="ship-top"></div>
          <div class="ship-levels">
            <div class="level0">
              <div class="level0-top"></div>
              <div class="level0-base"></div>
            </div>
            <div class="level1">
              <div class="level2-before"></div>
              <div class="level1-after"></div>
            </div>
            <div class="level2">
              <div class="level2-before"></div>
              <div class="level2-center"></div>
              <div class="level2-after"></div>
            </div>
          </div>
          <div class="ship-base"></div>
        </div>
      `;
    }

    if (layers[i].torpedo) {
      objects += `
        <div class="torpedo" style="left: ${torpedo.x}px">
            <div class="head center"></div>
            <div class="body center"></div>
            <div class="tail-v center"></div>
            <div class="tail-h center"></div>
            <div class="tail center"></div>
        </div>
      `;
    }

    if (layers[i].torpedo && layers[i].ship) {
      objects += `
        <div class="explosion" style="left: ${explosion.x}px">
          <div class="fire-bottom-sm"></div>
          <div class="fire-bottom-md"></div>
        </div>
      `;
    }
    

    seaDiv.innerHTML += `
      <div class="layer"> <!-- layer${i} -->
        ${objects}
        <div class="wave"></div>
      </div>
    `;

  }

  seaDiv.innerHTML += `
    <div class="scope" style="left: ${scope.x}px">
      <div class="mid">+</div>
      <div class="h">--</div>
      <div class="v">--</div>
    </div>
  `;
  
}

//Function that moves the scope on axe X
const moveScope = (e) => {
  scope.x = e.clientX - 100;
}

//Function that renders the torpedo shoot when we press the space keydown
const shoot = (e) => {

  if (e.code == "Space" && !torpedo.shot) {

    torpedo.shot = true;
    torpedo.layer = 0;
    layers[torpedo.layer].torpedo = true;
    torpedo.x = scope.x + 685;

    clearInterval(timerTorpedo);

    timerTorpedo = setInterval(() => {

      if (torpedo.layer == 9) {

        clearInterval(timerTorpedo);
        torpedo.shot = false;
        layers[torpedo.layer].torpedo = false;

        //HW: each time a torpedo misses decrease the score
        score -= 2;
        viewScore();

      } else {

        layers[torpedo.layer].torpedo = false;
        torpedo.layer ++;
        layers[torpedo.layer].torpedo = true;

        if (torpedo.layer == ship.layer 
            && torpedo.x > ship.x + 10 
            && torpedo.x < ship.x + 560) {

          //HW: update the explosion layer
          layers[ship.layer].explosion = true;
          explosion.layer = true;
          
          explosion.x = torpedo.x;
          explosion.layer = ship.layer;
         
          //increase score
          score += 5;
          viewScore();

          //reset the ship
          resetShip();

          //clear the torpedo from next layers
          clearInterval(timerTorpedo);
          torpedo.shot = false;
          layers[torpedo.layer].torpedo = false;
        
        }
      }
      
    }, 500);
    
  }
  
}

//HW: Create a function that renders the score in the footer
const viewScore = () => {

  return document.getElementById("score").innerHTML = `
    <h1>Your Score is: ${score}</h1>
  `; 

}

const resetShip = () => {

  // Remove the ship from the layers
  for (let i=0; i<layers.length; i++) {
    layers[i].ship = false;
  }

  //Place the ship randomly in layers
  let ridx = Math.floor(Math.random() * 10);
  ship.layer = ridx;
  layers[ridx].ship = true;

  //The ship direction
  let rand = Math.random();
  if (rand >= 0.5) {
    //the ship goes from left
    ship.x = -600;
    ship.dir = 1;
  } else {
    //the ship goes from right
    ship.x = innerWidth + 600;
    ship.dir = -1;
  }

  clearInterval(timerShip);
  timerShip = setInterval(() => {
    ship.x += ship.dir;

    if (ship.dir == 1 && ship.x > innerWidth + 600) {
      resetShip();
    }

    if (ship.dir == -1 && ship.x < -600) {
      resetShip();
    }

    render();
  }, 50);
}

viewScore();
resetShip();
render();