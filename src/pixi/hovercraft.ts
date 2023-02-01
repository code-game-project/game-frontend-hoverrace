import { Container, Sprite, Text } from 'pixi.js';

export class Hovercraft {
  private container: Container;
  private title: Text;
  private sprite: Sprite;

  public constructor(username = 'unknown') {
    this.container = new Container();
    this.container.zIndex = 2;
    // Title
    this.title = new Text(username, { fill: '#f5f5f5', fontSize: 80 });
    this.title.anchor.set(0.5);
    this.title.y = -200;
    this.container.addChild(this.title);
    // Sprite
    this.sprite = Sprite.from('/images/hovercraft.png');
    this.sprite.anchor.set(0.5);
    this.container.addChild(this.sprite);
  }

  public getContainer() {
    return this.container;
  }

  public getSprite() {
    return this.sprite;
  }

  public update(x: number, y: number, angle: number, sideLength: number) {
    this.container.x = x * sideLength;
    this.container.y = -1 * y * sideLength;
    this.sprite.angle = -angle+90;
  }
}
