import * as fs from "fs";
import FileSystem from "./filesystem.interface";

export default class FileSystemVanilla implements FileSystem {
  read(path: string) {
    try {
      if (!fs.existsSync(path)) {
        throw new Error(`Path "${path}" doesn't exist`);
      }
      return fs.readFileSync(path, "utf-8");
    } catch (error) {
      console.error("Error reading file:", error);
      throw error;
    }
  }

  write(path: string, data: string): void {
    try {
      fs.writeFileSync(path, data, { encoding: "utf-8" });
    } catch (error) {
      console.error(`Error escribiendo el archivo en ${path}: `, error);
      throw error;
    }
  }
}
