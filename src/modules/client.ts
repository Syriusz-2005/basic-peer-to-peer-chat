import * as Net from 'net';
import { getLocalSharerLink } from '../share';
import math from './math';
import MessageCryptor, { EncryptedMessage } from './messageCryptor';

export default class Client {
  private sockets = new Map<string, Net.Socket>();
  private server = Net.createServer( socket => this.handleNewSocket( socket ) )


  private handleNewSocket( socket: Net.Socket ) {
    const id = math.randomUuid();

    this.sockets.set( id, socket );

    socket.on('close', () => {
      this.sockets.delete( id );
    });

    socket.on('data', ( data ) => {
      const cipher = data.toString(process.env.ENCODING as BufferEncoding) as EncryptedMessage;

      console.log('[app]', cipher);

      const message = MessageCryptor.decrypt(cipher, process.env.SHARER_CRYPTO_KEY as string, getLocalSharerLink() );
      console.log(message);
    });
  }

  constructor(
    port: number,
    adress: string,
  ) {
    this.server.listen(port, adress, () => {
      console.log('Listening...', `${adress}:${port}`);
    });
  }


  public connect( ip: string, port: number ): void {
    const socket = new Net.Socket();

    socket.connect(port, ip, () => {
      this.handleNewSocket(socket);
    });
    socket.on('error', (err) => {
      console.log('Connection failed, reason: ', err);
    });
  }
}