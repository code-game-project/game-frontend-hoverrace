import type { Application, Container } from "pixi.js";

export class Camera {
  private x = 0;
  private y = 0;
  private scale = 1;
  private app: Application;
  private map: Container;

  private follow: string | null = null;

  private dragging = false;
  private lastX = 0;
  private lastY = 0;

  public constructor(app: Application, map: Container) {
    this.app = app;
    this.map = map;
  }

  public focus(x = this.x, y = this.y) {
    this.map.x = this.app.screen.width * (1 / this.scale) / 2 - x;
    this.map.y = this.app.screen.height * (1 / this.scale) / 2 - y;
    this.x = x;
    this.y = y;
  }

  public moveBy(dx: number, dy: number) {
    this.focus(this.x - dx * (1 / this.scale), this.y - dy * (1 / this.scale));
  }

  public setScale(scale: number) {
    this.scale = scale;
    this.app.stage.scale.set(this.scale);
    this.focus();
  }

  public scaleBy(dy: number) {
    this.setScale(Math.min(Math.max(0.01, this.scale + dy * -0.001), 4));
  }

  public startFollow(playerId: string) {
    this.setScale(0.2);
    this.follow = playerId;
  }

  public stopFollow() {
    this.follow = null;
  }

  public following() {
    return this.follow;
  }

  public startDrag(x: number, y: number) {
    this.stopFollow();
    this.lastX = x;
    this.lastY = y;
    this.dragging = true;
  }

  public drag(dx: number, dy: number) {
    if (this.dragging) this.moveBy(dx - this.lastX, dy - this.lastY);
    this.lastX = dx;
    this.lastY = dy;
  }

  public stopDrag() {
    this.dragging = false;
  }
}
