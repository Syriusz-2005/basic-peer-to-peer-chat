import Cryptor, { SharerLink, SharerLinkContent } from './modules/sharerKeyCryptor';



export const share = (content: SharerLinkContent): SharerLink => {
  const link = Cryptor.encrypt(content.ip, content.port);
  console.log('Generated sharer link: ', link);
  return link;
};

export const getLocalSharerLink = (): SharerLink => {
  return Cryptor.encrypt(process.env.IP as string, Number( process.env.PORT ) );
}