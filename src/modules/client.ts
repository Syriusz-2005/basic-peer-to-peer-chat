import * as Net from 'net';
import math from './math';


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
      
    });
  }

  constructor() {}


}