// Level Designing

// store games width and height
(game_W = 0), (game_H = 0);
c = 0;

// here data is any array containing level data
// here each element contains level data
// There are 22 levels present

// "<M>|<N>|<LevelData>"
// M --> represents number of rows N --> represents number of columns
// LevelData --> it consists M * N level of data size present in it

// here 0 --> represents empty space
// here 1 --> represents wall or obstacle
// here 2 --> represents box
// here 3 --> represents box already present in dock
// here 4 --> represents dock where box need to be placed
// here 5 --> represents initial position of player character
// here 9 --> represents no character present at that position.

data = [
  "6|6|111111100501121111101999141999111999",
  "5|6|111111150001100241104201111111",
  "6|6|111119150011142301100101100001111111",
  "6|7|111111915000111022001101404110000011111111",
  "7|7|9911119111001915042111000201101400110000011111111",
  "7|7|9111119115001110010011023201100400111040119111119",
  "6|8|111111991000011110004401102225011001040111111111",
  "7|8|91111199114001111001025110010101103002411000011111111199",
  "6|7|111111915300111021001102040114000111111119",
  "6|8|911111191100001110440001101022211000154111111111",
  "6|7|111111914530111200201100010110040011111111",
  "7|7|1111119150441910120111010001100210110030011111111",
  "7|7|1111199100019910101111342001100120115000411111111",
  "6|7|991111111100511403101100020110240111111119",
  "6|8|111111991500011910423011101240011000000111111111",
  "7|7|1111119100401910140111004001102220110010511111111",
  "6|7|111199910011111000341100210110042511111111",
  "6|8|111111191004001110221401101520011004100111111111",
  "7|7|1111119150001110222011104441100010110000011111111",
  "7|7|1111999100119910001191202511140120110040411111111",
  "6|6|111111100041122251140101100401111111",
  "6|8|111111191000001110101201140230011500104111111111",
];

// here initialising all necessary variables for panda
M = N = size = XX = YY = xPanda = yPanda = -1;
A = [];

// storing seven image elements
im = [];
for (let i = 0; i < 7; i++) {
  im[i] = new Image();
  im[i].src = "images/" + i + "_1.png";
}

reload_Im = new Image();
reload_Im.src = "images/reload.png";

count = countWin = -1;
level = 0;
// level = data.length - 1;
score = 0;
Score2 = 0;
Xstart = Xend = Ystart = Yend = -1;

class game {
  // Moving and setup functionality getCookie and setCookie functionality

  constructor() {
    this.canvas = null;
    this.context = null;
    this.init();
  }

  init() {
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    document.body.appendChild(this.canvas);
    if (this.getCookie("level") != "") {
      level = Math.floor(this.getCookie("level"));
      score = Math.floor(this.getCookie("score"));
    }

    this.render();
    this.loop();

    this.listenMouse();
    this.listenKeyboard();
    this.listenTouch();
  }

  // it initailises the game level
  setUp(str) {
    this.setCookie("level", level, 7);
    this.setCookie("score", score, 7);
    count = countWin = -1;
    Score2 = 200;
    let s = str.split("|");
    M = Math.floor(s[0]);
    N = Math.floor(s[1]);
    for (let i = 0; i < M; i++) {
      let temp = [];
      for (let j = 0; j < N; j++) {
        temp[j] = s[2][i * N + j];
        if (temp[j] == 5) {
          xPanda = i;
          yPanda = j;
        }
      }

      A[i] = temp;
    }
    console.log(A);

    size = game_W / (N + 1);
    XX = size / 2;
    YY = (game_H - size * M) / 2;
  }

  // move Panda is a method to move player character on the game grid
  movePanda(dx, dy) {
    if (countWin > -1) return;
    if (Score2 < 50) Score2 = 50;
    if (!this.isPoint(xPanda + dx, yPanda + dy)) return;
    if (A[xPanda + dx][yPanda + dy] == 0) {
      A[xPanda][yPanda] = A[xPanda][yPanda] == 5 ? 0 : 4;
      A[xPanda + dx][yPanda + dy] = 5;
      xPanda += dx;
      yPanda += dy;
      Score2--;
    } else if (A[xPanda + dx][yPanda + dy] == 4) {
      A[xPanda][yPanda] = A[xPanda][yPanda] == 5 ? 0 : 4;
      A[xPanda + dx][yPanda + dy] = 6;
      xPanda += dx;
      yPanda += dy;
      Score2--;
    } else if (A[xPanda + dx][yPanda + dy] == 2) {
      if (this.isPoint(xPanda + 2 * dx, yPanda + 2 * dy)) {
        if (A[xPanda + 2 * dx][yPanda + 2 * dy] == 0) {
          A[xPanda + 2 * dx][yPanda + 2 * dy] = 2;
          A[xPanda + dx][yPanda + dy] = 5;
          A[xPanda][yPanda] = A[xPanda][yPanda] == 5 ? 0 : 4;
          xPanda += dx;
          yPanda += dy;
          Score2--;
        } else if (A[xPanda + 2 * dx][yPanda + 2 * dy] == 4) {
          A[xPanda + 2 * dx][yPanda + 2 * dy] = 3;
          A[xPanda + dx][yPanda + dy] = 5;
          A[xPanda][yPanda] = A[xPanda][yPanda] == 5 ? 0 : 4;
          xPanda += dx;
          yPanda += dy;
          Score2--;
        }
      }
    } else if (A[xPanda + dx][yPanda + dy] == 3) {
      if (this.isPoint(xPanda + 2 * dx, yPanda + 2 * dy)) {
        if (A[xPanda + 2 * dx][yPanda + 2 * dy] == 0) {
          A[xPanda][yPanda] = A[xPanda][yPanda] == 5 ? 0 : 4;
          A[xPanda + dx][yPanda + dy] = 6;
          A[xPanda + 2 * dx][yPanda + 2 * dy] = 2;
          xPanda += dx;
          yPanda += dy;
          Score2--;
        } else if (A[xPanda + 2 * dx][yPanda + 2 * dy] == 4) {
          if (A[xPanda + 2 * dx][yPanda + 2 * dy] == 4) {
            A[xPanda][yPanda] = A[xPanda][yPanda] == 5 ? 0 : 4;
            A[xPanda + dx][yPanda + dy] = 6;
            A[xPanda + 2 * dx][yPanda + 2 * dy] = 3;
            xPanda += dx;
            yPanda += dy;
            Score2--;
          }
        }
      }
    }
  }

  // checks the player if won or not
  checkWin() {
    for (let i = 0; i < M; i++)
      for (let j = 0; j < N; j++)
        if (A[i][j] == 4 || A[i][j] == 6) return false;
    return true;
  }

  //  Event listening functionality

  // The listenTouch, listenKeyboard, and listenMouse methods set up event listeners for touch, keyboard, and mouse input.
  listenTouch() {
    document.addEventListener("touchmove", (evt) => {
      Yend = evt.touches[0].pageY;
      Xend =
        evt.touches[0].pageX -
        (document.documentElement.clientWidth - game_W) / 2;
    });

    document.addEventListener("touchstart", (evt) => {
      Ystart = evt.touches[0].pageY;
      Xstart =
        evt.touches[0].pageX -
        (document.documentElement.clientWidth - game_W) / 2;
    });

    document.addEventListener("touchend", (evt) => {
      if (Math.abs(Xstart - Xend) > Math.abs(Ystart - Yend)) {
        if (Xstart > Xend) this.movePanda(0, -1);
        else this.movePanda(0, 1);
      } else {
        if (Ystart > Yend) this.movePanda(-1, 0);
        else this.movePanda(1, 0);
      }
    });
  }

  listenKeyboard() {
    document.addEventListener("keydown", (key) => {
      switch (key.keyCode) {
        case 37:
        case 65:
          // console.log("Left");
          this.movePanda(0, -1);
          break;

        case 38:
        case 87:
          // console.log("Top");
          this.movePanda(-1, 0);
          break;

        case 39:
        case 68:
          // console.log("Right");
          this.movePanda(0, 1);
          break;

        case 40:
        case 83:
          // console.log("Bottom");
          this.movePanda(1, 0);
          break;
      }
    });
  }

  listenMouse() {
    document.addEventListener("mousedown", (evt) => {
      var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
      var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
      if (x > game_W - 1.5 * this.getWidth() && y < 1.3 * this.getWidth()) {
        this.setUp(data[level]);
      }
      console.log(x, " ", y);
    });

    document.addEventListener("mousemove", (evt) => {
      var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
      var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
    });

    document.addEventListener("mouseup", (evt) => {
      var x = evt.offsetX == undefined ? evt.layerX : evt.offsetX;
      var y = evt.offsetY == undefined ? evt.layerY : evt.offsetY;
    });
  }

  // The loop method updates and redraws the game at regular intervals.

  // Board designing and score display designing

  loop() {
    this.update();
    this.draw();
    setTimeout(() => {
      this.loop();
    }, 30);
  }

  // updates the game state, checks for a win, and progresses to the next level if necessary.

  update() {
    count++;
    this.render();
    if (this.checkWin() && countWin == -1) {
      countWin = count + 15;
    }

    if (this.checkWin() && countWin == count) {
      score += Score2;
      if (level == data.length) level = -1;
      this.setUp(data[++level]);
    }
  }

  // render resizes the game canvas if necessary.
  render() {
    if (
      c != document.documentElement.clientWidth / this.canvas.width ||
      game_H != document.documentElement.clientHeight
    ) {
      console.log(game_W * c != document.documentElement.clientWidth);
      this.canvas.width = document.documentElement.clientWidth;
      this.canvas.height = document.documentElement.clientHeight;
      if (this.canvas.width > this.canvas.height)
        this.canvas.width = this.canvas.height;
      c = document.documentElement.clientWidth / this.canvas.width;
      game_W = this.canvas.width;
      game_H = this.canvas.height;
      this.setUp(data[level]);
    }
  }

  // draw is responsible for rendering the game elements, including the matrix and the score display.

  draw() {
    this.clearScreen();
    this.drawMatrix();
    this.drawScore();
  }

  drawScore() {
    this.context.font = this.getWidth() / 1.5 + "px Arial Black";
    this.context.fillStyle = "#FF00CC";
    this.context.fillText(
      "Level: " +
        Math.floor(level + 1) +
        " / " +
        data.length +
        "     Score: " +
        score +
        " + " +
        Score2,
      this.getWidth(),
      this.getWidth()
    );
    this.context.drawImage(
      reload_Im,
      game_W - 1.5 * this.getWidth(),
      0.2 * this.getWidth(),
      this.getWidth(),
      this.getWidth()
    );
  }

  drawMatrix() {
    for (let i = 0; i < M; i++)
      for (let j = 0; j < N; j++)
        if (A[i][j] != 9)
          this.context.drawImage(
            im[A[i][j]],
            XX + j * size,
            YY + i * size,
            size + 1,
            size + 1
          );
  }

  // clearScreen clears the canvas.

  clearScreen() {
    this.context.clearRect(0, 0, game_W, game_H);
    this.context.fillStyle = "#ede7e1";
    this.context.fillRect(0, 0, game_W, game_H);
  }

  // getWidth calculates the size of game elements based on the canvas size.
  getWidth() {
    var area = game_W * game_H;
    return Math.sqrt(area / 300);
  }

  // isPoint checks if a given point is within the game grid.
  isPoint(x, y) {
    if (x < 0 || y < 0 || x >= M || y >= N) return false;
    return true;
  }

  // getCookie and setCookie methods are used for working with cookies to store and retrieve game data.
  getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
}

var g = new game();
