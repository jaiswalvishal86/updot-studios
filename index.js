window.addEventListener("DOMContentLoaded", (event) => {
  const bodyScroll = document.getElementById("bodyScroll");
  const logoList = document.querySelectorAll(".updot_studios__logo-wrapper");
  // const logos = document.querySelectorAll(".updot_studios__logo");
  const scrollDisabledSection = document.getElementById(
    "scrollDisabledSection"
  );
  const titles = document.querySelectorAll(".studio_process__heading");

  //Loader Canvas
  const loaderCanvas = document.getElementById("canvas");
  const loaderCTX = loaderCanvas.getContext("2d");

  loaderCanvas.width = 100;
  loaderCanvas.height = 100;

  class Pixel {
    constructor(loaderEffect, x, y, color) {
      this.effect = loaderEffect;
      this.x = x;
      this.y = 1 - Math.random() * this.effect.height;
      this.originX = Math.floor(x);
      this.originY = Math.floor(y);
      this.color = color;
      this.size = this.effect.gap;
      this.vx = 0;
      this.vy = 0;
    }
    draw(context) {
      context.fillStyle = this.color;
      context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
      this.x += this.originX - this.x;
      this.y += (this.originY - this.y) * 0.1;
    }
  }

  class LoaderEffect {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.pixelsArray = [];
      this.image = document.getElementById("loaderLogo");
      this.centerX = this.width * 0.5;
      this.centerY = this.height * 0.5;
      this.x = this.centerX - this.image.width * 0.5;
      this.y = this.centerY - this.image.height * 0.5;
      this.gap = 3;
    }
    init(context) {
      context.drawImage(this.image, this.x, this.y);
      const pixelData = context.getImageData(
        0,
        0,
        this.width,
        this.height
      ).data;

      for (let y = 0; y < this.height; y += this.gap) {
        for (let x = 0; x < this.width; x += this.gap) {
          const index = (y * this.width + x) * 4;
          const red = pixelData[index];
          const green = pixelData[index + 1];
          const blue = pixelData[index + 2];
          const alpha = pixelData[index + 3];
          const color = "rgb(" + red + "," + green + "," + blue + ")";

          if (alpha == 255) {
            this.pixelsArray.push(new Pixel(this, x, y, color));
          }
        }
      }
    }
    draw(context) {
      this.pixelsArray.forEach((pixel) => pixel.draw(context));
    }
    update() {
      this.pixelsArray.forEach((pixel) => pixel.update());
    }
  }

  const loaderEffect = new LoaderEffect(
    loaderCanvas.width,
    loaderCanvas.height
  );
  loaderEffect.init(loaderCTX);

  function logoAnimate() {
    loaderCTX.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
    loaderEffect.draw(loaderCTX);
    loaderEffect.update();
    requestAnimationFrame(logoAnimate);
  }
  logoAnimate();

  //Updot Canvas
  const logoCanvas = document.getElementById("canvas1");
  const logoCTX = logoCanvas.getContext("2d");

  logoCanvas.width = 1440;
  logoCanvas.height = 300;

  class Cell {
    constructor(effect, x, y) {
      this.effect = effect;
      this.x = x;
      this.y = y;
      this.positionX = this.effect.width * 0.5;
      this.positionY = this.effect.height;
      this.speedX;
      this.speedY;
      this.width = this.effect.cellWidth;
      this.height = this.effect.cellHeight;
      this.image = document.getElementById("projectImage");
      this.slideX = 0;
      this.slideY = 0;
      this.randomize = Math.random() * 10 + 1;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.05;
      this.friction = 0.9;
    }
    draw(context) {
      context.drawImage(
        this.image,
        this.x + this.slideX,
        this.y + this.slideY,
        this.width,
        this.height,
        this.positionX,
        this.positionY,
        this.width,
        this.height
      );
      // context.strokeRect(this.positionX, this.positionY, this.width, this.height);
    }
    update() {
      const dx = this.effect.mouse.x - this.x;
      const dy = this.effect.mouse.y - this.y;
      const distace = Math.hypot(dx, dy);
      if (distace < this.effect.mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = -this.effect.mouse.radius / distace;
        this.vx += force * Math.cos(angle);
        this.vy += force * Math.sin(angle);
      }
      this.slideX += (this.vx *= this.friction) - this.slideX * this.ease;
      this.slideY += (this.vy *= this.friction) - this.slideY * this.ease;
      // this.slideX = Math.random() * 50;
      // this.slideY = Math.random() * 20;
      this.speedX = (this.x - this.positionX) / this.randomize;
      this.speedY = (this.y - this.positionY) / this.randomize;
      this.positionX += this.speedX;
      this.positionY += this.speedY;
    }
  }

  class Effect {
    constructor(logoCanvas) {
      this.logoCanvas = logoCanvas;
      this.width = this.logoCanvas.width;
      this.height = this.logoCanvas.height;
      this.cellWidth = this.width / 100;
      this.cellHeight = this.height / 25;
      this.cell = new Cell(this, 0, 0);
      this.imageGrid = [];
      this.createGrid();
      this.mouse = {
        radius: 80,
        x: undefined,
        y: undefined,
      };
      this.logoCanvas.addEventListener("mousemove", (event) => {
        this.mouse.x = event.offsetX;
        this.mouse.y = event.offsetY;
      });
      this.logoCanvas.addEventListener("mouseleave", (event) => {
        this.mouse.x = undefined;
        this.mouse.y = undefined;
      });
    }
    createGrid() {
      for (let y = 0; y < this.height; y += this.cellHeight) {
        for (let x = 0; x < this.width; x += this.cellWidth) {
          this.imageGrid.push(new Cell(this, x, y));
        }
      }
    }
    render(context) {
      this.imageGrid.forEach((cell) => {
        cell.update();
        cell.draw(context);
      });
    }
  }

  const effect = new Effect(logoCanvas);

  function animate() {
    logoCTX.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
    effect.render(logoCTX);
    requestAnimationFrame(animate);
  }

  new CircleType(document.getElementById("cookies"));

  const handleSectionEnter = () => {
    // Add an event listener to the section to disable arrow key scrolling

    document.addEventListener("keydown", function (e) {
      // console.log(e);
      // Check if the pressed key is an arrow key (ArrowUp, ArrowDown, ArrowLeft, or ArrowRight)
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        // Prevent the default scrolling behavior
        e.preventDefault();
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Call the function when the section enters the viewport
          handleSectionEnter();
          document.addEventListener("keydown", handleKeyPress);
        } else {
          document.removeEventListener("keydown", handleKeyPress);
        }
      });
    },
    { threshold: 0.5 } // Adjust the threshold as needed
  );

  // Start observing the target section
  observer.observe(scrollDisabledSection);

  var options = {
    animate: true,
    patternWidth: 100,
    patternHeight: 100,
    grainOpacity: 0.05,
    grainDensity: 1.2,
    grainWidth: 1,
    grainHeight: 1,
  };

  grained("#grain", options);

  const tlLoader = gsap.timeline({
    onComplete: () => {
      animate();
      bodyScroll.style.overflowY = "auto";
      bodyScroll.style.height = "auto";
    },
  });

  tlLoader
    .to(
      ".studio_loader__wrapper",
      {
        opacity: 0,
        duration: 0.5,
        display: "none",
      },
      "+2"
    )
    .to(
      ".grain_container",
      {
        display: "block",
        duration: 0.01,
      },
      "+0.1"
    )
    .to(".cookies_container", {
      opacity: 1,
      duration: 0.4,
    })
    .to(".studio_header__marquee", {
      opacity: 1,
      duration: 0.4,
    });

  // Split the text up
  function runSplit() {
    typeSplit = new SplitType(".studios_about__content", {
      types: "lines, words",
    });
    $(".word").append("<div class='line-mask'></div>");
    createAnimation();
  }

  runSplit();

  // Create staggered animation
  function createAnimation() {
    let allMasks = $(".word")
      .map(function () {
        return $(this).find(".line-mask");
      })
      .get();

    let tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".studios_about__wrapper",
        start: "top+=350px bottom",
        end: "bottom+=250px bottom",
        scrub: 1,
      },
    });

    tl.to(allMasks, {
      width: "0%",
      duration: 1.2,
      stagger: 0.2,
    })
      // .fromTo(
      //   typeSplit.words,
      //   {
      //     opacity: 0.2,
      //   },
      //   {
      //     opacity: 1,
      //     ease: "power4.inOut",
      //     stagger: 0.2,
      //   }
      // )
      .fromTo(
        ".highlighter",
        {
          width: "0%",
        },
        {
          width: "100%",
          ease: "power4.easeOut",
          duration: 5,
        }
      );
  }

  // let score = 0;
  const canvas = document.getElementById("tetris");
  const gameScreen = document.getElementById("game_screen");
  const gameOverElement = document.getElementById("game_over");
  const ctx = canvas.getContext("2d");

  const scale = 40;

  ctx.scale(scale, scale);

  const tWidth = canvas.width / scale;
  const tHeight = canvas.height / scale;

  const pieces = [
    [
      [1, 1],
      [1, 1],
    ],
    [
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
      [0, 2, 0, 0],
    ],
    [
      [0, 0, 0],
      [3, 3, 0],
      [0, 3, 3],
    ],
    [
      [0, 0, 0],
      [0, 4, 4],
      [4, 4, 0],
    ],
    [
      [5, 0, 0],
      [5, 0, 0],
      [5, 5, 0],
    ],
    [
      [0, 0, 6],
      [0, 0, 6],
      [0, 6, 6],
    ],
    [
      [0, 0, 0],
      [7, 7, 7],
      [0, 7, 0],
    ],
  ];

  const colors = [
    null,
    "#891FDB",
    "#891FDB",
    "#891FDB",
    "#891FDB",
    "#891FDB",
    "#891FDB",
    "#891FDB",
  ];

  let arena = [];
  let rand;

  const player = {
    pos: { x: 10, y: 0 },
    matrix: null,
    color: null,
  };

  rand = Math.floor(Math.random() * pieces.length);
  player.matrix = pieces[rand];
  player.color = colors[rand + 1];

  function drawMatrix(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          ctx.fillRect(x + j, y + i, 1, 1);
          ctx.strokeStyle = "white"; // Set your stroke color
          ctx.lineWidth = 0.05; // Set your stroke width
          ctx.strokeRect(x + j, y + i, 1, 1);
        }
      }
    }
  }

  function rotateMatrix(matrix, dir) {
    let newMatrix = [];

    for (let i in matrix) newMatrix.push([]);

    if (dir === 1) {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          newMatrix[j][matrix.length - i - 1] = matrix[i][j];
        }
      }
    } else {
      for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
          newMatrix[matrix.length - j - 1][i] = matrix[i][j];
        }
      }
    }

    return newMatrix;
  }

  function collides(player, arena) {
    for (let i = 0; i < player.matrix.length; i++) {
      for (let j = 0; j < player.matrix[i].length; j++) {
        if (
          player.matrix[i][j] &&
          arena[player.pos.y + i + 1][player.pos.x + j + 1]
        )
          return 1;
      }
    }

    return 0;
  }

  function mergeArena(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix[i].length; j++) {
        arena[y + i + 1][x + j + 1] =
          arena[y + i + 1][x + j + 1] || matrix[i][j];
      }
    }
  }

  function clearBlocks() {
    for (let i = 1; i < arena.length - 2; i++) {
      let clear = 1;

      for (let j = 1; j < arena[i].length - 1; j++) {
        if (!arena[i][j]) clear = 0;
      }

      if (clear) {
        // score += 10;
        // scoreElement.innerText = score;
        let r = new Array(tWidth).fill(0);
        r.push(1);
        r.unshift(1);

        arena.splice(i, 1);
        arena.splice(1, 0, r);
      }
    }
  }

  function drawArena() {
    for (let i = 1; i < arena.length - 2; i++) {
      for (let j = 1; j < arena[i].length - 1; j++) {
        if (arena[i][j]) {
          ctx.fillStyle = colors[arena[i][j]];
          ctx.fillRect(j - 1, i - 1, 1, 1);
          ctx.strokeStyle = "white"; // Set your stroke color
          ctx.lineWidth = 0.05; // Set your stroke width
          ctx.strokeRect(j - 1, i - 1, 1, 1);
        }
      }
    }
  }

  function initArena() {
    arena = [];

    const r = new Array(tWidth + 2).fill(1);
    arena.push(r);

    for (let i = 0; i < tHeight; i++) {
      let row = new Array(tWidth).fill(0);
      row.push(1);
      row.unshift(1);

      arena.push(row);
    }

    arena.push(r);
    arena.push(r);
  }

  function gameOver() {
    for (let j = 1; j < arena[1].length - 1; j++)
      if (arena[1][j]) {
        gameOverElement.style.display = "flex";
      }
    return;
  }

  let interval = 400;
  let lastTime = 0;
  let count = 0;

  function update(time = 0) {
    const dt = time - lastTime;
    lastTime = time;
    count += dt;

    if (count >= interval) {
      player.pos.y++;
      count = 0;
    }

    if (collides(player, arena)) {
      mergeArena(player.matrix, player.pos.x, player.pos.y - 1);
      clearBlocks();
      gameOver();

      player.pos.y = 0;
      player.pos.x = 10;

      rand = Math.floor(Math.random() * pieces.length);
      player.matrix = pieces[rand];
      player.color = colors[rand + 1];

      interval = 400;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawArena();
    ctx.fillStyle = player.color;
    drawMatrix(player.matrix, player.pos.x, player.pos.y);

    requestAnimationFrame(update);
  }

  // play.addEventListener("click", () => {
  //   gameOverElement.style.display = "none";
  //   // score = 0;
  //   return initArena();
  // });

  document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37 && interval - 1) {
      player.pos.x--;
      if (collides(player, arena)) player.pos.x++;
    } else if (event.keyCode === 39 && interval - 1) {
      player.pos.x++;
      if (collides(player, arena)) player.pos.x--;
    } else if (event.keyCode === 40) {
      player.pos.y++;
      count = 0;
    } else if (event.keyCode === 38) {
      player.matrix = rotateMatrix(player.matrix, 1);
      if (collides(player, arena))
        player.matrix = rotateMatrix(player.matrix, -1);
    } else if (event.keyCode === 32) {
      interval = 1;
    } else if (event.keyCode === 82 && collides(player, arena)) {
      gameOverElement.style.display = "none";
      // score = 0;
      return initArena();
    }
  });
  function handleKeyPress(event) {
    gameScreen.style.display = "none";
    initArena();
    update();
    // Remove the event listener after it has been triggered
    document.removeEventListener("keydown", handleKeyPress);
  }

  let headTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".studio_process__wrapper",
      start: "top top",
      end: "bottom+=350px top",
      scrub: 1,
    },
  });
  titles.forEach(function (title) {
    if (title) {
      headTl
        .to(".distort feFlood", {
          attr: {
            x: "1",
            y: "1",
            height: "10",
            width: "10",
          },
          ease: "circ.out",
        })
        .to(
          ".distort feMorphology",
          {
            attr: {
              radius: "1",
            },
            ease: "circ.out",
          },
          "<"
        );
    }
  });

  //Logo Hover
  logoList.forEach(function (logo) {
    let tlm = new TimelineMax({ paused: true });
    let top = logo.querySelector(".top");
    let bottom = logo.querySelector(".bottom");
    tlm
      .to(logo, 0.06, { skewX: 1, skewY: 0, ease: Power4.easeInOut })
      .to(logo, 0.05, { skewX: 0, skewY: 0, ease: Power4.easeInOut })
      .to(logo, 0.04, { opacity: 0 })
      .to(logo, 0.04, { opacity: 1 })
      .to(logo, {
        duration: 0.03,
        x: "random(-5, 5, 1)",
        y: "random(-5, 5, 1)",
        ease: Power4.easeInOut,
      })
      .to(logo, { duration: 0.03, x: 1, y: 0, ease: Power4.easeInOut })
      .to(logo, { duration: 0.03, opacity: 0.5, ease: Power4.easeInOut })
      .to(logo, { duration: 0.04, opacity: 1, ease: Power4.easeInOut })
      .to(logo, {
        duration: 0.03,
        skewX: "random(-20, 20, 1)",
        ease: Power4.easeInOut,
      })
      .to(logo, { duration: 0.04, skewX: 0, ease: Power4.easeInOut })

      .add("split", 0)
      .to(top, 0.2, { y: 0, opacity: 0, ease: Power4.easeInOut }, "split")
      .fromTo(
        bottom,
        0.2,
        { opacity: 0 },
        { y: 0, opacity: 1, ease: Power4.easeInOut },
        "split"
      )
      .add("split", 0)
      .to(logo, 0, { scale: 1.1 }, "split");

    logo.addEventListener("mouseenter", function () {
      tlm.play();
    });

    logo.addEventListener("mouseleave", function () {
      tlm.reverse();
    });

    // Attach the timeline to the item
    logo.animationTimeline = tlm;
  });
});
