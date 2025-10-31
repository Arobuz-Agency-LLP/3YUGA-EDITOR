import { Helper as HelperBase, HelperProps } from "@designcombo/timeline";

class Transition extends HelperBase {
  static type = "Transition";
  transitionKind?: string;
  direction?: string;

  constructor(props: HelperProps) {
    super(props);
    this.transitionKind = (props as any).kind;
    this.direction = (props as any).direction;
  }

  public _render(ctx: CanvasRenderingContext2D) {
    super._render(ctx);
    
    // Draw transition indicator
    ctx.save();
    ctx.fillStyle = "#6366f1";
    ctx.globalAlpha = 0.6;
    
    // Draw a small triangle or arrow to indicate transition
    const size = 8;
    ctx.fillRect(this.width / 2 - size / 2, -size, size, size);
    
    ctx.restore();
  }
}

export default Transition;
