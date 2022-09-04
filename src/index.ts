import env from 'dotenv';
env.config();

import Client from './modules/client';
import Cryptor, { SharerLink } from './modules/sharerKeyCryptor';
import { getLocalSharerLink } from './share';
export { Client };


export const client = new Client(Number(process.env.PORT), process.env.IP as string);

process.stdin.on('data', (data) => {
  const text = data.toString().trim();

  const [cmd, ...args] = text.split(' ');

  switch (cmd) {
    case 'connect':
      const link = args[0] as SharerLink;
      console.log('Connecting to the specified link...');
      const { ip, port } = Cryptor.decrypt(link);
      console.log('Remote peer: ', `${ip}:${port}`);
      client.connect(ip, Number(port));
    break;

    case 'link':
      const localLink = getLocalSharerLink();
      console.log('Generated sharing link: ', localLink);
    break;

    case 'say':
      const msg = args.join(' ');
      client.send(msg);
    break;

    case 'help':
      switch (args[0]) {
        case '-msg':
          console.log('type "say <your message>" to securely send a message to the peer you are connected to');
        break;

        default:
          console.log('type "connect <sharing link>" to connect to the other host');
          console.log('type "link" to retrieve your own new sharing link');
          console.log('type "help -msg" to get the list of commands connected to the communication');
        break;
      }
    break;

    default:
      console.log('Unknown command... type "help" to get the list of available commands');
    break;
  }
});