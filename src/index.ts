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
      console.log('Remote client: ', `${ip}:${port}`);
      client.connect(ip, Number(port));
    break;

    case 'link':
      const localLink = getLocalSharerLink();
      console.log('Generated sharing link: ', localLink);
    break;
  }
});