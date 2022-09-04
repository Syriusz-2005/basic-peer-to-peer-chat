import env from 'dotenv';
import Client from './modules/client';
export { Client };

import Cryptor, { SharerLink, SharerLinkContent } from './modules/sharerKeyCryptor';
env.config();

export const connect = ( link: SharerLink ) => {
  const { ip, port } = Cryptor.decrypt(link);
  console.log(`Connecting to: ${ip}:${port} ...`);
}


export const share = ( content: SharerLinkContent ): SharerLink => {
  const link = Cryptor.encrypt(content.ip, content.port);
  console.log('Generated sharer link: ', link);
  return link;
}

