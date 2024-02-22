export function findCommand(obj: Record<string, any>, key: string, value: any): any | false {
  let result: any | false = false;

  const recursiveSearch = (obj: Record<string, any>) => {
    if (!obj || typeof obj !== "object") {
      return;
    }
    if (obj[key] && (obj[key] === value || (Array.isArray(obj[key]) && obj[key].includes(value)))) {
      result = obj;
    }
    for (const prop in obj) {
      if (typeof obj[prop] === 'object') {
        recursiveSearch(obj[prop]);
      }
    }
  };

  recursiveSearch(obj);
  return result;
}