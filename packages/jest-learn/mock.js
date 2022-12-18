import { getName } from "./service";
export function searchName(name) {
  const names = getName();
  console.log(names)
  return names.filter((val) => val === name);
}
