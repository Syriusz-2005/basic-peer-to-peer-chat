import * as Crypto from 'crypto';

export type SharerLink = `${string}.${string}`;
export type SharerLinkContent = {
  ip: string;
  port: number;
}

export default class Cryptor {
  private static readonly ALGHORITM = 'aes-256-ctr';
  private static readonly KEY = process.env.SHARER_CRYPTO_KEY as string;


  public static randomBytes( length: number ) {
    const bytes = Crypto.randomBytes(length);

    return bytes;
  }

  public static encrypt(ip: string, port: number): SharerLink {
    const iv = Crypto.randomBytes(16);

    const crypter = Crypto.createCipheriv(this.ALGHORITM, this.KEY, iv);

    const encryptedData = crypter.update(JSON.stringify({
        ip,
        port,
      }))
      .toString('hex')
  
    return `${iv.toString('hex')}.${encryptedData}`;
  }


  public static decrypt( link: SharerLink ): SharerLinkContent {
    const [ iv, data ] = link.split('.');

    console.log(iv, data);
    const decrypter = Crypto.createDecipheriv(this.ALGHORITM, this.KEY, Buffer.from(iv, 'hex'));

    return JSON.parse( 
      Buffer.concat([
        decrypter
          .update(Buffer.from(data, 'hex'))
      ])
      .toString()
    );
  }
}