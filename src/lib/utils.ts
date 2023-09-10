import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function findAllByKey(obj: any, searchKey: string) {
  let results: any[] = [];

  if (obj.player) {
    results.push(obj.player);
  }

  Object.keys(obj).forEach((key) => {
    if (key === searchKey) {
      results.push(obj[key]);
    } else if (typeof obj[key] === "object" && key !== "player") {
      results = results.concat(findAllByKey(obj[key], searchKey));
    }
  });
  return results;
}
