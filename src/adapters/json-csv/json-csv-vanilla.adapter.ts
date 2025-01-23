import JsonCsv from "./json-csv.interface";

export default class JsonToCsvVanilla implements JsonCsv {
  convertJsonToCsv(json: any[]): string {
    if (json.length === 0) {
      return "";
    }

    const headers:string = Object.keys(json[0]).join(",");
    const rows = json
      .map((obj) =>
        Object.values(obj)
          .map((val) => `"${val}"`)
          .join(",")
      )
      .join("\n");

    return `${headers}\n${rows}`;
  }
  
  convertCsvToJson<T>(csv: string): T[] {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");

    const jsonArray: T[] = lines.slice(1).map((line) => {
      const values = line.split(",");
      const jsonObj: any = {};

      headers.forEach((header, index) => {
        jsonObj[header.trim()] = values[index].trim();
      });

      return jsonObj;
    });

    return jsonArray;
  }
}
