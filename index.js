window.addEventListener("DOMContentLoaded", (event) => {
  const bodyScroll = document.getElementById("bodyScroll");
  const logoList = document.querySelectorAll(".updot_studios__logo-wrapper");
  // const logos = document.querySelectorAll(".updot_studios__logo");
  const scrollDisabledSection = document.getElementById(
    "scrollDisabledSection"
  );
  const titles = document.querySelectorAll(".studio_process__heading");

  const container = document.getElementById("canvasContainer");
  let hasIntersected = false;

  let hasServiceIntersected = false;

  const matterContainer = document.querySelector("#matter-container");
  const THICCNESS = 120;

  //Loader Canvas
  const loaderCanvas = document.getElementById("canvas");
  const loaderCTX = loaderCanvas.getContext("2d");
  let logoCanvas1 = true;

  loaderCanvas.width = 100;
  loaderCanvas.height = 100;

  class Pixel {
    constructor(loaderEffect, x, y, color) {
      this.effect = loaderEffect;
      this.x = this.effect.width * Math.random();
      this.y = this.effect.height;
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
      this.x += (this.originX - this.x) * Math.random() * 0.1;
      this.y += (this.originY - this.y) * Math.random() * 0.03;
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
      this.gap = 8;
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

  // function logoAnimate() {
  //   loaderCTX.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
  //   loaderEffect.draw(loaderCTX);
  //   loaderEffect.update();
  //   requestAnimationFrame(logoAnimate);
  // }
  // logoAnimate();

  //Updot Logo Canvas
  const logoCanvas = document.getElementById("canvas1");
  const logoCTX = logoCanvas.getContext("2d");
  let updotCanvas1 = false;

  logoCanvas.width = 1440;
  logoCanvas.height = 320;

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
      this.randomize = Math.random() * 20 + 1;
      this.vx = 0;
      this.vy = 0;
      this.ease = 0.06;
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
        const force = distace / this.effect.mouse.radius;
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
      this.cellWidth = this.width / 56;
      this.cellHeight = this.height / 14;
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
    if (logoCanvas1) {
      loaderCTX.clearRect(0, 0, loaderCanvas.width, loaderCanvas.height);
      loaderEffect.draw(loaderCTX);
      loaderEffect.update();
    }

    if (updotCanvas1) {
      logoCTX.clearRect(0, 0, logoCanvas.width, logoCanvas.height);
      effect.render(logoCTX);
    }

    requestAnimationFrame(animate);
  }
  animate();

  setTimeout(() => {
    logoCanvas1 = false;
  }, 4000);

  setTimeout(() => {
    updotCanvas1 = true;
  }, 5500);

  new CircleType(document.getElementById("cookies"));

  const handleSectionEnter = () => {
    // Event listener to the section to disable arrow key scrolling

    document.addEventListener("keydown", function (e) {
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
    patternWidth: 200,
    patternHeight: 200,
    grainOpacity: 0.1,
    grainDensity: 1.2,
    grainWidth: 1,
    grainHeight: 1,
  };

  grained("#grain", options);

  /**
   * Execution of Loader Timeline
   */
  const tlLoader = gsap.timeline({
    onComplete: () => {
      bodyScroll.style.overflowY = "auto";
      bodyScroll.style.height = "auto";
    },
  });

  tlLoader
    .to(
      "#canvas",
      {
        rotateY: 180,
        scale: 0,
        duration: 0.5,
      },
      "<+3.5"
    )
    .to(
      ".studio_loader__wrapper",
      {
        opacity: 0,
        duration: 0.5,
        display: "none",
      },
      "<+0.5"
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

  // Create Opacity staggered animation
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
    }).fromTo(
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

  /**
   * Tetris Game
   */

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

  /**
   * WebGL Experience
   */

  function clamp(number, min, max) {
    return Math.max(min, Math.min(number, max));
  }

  class Sketch {
    constructor(options) {
      this.scene = new THREE.Scene();

      this.container = options.dom;
      this.img = this.container.querySelector("img");
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.setSize(this.width, this.height);
      // this.renderer.setClearColor(0xeeeeee, 1);
      this.renderer.physicallyCorrectLights = true;
      this.renderer.outputEncoding = THREE.sRGBEncoding;

      this.container.appendChild(this.renderer.domElement);

      var frustumSize = 1;
      var aspect = window.innerWidth / window.innerHeight;
      this.camera = new THREE.OrthographicCamera(
        frustumSize / -2,
        frustumSize / 2,
        frustumSize / 2,
        frustumSize / -2,
        -1000,
        1000
      );
      this.camera.position.set(0, 0, 2);

      this.time = 0;

      this.mouse = {
        x: 0,
        y: 0,
        prevX: 0,
        prevY: 0,
        vX: 0,
        vY: 0,
      };

      this.isPlaying = true;
      this.settings();
      this.addObjects();
      this.resize();
      this.render();
      this.setupResize();

      this.mouseEvents();
    }

    getValue(val) {
      return parseFloat(this.container.getAttribute("data-" + val));
    }

    mouseEvents() {
      this.container.addEventListener("mousemove", (e) => {
        this.mouse.x = e.clientX / this.width;
        this.mouse.y = e.clientY / this.height;

        // console.log(this.mouse.x,this.mouse.y)

        this.mouse.vX = this.mouse.x - this.mouse.prevX;
        this.mouse.vY = this.mouse.y - this.mouse.prevY;

        this.mouse.prevX = this.mouse.x;
        this.mouse.prevY = this.mouse.y;

        // console.log(this.mouse.vX,'vx')
      });
    }

    settings() {
      let that = this;
      this.settings = {
        grid: this.getValue("grid") || 34, //generate how many grid
        mouse: this.getValue("mouse") || 0.25, //mouse radius affecting the distortion
        strength: this.getValue("strength") || 1, //higher = more parallax and distorted.
        relaxation: this.getValue("relaxation") || 0.9, //lower = faster pixel re-sorting
        aspectRatio: this.getValue("aspectRatio") || 1.77, //change aspectRatio according to your image size.
      };
    }

    setupResize() {
      window.addEventListener("resize", this.resize.bind(this));
    }

    resize() {
      this.width = this.container.offsetWidth;
      this.height = this.container.offsetHeight;
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;

      // image cover
      //image Aspect depends on your image, change accordingly
      this.imageAspect = 1 / this.settings.aspectRatio;

      let a1;
      let a2;
      if (this.height / this.width > this.imageAspect) {
        a1 = (this.width / this.height) * this.imageAspect;
        a2 = 1;
      } else {
        a1 = 1;
        a2 = this.height / this.width / this.imageAspect;
      }

      this.material.uniforms.resolution.value.x = this.width;
      this.material.uniforms.resolution.value.y = this.height;
      this.material.uniforms.resolution.value.z = a1;
      this.material.uniforms.resolution.value.w = a2;

      this.camera.updateProjectionMatrix();
      this.regenerateGrid();
    }

    regenerateGrid() {
      this.size = this.settings.grid;

      const width = this.size;
      const height = this.size;

      const size = width * height;
      const data = new Float32Array(3 * size);
      const color = new THREE.Color(0xffffff);

      const r = Math.floor(color.r * 255);
      const g = Math.floor(color.g * 255);
      const b = Math.floor(color.b * 255);

      for (let i = 0; i < size; i++) {
        let r = Math.random() * 255 - 125;
        let r1 = Math.random() * 255 - 125;

        const stride = i * 3;

        data[stride] = r;
        data[stride + 1] = r1;
        data[stride + 2] = r;
      }

      // used the buffer to create a DataTexture

      this.texture = new THREE.DataTexture(
        data,
        width,
        height,
        THREE.RGBFormat,
        THREE.FloatType
      );

      this.texture.magFilter = this.texture.minFilter = THREE.NearestFilter;

      if (this.material) {
        this.material.uniforms.uDataTexture.value = this.texture;
        this.material.uniforms.uDataTexture.value.needsUpdate = true;
      }
    }

    addObjects() {
      this.regenerateGrid();
      let texture = new THREE.TextureLoader().load(this.img.src, function () {
        texture.minFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        var tex = texture.clone();
        tex.needsUpdate = true;
      });
      this.material = new THREE.ShaderMaterial({
        extensions: {
          derivatives: "#extension GL_OES_standard_derivatives : enable",
        },
        side: THREE.DoubleSide,
        uniforms: {
          time: {
            value: 0,
          },
          resolution: {
            value: new THREE.Vector4(),
          },
          uTexture: {
            value: texture,
          },
          uDataTexture: {
            value: this.texture,
          },
        },
        vertexShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform vec2 pixels;
      float PI = 3.141592653589793238;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,
        fragmentShader: `
      uniform float time;
      uniform float progress;
      uniform sampler2D uDataTexture;
      uniform sampler2D uTexture;
      
      
      uniform vec4 resolution;
      varying vec2 vUv;
      varying vec3 vPosition;
      float PI = 3.141592653589793238;
      void main()	{
        vec2 newUV = (vUv - vec2(0.5))*resolution.zw + vec2(0.5);
        vec4 color = texture2D(uTexture,newUV);
        vec4 offset = texture2D(uDataTexture,vUv);
        gl_FragColor = vec4(vUv,0.0,1.);
        gl_FragColor = vec4(offset.r,0.,0.,1.);
        gl_FragColor = color;
        gl_FragColor = texture2D(uTexture,newUV - 0.01*offset.rg);
        // gl_FragColor = offset;
      
      }
      `,
      });
      this.geometry = new THREE.PlaneGeometry(1, 1, 1, 1);

      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);

      this.resize();
    }

    updateDataTexture() {
      let data = this.texture.image.data;
      for (let i = 0; i < data.length; i += 3) {
        data[i] *= this.settings.relaxation;
        data[i + 1] *= this.settings.relaxation;
      }

      let gridMouseX = this.size * this.mouse.x;
      let gridMouseY = this.size * (1 - this.mouse.y);
      let maxDist = this.size * this.settings.mouse;
      let aspect = this.height / this.width;

      for (let i = 0; i < this.size; i++) {
        for (let j = 0; j < this.size; j++) {
          let distance = (gridMouseX - i) ** 2 / aspect + (gridMouseY - j) ** 2;
          let maxDistSq = maxDist ** 2;

          if (distance < maxDistSq) {
            let index = 3 * (i + this.size * j);

            let power = maxDist / Math.sqrt(distance);
            power = clamp(power, 0, 10);
            // if(distance <this.size/32) power = 1;
            // power = 1;

            data[index] += this.settings.strength * 100 * this.mouse.vX * power;
            data[index + 1] -=
              this.settings.strength * 100 * this.mouse.vY * power;
          }
        }
      }

      this.mouse.vX *= 0.9;
      this.mouse.vY *= 0.9;
      this.texture.needsUpdate = true;
    }

    render() {
      if (!this.isPlaying) return;
      this.time += 0.05;
      this.updateDataTexture();
      this.material.uniforms.time.value = this.time;
      requestAnimationFrame(this.render.bind(this));
      this.renderer.render(this.scene, this.camera);
    }
  }

  const processObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasIntersected) {
          new Sketch({
            dom: document.getElementById("canvasContainer"),
          });
          hasIntersected = true;
        }
      });
    },
    { threshold: 0.5 } // Adjust the threshold as needed
  );

  processObserver.observe(container);

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

  const workSwiper = new Swiper(".swiper.is-studio_work", {
    // Optional parameters
    slidesPerView: "auto",
    keyboard: true,
    direction: "horizontal",
    loop: false,
    speed: 800,
    mousewheel: {
      forceToAxis: true,
    },
    touchEventsTarget: "studio_work__section",
    freeMode: true,
  });

  /**
   * MatterJS
   */

  const imageUrls = [
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb626a62c6deb7db9ec_branding.svg",
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb6f6371a9c4a15a3e3_performance.svg",
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb6a67b6251abb74bf4_marketplace.svg",
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb611a7e53ea1d21d8b_social.svg",
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb685b7ef3655329ece_video.svg",
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb6cb1ac252d3989283_influencer.svg",
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb68052e8b408b4eb83_vfx.svg",
    "https://uploads-ssl.webflow.com/644a11bb13c4d70ea3d13d26/65c1cdb6632188c5c2e58e53_content.svg",
  ];

  const loadedImages = [];
  // Function to preload images
  function preloadImages(urls, callback) {
    let loadedCount = 0;

    // Load each image
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;

      // Event listener for image load
      img.onload = () => {
        loadedCount++;
        loadedImages.push(img);

        if (loadedCount === urls.length) {
          // All images are loaded
          callback(loadedImages);
        }
      };

      // Event listener for image error
      img.onerror = () => {
        loadedCount++;
        console.error(`Failed to load image: ${url}`);

        if (loadedCount === urls.length) {
          // All images are either loaded or failed to load
          callback(loadedImages);
        }
      };
    });
  }

  // Example usage

  const renderCanvas = () => {
    // Create an engine
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1.2;

    // Create a renderer
    const render = Matter.Render.create({
      element: matterContainer,
      engine: engine,
      options: {
        width: matterContainer.clientWidth,
        height: matterContainer.clientHeight,
        background: "transparent",
        wireframes: false, // Set to true for wireframe rendering
        showAngleIndicator: false,
      },
    });

    const boxes = [];

    const branding = Matter.Bodies.rectangle(
      matterContainer.clientWidth / 2,
      0,
      209,
      52,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[0],
          },
        },
      }
    );

    const performance = Matter.Bodies.rectangle(
      400,
      matterContainer.clientHeight * 0.2,
      520,
      53,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[1],
          },
        },
      }
    );

    const marketplace = Matter.Bodies.rectangle(
      550,
      matterContainer.clientHeight * 0.45,
      547,
      52,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[2],
          },
        },
      }
    );

    const social = Matter.Bodies.rectangle(
      500,
      matterContainer.clientHeight * 0.3,
      537,
      53,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[3],
          },
        },
      }
    );

    const video = Matter.Bodies.rectangle(
      600,
      matterContainer.clientHeight * 0.55,
      379,
      52,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[4],
          },
        },
      }
    );

    const influencer = Matter.Bodies.rectangle(
      350,
      matterContainer.clientHeight * 0.7,
      479,
      53,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[5],
          },
        },
      }
    );

    const vfx = Matter.Bodies.rectangle(
      500,
      matterContainer.clientHeight * 0.85,
      392,
      53,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[6],
          },
        },
      }
    );

    const content = Matter.Bodies.rectangle(
      350,
      matterContainer.clientHeight * 0.95,
      392,
      52,
      {
        torque: 0.5,
        friction: 0.3,
        frictionAir: 0.00001,
        restitution: 0.7,
        render: {
          sprite: {
            texture: imageUrls[7],
          },
        },
      }
    );

    boxes.push(
      branding,
      performance,
      marketplace,
      social,
      video,
      influencer,
      vfx,
      content
    );

    // Add bodies to the world
    Matter.World.add(engine.world, boxes);

    const ground1 = Matter.Bodies.rectangle(
      0,
      matterContainer.clientHeight * 0.15,
      matterContainer.clientWidth * 2,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const ground2 = Matter.Bodies.rectangle(
      0,
      matterContainer.clientHeight * 0.275,
      matterContainer.clientWidth * 2,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const ground3 = Matter.Bodies.rectangle(
      0,
      matterContainer.clientHeight * 0.4,
      matterContainer.clientWidth * 2,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const ground4 = Matter.Bodies.rectangle(
      0,
      matterContainer.clientHeight * 0.525,
      matterContainer.clientWidth * 2,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const ground5 = Matter.Bodies.rectangle(
      0,
      matterContainer.clientHeight * 0.65,
      matterContainer.clientWidth * 2,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const ground6 = Matter.Bodies.rectangle(
      0,
      matterContainer.clientHeight * 0.775,
      matterContainer.clientWidth * 2,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const ground7 = Matter.Bodies.rectangle(
      0,
      matterContainer.clientHeight * 0.9,
      matterContainer.clientWidth * 2,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const ground = Matter.Bodies.rectangle(
      matterContainer.clientWidth / 2,
      matterContainer.clientHeight + THICCNESS / 2,
      27184,
      THICCNESS,
      {
        isStatic: true,
        render: {
          fillStyle: "transparent",
        },
      }
    );

    const leftWall = Matter.Bodies.rectangle(
      0 - THICCNESS / 2,
      matterContainer.clientHeight / 2,
      THICCNESS,
      matterContainer.clientHeight * 5,
      {
        isStatic: true,
      }
    );

    const rightWall = Matter.Bodies.rectangle(
      matterContainer.clientWidth + THICCNESS / 2,
      matterContainer.clientHeight / 2,
      THICCNESS,
      matterContainer.clientHeight * 5,
      { isStatic: true }
    );

    Matter.World.add(engine.world, [
      ground,
      ground1,
      ground2,
      ground3,
      ground4,
      ground5,
      ground6,
      ground7,
      leftWall,
      rightWall,
    ]);

    let mouse = Matter.Mouse.create(render.canvas);
    let mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    Matter.Composite.add(engine.world, mouseConstraint);

    // Add gravity
    Matter.World.add(
      engine.world,
      Matter.Constraint.create({
        pointA: { x: 0, y: 0 },
        // bodyB: boxes[0],
        pointB: { x: 0, y: 0 },
        length: 0.01,
        stiffness: 0.1,
      })
    );

    // Run the renderer
    Matter.Render.run(render);

    // create runner
    const runner = Matter.Runner.create();

    // Run the engine
    Matter.Runner.run(runner, engine);

    function handleResize(matterContainer) {
      // set canvas size to new values
      render.canvas.width = matterContainer.clientWidth;
      render.canvas.height = matterContainer.clientHeight;

      //Reposition ground
      Matter.Body.setPosition(
        ground,
        Matter.Vector.create(
          matterContainer.clientWidth / 2,
          matterContainer.clientHeight + THICCNESS / 2
        )
      );

      //Reposition Right Wall
      Matter.Body.setPosition(
        rightWall,
        Matter.Vector.create(
          matterContainer.clientWidth + THICCNESS / 2,
          matterContainer.clientHeight / 2
        )
      );
    }

    // Adjust the canvas size on window resize
    window.addEventListener("resize", () => handleResize(matterContainer));

    window.addEventListener("scroll", function () {
      let matterContainerPosition = matterContainer.getBoundingClientRect().y;

      // Check if the box touches or goes above the top of the viewport
      if (matterContainerPosition <= -branding.position.y) {
        Matter.Composite.remove(engine.world, ground1);
      }
      if (matterContainerPosition <= -performance.position.y) {
        Matter.Composite.remove(engine.world, ground2);
      }
      if (matterContainerPosition <= -social.position.y) {
        Matter.Composite.remove(engine.world, ground3);
      }
      if (matterContainerPosition <= -marketplace.position.y) {
        Matter.Composite.remove(engine.world, ground4);
      }
      if (matterContainerPosition <= -video.position.y) {
        Matter.Composite.remove(engine.world, ground5);
      }
      if (matterContainerPosition <= -influencer.position.y) {
        Matter.Composite.remove(engine.world, ground6);
      }
      if (matterContainerPosition <= -vfx.position.y) {
        Matter.Composite.remove(engine.world, ground7);
      }
    });
  };

  const matterScrollOptions = {
    root: null, // use the viewport as the root
    rootMargin: "0px", // no margin
    threshold: 0.5, // trigger when 50% of the target is visible
  };

  preloadImages(imageUrls, (loadedImages) => {
    console.log("All images are preloaded:", loadedImages);
    // Now you can use the preloaded images in your application
    renderCanvas();
  });
});
