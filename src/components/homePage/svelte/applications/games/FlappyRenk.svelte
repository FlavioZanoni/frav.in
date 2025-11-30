<script lang="ts">
  import birdImage from "/src/images/flappyrenk/birdimg.png"
  import birdImageDead from "/src/images/flappyrenk/birdimgdead.png"
  import { onMount } from "svelte"
  let bird: HTMLElement
  let gameContainer: HTMLElement
  let birdHitbox: HTMLElement
  const GAP_SIZE = 180

  let currentBirdImage = birdImage

  let birdBottom = 250
  let birdLeft = 220
  let gravity = 0.5
  let velocity = 0
  let isGameOver = false
  let gap = GAP_SIZE
  let score = 0

  let gameTimerId: NodeJS.Timeout
  let obstacleTimers: NodeJS.Timeout[] = []
  let obstacleGenerationTimeouts: NodeJS.Timeout[] = []

  const birdWidth = 60
  const birdHeight = 45
  const hitboxPadding = 8
  const groundHeight = 80

  function startGame() {
    if (gameTimerId) return

    currentBirdImage = birdImage

    birdBottom = 375
    velocity = 0
    score = 0
    isGameOver = false

    const obstacles = gameContainer.querySelectorAll(".obstacle, .topObstacle")
    obstacles.forEach((obs) => obs.remove())

    document.addEventListener("keyup", control)
    gameTimerId = setInterval(gameLoop, 20)
    bird.classList.remove("dead")
    generateObstacle()
  }

  function gameLoop() {
    velocity += gravity
    birdBottom -= velocity

    if (birdBottom > 455) {
      birdBottom = 455
      velocity = 0
    }

    if (birdBottom <= groundHeight - 20) {
      birdBottom = groundHeight
      gameOver()
    }

    if (bird) {
      bird.style.bottom = birdBottom + "px"
      bird.style.left = birdLeft + "px"
    }

    if (birdHitbox) {
      birdHitbox.style.bottom = birdBottom + hitboxPadding + "px"
      birdHitbox.style.left = birdLeft + hitboxPadding + "px"
      birdHitbox.style.width = birdWidth - hitboxPadding * 2 + "px"
      birdHitbox.style.height = birdHeight - hitboxPadding * 2 + "px"
    }
  }

  function control(e: KeyboardEvent) {
    if (e.code === "Space" && !isGameOver) {
      jump()
    }
  }

  function jump() {
    velocity = -9
  }

  function generateObstacle() {
    if (isGameOver) return

    let obstacleLeft = 700
    let randomHeight = Math.random() * 120 + 80
    let obstacleBottomHeight = randomHeight

    const obstacle = document.createElement("div")
    const topObstacle = document.createElement("div")
    obstacle.classList.add("obstacle")
    topObstacle.classList.add("topObstacle")
    obstacle.setAttribute("data-scored", "false")

    if (!gameContainer) return

    gameContainer.appendChild(obstacle)
    gameContainer.appendChild(topObstacle)

    const obstacleWidth = 60
    const topObstacleHeight = 500 - groundHeight - obstacleBottomHeight - gap

    obstacle.style.left = obstacleLeft + "px"
    topObstacle.style.left = obstacleLeft + "px"
    obstacle.style.bottom = groundHeight + "px"
    obstacle.style.height = obstacleBottomHeight + "px"
    topObstacle.style.top = "0px"
    topObstacle.style.height = topObstacleHeight + "px"

    function moveObstacle() {
      if (isGameOver) return
      obstacleLeft -= 3
      obstacle.style.left = obstacleLeft + "px"
      topObstacle.style.left = obstacleLeft + "px"

      if (
        obstacleLeft < birdLeft &&
        obstacle.getAttribute("data-scored") === "false"
      ) {
        obstacle.setAttribute("data-scored", "true")
        score++
        if (gap >= GAP_SIZE / 2) {
          gap--
        }
        console.log(gap)
      }

      if (obstacleLeft < -60) {
        clearInterval(timerId)
        if (gameContainer.contains(obstacle))
          gameContainer.removeChild(obstacle)
        if (gameContainer.contains(topObstacle))
          gameContainer.removeChild(topObstacle)
      }

      // AABB collision
      const birdLeft_edge = birdLeft + hitboxPadding
      const birdRight_edge = birdLeft + birdWidth - hitboxPadding
      const birdBottom_edge = birdBottom + hitboxPadding
      const birdTop_edge = birdBottom + birdHeight - hitboxPadding

      const obstacleLeft_edge = obstacleLeft
      const obstacleRight_edge = obstacleLeft + obstacleWidth
      const obstacleBottom_edge = groundHeight
      const obstacleTop_edge = groundHeight + obstacleBottomHeight

      const topObstacleLeft_edge = obstacleLeft
      const topObstacleRight_edge = obstacleLeft + obstacleWidth
      const topObstacleBottom_edge = 500 - topObstacleHeight
      const topObstacleTop_edge = 500

      const hitsBottomObstacle =
        birdRight_edge >= obstacleLeft_edge &&
        birdLeft_edge <= obstacleRight_edge &&
        birdTop_edge >= obstacleBottom_edge &&
        birdBottom_edge <= obstacleTop_edge

      const hitsTopObstacle =
        birdRight_edge >= topObstacleLeft_edge &&
        birdLeft_edge <= topObstacleRight_edge &&
        birdTop_edge >= topObstacleBottom_edge &&
        birdBottom_edge <= topObstacleTop_edge

      if (hitsBottomObstacle || hitsTopObstacle) {
        gameOver()
        clearInterval(timerId)
      }
    }

    let timerId = setInterval(moveObstacle, 20)
    obstacleTimers.push(timerId)

    if (!isGameOver) {
      let nextObstacleTimeout = setTimeout(generateObstacle, 2000)
      obstacleGenerationTimeouts.push(nextObstacleTimeout)
    }
  }

  function gameOver() {
    currentBirdImage = birdImageDead
    clearInterval(gameTimerId)

    obstacleTimers.forEach((timer) => clearInterval(timer))
    obstacleTimers = []

    obstacleGenerationTimeouts.forEach((timeout) => clearTimeout(timeout))
    obstacleGenerationTimeouts = []

    isGameOver = true
    document.removeEventListener("keyup", control)
    gameTimerId = null
  }

  onMount(() => {})
</script>

<div class="game-container" bind:this={gameContainer}>
  <div class="sky">
    <div class="bird" bind:this={bird}>
      <img src={currentBirdImage.src} alt="flappy brid" />
    </div>
  </div>
  {#if !gameTimerId && !isGameOver}
    <div class="logo-container">
      <h1 class="game-logo">FLAPPY RENK</h1>
    </div>
  {/if}
  <div class="ground"></div>
</div>

<div class="controls">
  {#if !gameTimerId && !isGameOver}
    <button on:click={startGame}>Start Game</button>
  {:else if isGameOver}
    <h2>Game Over! Score: {score}</h2>
    <button on:click={startGame}>Restart</button>
  {:else}
    <h1>Score: {score}</h1>
    <p>Press SPACE to jump</p>
  {/if}
</div>

<style>
  .game-container {
    width: 100%;
    height: 500px;
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom, #4ec0ca 0%, #70c5ce 100%);
  }

  .sky {
    width: 100%;
    height: 500px;
    position: absolute;
  }

  .ground {
    background-color: #dedaa4;
    width: 100%;
    height: 100px;
    position: absolute;
    bottom: 0;
    z-index: 10;
    border-top: 3px solid #8b7355;
  }

  .bird {
    position: absolute;
    width: 60px;
    height: 45px;
    z-index: 5;
  }

  .bird img {
    width: 150%;
    height: 150%;
    object-fit: contain;
    filter: drop-shadow(2px 2px 3px rgba(0, 0, 0, 0.3));
  }

  :global(.obstacle) {
    background: #5cb85c;
    width: 60px;
    position: absolute;
    border: 2px solid #3d7d3d;
    border-radius: 5px 5px 0 0;
    z-index: 3;
  }

  :global(.topObstacle) {
    background-color: #5cb85c;
    width: 60px;
    position: absolute;
    border: 2px solid #3d7d3d;
    border-radius: 0 0 5px 5px;
    z-index: 3;
  }

  .controls {
    padding: 20px;
    text-align: center;
    background: #f0f0f0;
  }

  button {
    padding: 12px 24px;
    font-size: 18px;
    cursor: pointer;
    background-color: #4ec0ca;
    color: white;
    border: none;
    border-radius: 5px;
    font-weight: bold;
  }

  button:hover {
    background-color: #3da8b2;
  }

  h2 {
    margin: 10px 0;
  }

  p {
    margin: 5px 0;
    color: #666;
  }

  .logo-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    text-align: center;
  }

  .game-logo {
    font-size: 72px;
    font-weight: 900;
    color: #ffd700;
    text-shadow:
      4px 4px 0px #ff8c00,
      8px 8px 0px rgba(0, 0, 0, 0.3);
    letter-spacing: 4px;
    margin: 0;
    padding: 20px;
    font-family: "Arial Black", "Arial Bold", Gadget, sans-serif;
    -webkit-text-stroke: 2px #8b4513;
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
</style>
