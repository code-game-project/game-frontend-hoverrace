<script lang="ts">
  import { onMount } from "svelte";
  import config from "../config";
  import { Application, Container, Text } from "pixi.js";
  import { createSocket } from "@code-game-project/client/dist/browser";
  import { Game } from "../hoverrace/game";
  import { Camera } from "../pixi/camera";
  import { Hovercraft } from "../pixi/hovercraft";
  import { Checkpoint, Type } from "../pixi/checkpoint";
  import ErrorStack from "../components/error-stack.svelte";
  import Header from "../components/header.svelte";
  import Fullscreen from "../components/fullscreen.svelte";
  import Table from "../components/table.svelte";
  import TableRow from "../components/table-row.svelte";
  import TableEmpty from "../components/table-empty.svelte";
  import TableCell from "../components/table-cell.svelte";
  import Footer from "../components/footer.svelte";
  import type { GameConfig } from "../hoverrace/event_definitions";

  const SPRITE_SIDE_LENGTH = 256;
  const WAITING_MSG = "Waiting for players all players to be ready...";
  const columWidths = "60% 20% 20%";

  let errors: string[] = [];
  let canvasContainer: HTMLElement;
  let canvas: HTMLCanvasElement;
  let isFullscreen: boolean;
  let canvasContainerWidth: number;
  let canvasContainerHeight: number;
  let controlsHeight: number;
  $: controlsHeight && resize()
  let width = 300;
  let height = (width / 16) * 9;
  let pixiApp: Application;
  const map = new Container();
  const checkpointContainer = new Container();
  const hovercraftContainer = new Container();
  let status: Text;
  let camera: Camera;
  let follow: string | null = null;
  let game: Game;
  let hoverraceConfig: GameConfig;
  const players: {
    [index: string]: {
      username: string;
      time: number | null;
      checkpoints: number;
    };
  } = {};

  const resize = () => {
    width = isFullscreen ? window.screen.availWidth : canvasContainerWidth;
    height = isFullscreen ? window.screen.availHeight : canvasContainerHeight-controlsHeight;
    if (pixiApp) pixiApp.renderer.resize(width, height);
    if (camera) camera.focus();
  };

  const unitMeasures = {
    y: 31557600000,
    mo: 2629800000,
    w: 604800000,
    d: 86400000,
    h: 3600000,
    m: 60000,
    s: 1000,
    ms: 1,
  };
  /**
   * Formats milliseconds as `1y 2mo 3w 4d 5h 6m 7s 8ms`.
   * @param millis Milliseconds to be formatted.
   */
  function formatTime(millis: number): string {
    millis = Math.abs(Math.floor(millis));
    const parts: string[] = [];
    for (const [unit, ms] of Object.entries(unitMeasures)) {
      const unitValue = Math.floor(millis / ms);
      if (unitValue !== 0) {
        millis -= unitValue * ms;
        parts.push(unitValue + unit);
      }
    }
    return parts.join(" ");
  }

  let checkpointsCreated = false;
  let checkpoints: { [index: string]: Checkpoint } = {};
  const hovercrafts: { [index: string]: Hovercraft | null } = {};
  const registerListeners = (game: Game) => {
    game.onCheckpoints((data) => {
      if (!checkpointsCreated) {
        checkpointsCreated = true;
        for (const { x, y } of data.checkpoints) {
          const checkpoint = new Checkpoint(
            Type.CHECKPOINT,
            x,
            y,
            SPRITE_SIDE_LENGTH
          );
          checkpoints[checkpoint.id] = checkpoint;
          checkpointContainer.addChild(checkpoint.getSprite());
        }
        const finish = new Checkpoint(
          Type.FINISH,
          data.finish_line.x,
          data.finish_line.y,
          SPRITE_SIDE_LENGTH
        );
        checkpoints[finish.id] = finish;
        checkpointContainer.addChild(finish.getSprite());
      } else {
        const removed = new Set(Object.keys(checkpoints));
        removed.delete("finish");
        for (const checkpoint of data.checkpoints) {
          removed.delete(Checkpoint.getIdByCoords(checkpoint.x, checkpoint.y));
        }
        for (const id of removed) {
          checkpointContainer.removeChild(checkpoints[id].getSprite());
          delete checkpoints[id];
        }
      }
    });
    game.onHovercrafts(async (data) => {
      const removed = new Set(Object.keys(hovercrafts));
      for (const [playerId, hovercraft] of Object.entries(data.hovercrafts)) {
        if (!(playerId in hovercrafts)) {
          hovercrafts[playerId] = null;
          const username = await game.getUsername(playerId);
          const hovercraftSprite = new Hovercraft(username || undefined);
          hovercrafts[playerId] = hovercraftSprite;
          hovercraftContainer.addChild(hovercraftSprite.getContainer());
          players[playerId] = {
            username: username || "unknown",
            time: null,
            checkpoints: hovercraft.checkpoints,
          };
        } else {
          removed.delete(playerId);
        }
        players[playerId].checkpoints = hovercraft.checkpoints;
        players[playerId] = players[playerId];
        hovercrafts[playerId]?.update(
          hovercraft.pos.x,
          hovercraft.pos.y,
          camera.getScale(),
          hovercraft.angle,
          SPRITE_SIDE_LENGTH
        );
      }
      for (const id of removed) {
        const hovercraft = hovercrafts[id];
        if (hovercraft) hovercraftContainer.removeChild(hovercraft.getSprite());
        delete hovercrafts[id];
      }
      const follow = camera.following();
      if (follow && follow in hovercrafts) {
        const hovercraft = hovercrafts[follow];
        if (hovercraft) {
          const { x, y } = hovercraft.getContainer();
          camera.focus(x, y);
        }
      }
    });
    game.onHovercraftsOnce((data) => {
      const me = game.getSession()?.player_id;
      if (me && Object.keys(data.hovercrafts).includes(me)) {
        camera.startFollow(me);
        follow = me;
      }
    });
    game.onInProgress(() => {
      status.text = "";
      status.visible = false;
    });
    game.onReadyPlayers((data) => {
      const me = game.getSession()?.player_id;
      if (data.everyone || (me && data.players.includes(me))) {
        for (const checkpoint of Object.values(checkpoints))
          checkpointContainer.removeChild(checkpoint.getSprite());
        checkpoints = {};
        checkpointsCreated = false;
        status.visible = true;
        status.text = WAITING_MSG;
        for (const id in players) {
          players[id].time = null;
        }
      }
    });
    game.onCountdown(({ value }) => {
      status.text = value.toString();
      status.visible = true;
    });
    game.onStart(() => {
      for (const id of Object.keys(players)) {
        players[id].time = null;
        players[id].checkpoints = 0;
        players[id] = players[id];
      }
      status.text = "Goooo!";
      status.visible = true;
      setTimeout(() => (status.visible = false), 1500);
    });
    game.onInProgress(() => {
      for (const id of Object.keys(players)) {
        players[id].time = null;
        players[id].checkpoints = 0;
        players[id] = players[id];
      }
      status.visible = false;
      setTimeout(() => (status.visible = false), 1500);
    });
    game.onFinishedPlayers((data) => {
      for (const player of data.players) {
        players[player.id].time = player.duration;
        players[player.id] = players[player.id];
      }
    });
  };

  onMount(async () => {
    pixiApp = new Application({
      view: canvas,
      backgroundColor: 0x0f0f0f,
      width,
      height,
      antialias: true,
      autoDensity: true,
    });
    resize();
    new ResizeObserver(resize).observe(canvasContainer)
    pixiApp.stage.addChild(map);
    map.addChild(checkpointContainer);
    map.addChild(hovercraftContainer);
    status = new Text(WAITING_MSG, { fill: "#00ff99", fontSize: 200 });
    status.roundPixels = true;
    status.anchor.set(0.5);
    status.y = -400;
    map.addChild(status);
    camera = new Camera(pixiApp, map);
    camera.setScale(0.1);
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get("game_id");
    const playerId = params.get("player_id");
    const playerSecret = params.get("player_secret");
    if (gameId) {
      const socket = createSocket(config.gameURL);
      game = new Game(socket, true);
      registerListeners(game);
      if (playerId) {
        try {
          await socket.connect(gameId, playerId, playerSecret);
        } catch (error) {
          errors = [...errors, "Unable to connect to game."];
        }
      } else {
        try {
          await socket.spectate(gameId);
        } catch (error) {
          errors = [
            ...errors,
            "Unable to connect to game. You likely have the wrong game ID.",
          ];
        }
      }
      hoverraceConfig = (await socket.fetchGameMetadata()).config;
    } else {
      errors = [...errors, "Missing `game_id=` query parameter in URL."];
    }
  });
</script>

<ErrorStack {errors} />

<Header />

<section id="view" bind:this={canvasContainer} bind:clientWidth={canvasContainerWidth} bind:clientHeight={canvasContainerHeight} on:resize={resize}>
  <Fullscreen bind:isFullscreen on:fullscreenChange={resize} bind:controlsHeight>
    <canvas
      slot="content"
      bind:this={canvas}
      {width}
      {height}
      on:wheel|preventDefault={(ev) => camera.scaleBy(ev.deltaY)}
      on:mousedown={(ev) => {
        camera.startDrag(ev.offsetX, ev.offsetY);
        follow = null;
      }}
      on:mousemove={(ev) => camera.drag(ev.offsetX, ev.offsetY)}
      on:mouseup={() => camera.stopDrag()}
    />
  </Fullscreen>
</section>

<main>
  <section id="tableContainer">
    <Table minWidthPx={300}>
      <div slot="head">
        <TableRow {columWidths}>
          <TableCell>Username</TableCell>
          <TableCell>Checkpoints</TableCell>
          <TableCell>Time</TableCell>
        </TableRow>
      </div>
      <div slot="body">
        {#if Object.keys(players).length > 0}
          {#each Object.entries(players)
            .map(([id, { username, time, checkpoints }]) => {
              return { id, username, time, checkpoints };
            })
            .sort((a, b) => {
              if (a.time !== null && b.time === null) return -1;
              if (a.time === null && b.time !== null) return 1;
              if (a.time === null && b.time === null) return b.checkpoints - a.checkpoints;
              return a.time - b.time;
            }) as { id, username, time, checkpoints }}
            <TableRow
              {columWidths}
              pointer={true}
              on:click={() => {
                camera.startFollow(id);
                follow = id;
              }}
            >
              <TableCell>
                <span class="username">{username}</span>
                {#if follow === id}
                  <img
                    src="/icons/location.svg"
                    alt="tracking"
                    title="tracking"
                  />
                {/if}
              </TableCell>
              <TableCell>
                <span class="checkpointCount"
                  >{checkpoints +
                    "/" +
                    (hoverraceConfig
                      ? hoverraceConfig.checkpoint_count ?? 10
                      : 10)}</span
                >
              </TableCell>
              <TableCell>{time === null ? "--" : formatTime(time)}</TableCell>
            </TableRow>
          {/each}
        {:else}
          <TableEmpty>No players detected.</TableEmpty>
        {/if}
      </div>
    </Table>
  </section>
</main>

<Footer />

<style lang="scss" scoped>
  section#view {
    border: 1px solid var(--background-light);
    border-radius: var(--radius);
    overflow: hidden;
    resize: both;
    margin-left: auto;
    margin-right: auto;
    width: min(100%, 1000px);
    max-width: 100%;
    min-width: 500px;
    min-height: 300px;
    aspect-ratio: 16/9;
  }

  canvas {
    width: 100%;
    background-color: #0f0f0f;
    margin-left: auto;
    margin-right: auto;
  }

  span.username {
    padding-right: var(--padding);
  }
</style>
