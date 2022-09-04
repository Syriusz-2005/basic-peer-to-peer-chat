import * as Crypto from 'crypto';

export type SharerLink = `${string}.${string}`;
export type SharerLinkContent = {
  ip: string;
  port: number;
}

export default class Cryptor {
  private static readonly ALGHORITM = 'aes-256-ocb';
  private static readonly KEY = process.env.SHARER_CRYPTO_KEY as string;


  private static randomString( length: number ) {
    const bytes = Crypto.randomBytes(length);

    return bytes.toString('hex');
  }

  public static encrypt(ip: string, port: number): SharerLink {
    const iv = this.randomString(20);

    const crypter = Crypto.createCipheriv(this.ALGHORITM, this.KEY, iv);

    const encryptedData = crypter.update(JSON.stringify({
        ip,
        port,
      }))
      .toString('hex')

    return `${iv}.${encryptedData}`;
  }


  public static decrypt( link: SharerLink ): SharerLinkContent {
    const [ iv, data ] = link.split('.');

    const decrypter = Crypto.createDecipheriv(this.ALGHORITM, this.KEY, Buffer.from(iv, 'hex'));
    
    return JSON.parse( 
      Buffer.concat([
        decrypter
          .update(Buffer.from(data, 'hex')),
        decrypter.final()
      ])
      .toString()
    );
  }
}