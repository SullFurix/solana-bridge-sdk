// 44 - bridge config
import { publicKey } from './common/utils/layout';
import * as BufferLayout from 'buffer-layout';

export const BridgeLayout = BufferLayout.struct([
  BufferLayout.u32('guardianSetIndex'),
  BufferLayout.u8('guardianSetExpirationTime'),
  publicKey('tokenProgram'),
  BufferLayout.u8('isInitialized'),
]);
