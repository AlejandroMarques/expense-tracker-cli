import Path from './path.interface.js';
import * as path from 'path';

export default class PathVanillaAdapter implements Path {
  resolve(...pathSegments: string[]): string {
    return path.resolve(...pathSegments);
  }
  join(...pathSegments: string[]): string {
    return path.join(...pathSegments);
  }
}