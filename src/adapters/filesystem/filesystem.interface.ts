export default interface FileSystem {
  /**
   * Función para leer datos en un archivo de manera síncrona.
   * @param path La ruta del archivo donde se escribirá.
   * @returns Texto del archivo
   */
  read(path: string): string;

  /**
   * Función para escribir datos en un archivo de manera síncrona.
   * @param path La ruta del archivo donde se escribirá.
   * @param data Los datos que se escribirán en el archivo.
   */
  write(path: string, data: string): void;
}
