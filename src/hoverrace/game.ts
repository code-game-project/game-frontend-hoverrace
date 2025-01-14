/*
 * This code was generated by codegame-cli-js.
 *
 * CHANGES TO THIS FILE MAY CAUSE INCORRECT BEHAVIOR AND WILL BE LOST IF
 * THE CODE IS REGENERATED.
 */

import { GameSocket, Verbosity } from '@code-game-project/client';
import type { EventListenerCallback, Session } from '@code-game-project/client';
import type { Events, Commands, ReadyCmd, ControlCmd, StartEvent, InProgressEvent, CountdownEvent, CheckpointsEvent, ReadyPlayersEvent, HovercraftsEvent, FinishedPlayersEvent, RaceOverEvent } from './event_definitions';

export { Verbosity };

/** Wrapper for hoverrace v0.4. */
export class Game {
  private socket: GameSocket<Commands, Events>;
  private spectating: boolean;

  /**
   * Wraps an instance of `GameSocket`.
   * @param socket A fully ready instance of `GameSocket`.
   * @param spectating Whether the socket is connected to a game as a spectator.
   */
  public constructor(socket: GameSocket<Commands, Events>, spectating: boolean) {
    this.socket = socket;
    this.spectating = spectating;
  }

  /**
   * Gets the current session details.
   * @returns the session
   */
  public getSession(): Readonly<Session | undefined> {
    return this.socket.getSession();
  }

  /** Whether the socket is connected to a game as a spectator. */
  public isSpectating(): boolean {
    return this.spectating;
  }

  /**
   * Removes an event listener by ID.
   * @param id The listner's ID.
   */
  public removeListener(id: symbol) {
    return this.socket.removeListener(id);
  }

  /**
   * Gets a username by player ID.
   * @param playerId The player ID.
   * @returns the username or null if the username is unavailable
   */
  public async getUsername(playerId: string): Promise<string | null> {
    return await this.socket.getUsername(playerId);
  }

  /**
   * Sends a `ready` command.
   * @param data Optional options to go along with your command.
   */
  public sendReady(data: ReadyCmd['data']) {
    return this.socket.send<ReadyCmd>('ready', data);
  }

  /**
   * Sends a `control` command.
   * @param data Optional options to go along with your command.
   */
  public sendControl(data: ControlCmd['data']) {
    return this.socket.send<ControlCmd>('control', data);
  }

  /**
   * Registers an event listener for the `start` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onStart(callback: EventListenerCallback<StartEvent>) : symbol {
    return this.socket.on<StartEvent>('start', callback);
  }

  /**
   * Registers an event listener for the `start` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onStartOnce(callback: EventListenerCallback<StartEvent>) : symbol {
    return this.socket.once<StartEvent>('start', callback);
  }

  /**
   * Registers an event listener for the `in_progress` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onInProgress(callback: EventListenerCallback<InProgressEvent>) : symbol {
    return this.socket.on<InProgressEvent>('in_progress', callback);
  }

  /**
   * Registers an event listener for the `in_progress` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onInProgressOnce(callback: EventListenerCallback<InProgressEvent>) : symbol {
    return this.socket.once<InProgressEvent>('in_progress', callback);
  }

  /**
   * Registers an event listener for the `countdown` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onCountdown(callback: EventListenerCallback<CountdownEvent>) : symbol {
    return this.socket.on<CountdownEvent>('countdown', callback);
  }

  /**
   * Registers an event listener for the `countdown` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onCountdownOnce(callback: EventListenerCallback<CountdownEvent>) : symbol {
    return this.socket.once<CountdownEvent>('countdown', callback);
  }

  /**
   * Registers an event listener for the `checkpoints` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onCheckpoints(callback: EventListenerCallback<CheckpointsEvent>) : symbol {
    return this.socket.on<CheckpointsEvent>('checkpoints', callback);
  }

  /**
   * Registers an event listener for the `checkpoints` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onCheckpointsOnce(callback: EventListenerCallback<CheckpointsEvent>) : symbol {
    return this.socket.once<CheckpointsEvent>('checkpoints', callback);
  }

  /**
   * Registers an event listener for the `ready_players` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onReadyPlayers(callback: EventListenerCallback<ReadyPlayersEvent>) : symbol {
    return this.socket.on<ReadyPlayersEvent>('ready_players', callback);
  }

  /**
   * Registers an event listener for the `ready_players` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onReadyPlayersOnce(callback: EventListenerCallback<ReadyPlayersEvent>) : symbol {
    return this.socket.once<ReadyPlayersEvent>('ready_players', callback);
  }

  /**
   * Registers an event listener for the `hovercrafts` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onHovercrafts(callback: EventListenerCallback<HovercraftsEvent>) : symbol {
    return this.socket.on<HovercraftsEvent>('hovercrafts', callback);
  }

  /**
   * Registers an event listener for the `hovercrafts` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onHovercraftsOnce(callback: EventListenerCallback<HovercraftsEvent>) : symbol {
    return this.socket.once<HovercraftsEvent>('hovercrafts', callback);
  }

  /**
   * Registers an event listener for the `finished_players` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onFinishedPlayers(callback: EventListenerCallback<FinishedPlayersEvent>) : symbol {
    return this.socket.on<FinishedPlayersEvent>('finished_players', callback);
  }

  /**
   * Registers an event listener for the `finished_players` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onFinishedPlayersOnce(callback: EventListenerCallback<FinishedPlayersEvent>) : symbol {
    return this.socket.once<FinishedPlayersEvent>('finished_players', callback);
  }

  /**
   * Registers an event listener for the `race_over` event.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onRaceOver(callback: EventListenerCallback<RaceOverEvent>) : symbol {
    return this.socket.on<RaceOverEvent>('race_over', callback);
  }

  /**
   * Registers an event listener for the `race_over` event that will self-destruct after being triggered once.
   * @param callback Function that is executed when the event is received.
   * @returns the listener's ID
   */
  public onRaceOverOnce(callback: EventListenerCallback<RaceOverEvent>) : symbol {
    return this.socket.once<RaceOverEvent>('race_over', callback);
  }

}
