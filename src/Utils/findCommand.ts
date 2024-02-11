export default function findCommand(obj: { [key: string]: any }, key: string, value: any): any | false {
  let result: any | false;
  
  const recursiveSearch = (obj: { [key: string]: any }) => {
    if (!obj || typeof obj !== "object") {
      return;
    }
    if (obj[key]?.includes(value)) {
      result = obj;
    }
    Object.keys(obj).forEach((k) => {
      recursiveSearch(obj[k]);
    });
  };

  recursiveSearch(obj);
  if (result) {
    return result;
  }
  
  const searchByName = obj[value];
  return searchByName ? searchByName : false;
}
