import { randomBytes } from "crypto";


export default class math {
  public static randomInt( min: number, max: number): number {
    return Math.floor( Math.random() * (max - min) + min );
  }

  public static randomBytes( length: number ) {
    const bytes = randomBytes(length);

    return bytes;
  }

  public static randomUuid(): string {
    return this.randomBytes(30).toString();
  }
}