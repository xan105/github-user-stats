import { getUserStats } from "../lib/index.js"

console.time("request");
const stats = await getUserStats("xan105");
console.timeEnd("request");

console.log(stats);