import { Message } from "../types/message";
import * as Crypto from 'crypto';
import math from "./math";

export type EncryptedMessage = `${string}.${string}`;

export default class MessageCryptor {
  private static readonly ALGHORITM = 'aes-256-ctr';
  private static readonly ENCODING = process.env.ENCODING as BufferEncoding;

  public static encrypt( message: Message, cryptoKey: string ): EncryptedMessage {
    const iv = Crypto.randomBytes(16);
    const key = cryptoKey;

    const crypter = Crypto.createCipheriv(this.ALGHORITM, key, iv);

    const data = crypter.update(JSON.stringify(message)).toString(this.ENCODING);
    return `${iv.toString(this.ENCODING)}.${data}`;
  }

  public static decrypt( message: EncryptedMessage, cryptoKey: string ): Message {
    const [ iv, data ] = message.split('.');
  
    const key = cryptoKey;

    console.log(iv, data);
    const decrypter = Crypto.createDecipheriv(this.ALGHORITM, key, Buffer.from(iv, this.ENCODING));
    
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