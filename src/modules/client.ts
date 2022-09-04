import * as Net from 'net';
import math from './math';
import MessageCryptor, { EncryptedMessage } from './messageCryptor';

export default class Client {
  private sockets = new Map<string, Net.Socket>();
  private server = Net.createServer( socket => this.handleNewSocket( socket ) )


  private handleNewSocket( socket: Net.Socket ) {
    const id = math.randomUuid();

    this.sockets.set( id, socket);

    console.log('New connection established!');

    socket.on('close', () => {
      this.sockets.delete( id );
    });

    
    socket.on('data', ( data ) => {
      const cipher = data.toString() as EncryptedMessage;

      const message = MessageCryptor.decrypt(cipher, process.env.SHARER_CRYPTO_KEY as string );
      console.log(message);

      if (message.header === 'message') {
        console.log('incoming msg:', message.content);
      }
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

  public send( msg: string ) {
    const cipher = MessageCryptor.encrypt({
      header: 'message',
      content: msg,
    }, process.env.SHARER_CRYPTO_KEY as string)

    this.sockets.forEach( socket => {
      socket.write(cipher);
    });
  }

  public connect( ip: string, port: number ): void {
    const socket = new Net.Socket();

    socket.connect(port, ip, () => {
      console.log('Connected succesfully!');
      console.log('Type help -msg for more commands');
      this.handleNewSocket(socket);
    });

    socket.on('error', (err) => {
      console.log('Connection failed, reason: ', err);
    });
  }
}