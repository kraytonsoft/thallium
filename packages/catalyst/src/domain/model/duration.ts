import { DurationEnum } from './duration-enum.js';

export class Duration {
  private readonly value: number;
  private readonly scale:DurationEnum;

  protected constructor(value: number, scale:DurationEnum) {
    this.value = value;
    this.scale = scale;
  }

  public static create(value: number, scale: DurationEnum): Duration {
    return new Duration(value, scale);
  }

  public get toSeconds(): number {
    const multipliers: Record<DurationEnum, number> = {
      [DurationEnum.seconds]: 1,
      [DurationEnum.minutes]: 60,
      [DurationEnum.hours]: 60 * 60,
      [DurationEnum.days]: 60 * 60 * 24,
    };

    return this.value * multipliers[this.scale];
  }
}
