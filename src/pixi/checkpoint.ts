import { Sprite } from "pixi.js";

export enum Type {
  CHECKPOINT = 'checkpoint',
  FINISH = 'finish',
}

export class Checkpoint {
  public readonly id: string;
  private sprite: Sprite;

  public constructor(type: Type, x: number, y: number, sideLength: number) {
    this.id = type === Type.CHECKPOINT ? Checkpoint.getIdByCoords(x, y) : 'finish';
    this.sprite = Sprite.from(type === Type.CHECKPOINT ? 'images/checkpoint.png' : 'images/finish.png');
    this.sprite.anchor.set(0.5);
    this.sprite.zIndex = 1;
    this.sprite.x = x * sideLength;
    this.sprite.y = -1 * y * sideLength;
  }

  public static getIdByCoords(x: number, y: number) {
    return `x${x}y${y}`;
  }

  public getSprite() {
    return this.sprite;
  }
}
