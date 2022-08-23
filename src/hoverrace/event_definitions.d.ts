export interface GameConfig {
    /**
     * The speed at which the throttle reacts to user input. default = 1
     */
  throttle_speed?: number,
    /**
     * The speed at which hovercrafts turn. default = 220
     */
  turn_speed?: number,
    /**
     * The maximum acceleration of hovercrafts. default = 5
     */
  max_acceleration?: number,
    /**
     * The maximum velocity of hovercrafts. default = 20
     */
  max_velocity?: number,
    /**
     * The amount of checkpoints per game. default = 10
     */
  checkpoint_count?: number,
}

/**
 * Send the `ready` command to the server when you think the game should begin.
 */
export interface ReadyCmd {
  name: "ready",
  data?: undefined,
}

/**
 * The `throttle` command allows you to change your throttle level and direction.
 * **NOTE:** These values are targets. The hovercraft needs some time to reach the desired values.
 */
export interface ThrottleCmd {
  name: "throttle",
  data: {
    /**
     * Throttle level between -1 - 1.
     */
    level: number,
    /**
     * The angle in degrees the hovercraft should be facing (up = 0°).
     */
    angle: number,
  },
}

/**
 * The `start` event is sent when the race begins.
 * The game begins once at least 2 players have joined and all players have sent the `ready` event.
 */
export interface StartEvent {
  name: "start",
  data?: undefined,
}

/**
 * The `in_progress` event is sent to sockets which connect to the game while it's running.
 */
export interface InProgressEvent {
  name: "in_progress",
  data?: undefined,
}

/**
 * The `countdown` counts down from 5. When the value reaches 0 a `start` event will be sent instead of the `countdown` event.
 */
export interface CountdownEvent {
  name: "countdown",
  data: {
    /**
     * The current value of the countdown (5-1).
     */
    value: number,
  },
}

/**
 * The `checkpoints` event contains all of the remaining checkpoints.
 */
export interface CheckpointsEvent {
  name: "checkpoints",
  data: {
    /**
     * The positions of all the remaining checkpoints.
     */
    checkpoints: Vec[],
    /**
     * The position of the finish line.
     */
    finish_line: Vec,
  },
}

/**
 * The `ready_players` event contains a list of all players which are ready.
 */
export interface ReadyPlayersEvent {
  name: "ready_players",
  data: {
    /**
     * A list of all ready players.
     */
    players: string[],
    /**
     * True if all players in the game are ready.
     */
    everyone: boolean,
  },
}

/**
 * The `hovercraft` event tells all clients where all the hovercrafts are and how they are moving.
 */
export interface HovercraftsEvent {
  name: "hovercrafts",
  data: {
    /**
     * All hovercrafts mapped to their respective player IDs.
     */
    hovercrafts: { [index: string]: Hovercraft },
    /**
     * The time in UNIX milliseconds when this event occured.
     */
    time: number,
  },
}

/**
 * The `finished_players` event contains a list of players that have finished the race.
 */
export interface FinishedPlayersEvent {
  name: "finished_players",
  data: {
    /**
     * A list of players that have finished the race sorted by their placement.
     */
    players: FinishedPlayer[],
  },
}

/**
 * A hovercraft is a circle with a diameter of 1 unit.
 */
export interface Hovercraft {
    /**
     * The position of the center of the hovercraft.
     */
  pos: Vec,
    /**
     * The current velocity of the hovercraft.
     */
  velocity: Vec,
    /**
     * The current throttle of the hovercraft.
     */
  throttle: number,
    /**
     * The angle in degrees the hovercraft is facing (up = 0°).
     */
  angle: number,
    /**
     * The amount of reached checkpoints.
     */
  checkpoints: number,
}

/**
 * `finished_player` represents an entry in the final ranking.
 */
export interface FinishedPlayer {
    /**
     * The ID of the player.
     */
  id: string,
    /**
     * The place, the player has reached.
     */
  place: number,
    /**
     * The amount of time in milliseconds the player needed to finish the race.
     */
  duration: number,
}

/**
 * One unit equals the width of the hovercrafts and checkpoints.
 */
export interface Vec {
    /**
     * left to right
     */
  x: number,
    /**
     * bottom to top
     */
  y: number,
}

export type Commands = ReadyCmd | ThrottleCmd;
export type Events = StartEvent | InProgressEvent | CountdownEvent | CheckpointsEvent | ReadyPlayersEvent | HovercraftsEvent | FinishedPlayersEvent;
