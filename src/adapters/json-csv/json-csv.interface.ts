export default interface JsonCsv {
  /**
   * Función para convertir un JSON en CSV.
   * @param data Los datos a convertir.
   * @returns Datos convertidos a CSV
   */
  convertJsonToCsv(data: any): string;

  /**
   * Función para convertir un CSV en JSON.
   * @param data Los datos a convertir.
   * @returns Datos convertidos a JSON
   */
  convertCsvToJson<T>(data: string): T[];
}
