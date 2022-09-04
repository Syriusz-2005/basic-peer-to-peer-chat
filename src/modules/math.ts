import { randomBytes } from "crypto";


export default class math {
  public static randomInt( min: number, max: number): number {
    return Math.floor( Math.random() * (max - min) + min );
  }

  public static randomString( length: number ): string {
    const bytes = randomBytes(length);

    return bytes.toString('utf-8');
  }

  public static randomUuid(): string {
    return this.randomString(30);
  }
}