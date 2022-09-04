import { Message } from "../types/message";
import * as Crypto from 'crypto';
import math from "./math";
import { SharerLink } from "./sharerKeyCryptor";

export type EncryptedMessage = `${string}.${string}`;

export default class MessageCryptor {
  private static readonly ALGHORITM = 'aes-256-ctr';
  private static readonly ENCODING = process.env.ENCODING as BufferEncoding;

  public static encrypt( message: Message, cryptoKey: string, targetLink: SharerLink ): EncryptedMessage {
    const iv = math.randomBytes(16);
    const key = cryptoKey + targetLink;

    const crypter = Crypto.createCipheriv(this.ALGHORITM, key, iv);

    const data = crypter.update(JSON.stringify(message)).toString(this.ENCODING);
    return `${iv}.${data}`;
  }

  public static decrypt( message: EncryptedMessage, cryptoKey: string, selfLink: SharerLink ): Message {
    const [ iv, data ] = message.split('.');
  
    const key = cryptoKey + selfLink;

    const decrypter = Crypto.createDecipheriv(this.ALGHORITM, key, iv);
    
    return JSON.parse( 
      Buffer.concat([
        decrypter
          .update(Buffer.from(data, this.ENCODING)),
        decrypter.final()
      ])
      .toString()
    );
  }
}