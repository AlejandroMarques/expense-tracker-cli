import Os from "./os.interface.js";
import * as os from "os";

export default class OsVanillaAdapter implements Os {
  homedir(): string {
    return os.homedir();
  }
  platform(): string {
    return os.platform();
  }

}