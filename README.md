Get GitHub user stats such as total stars, forks, repos (public) using standard fetch().

This is an isomorphic ECMAScript module (ESM) you can use it in Node or in the Browser.<br />
GitHub API ratelimit is taken into account.

Example
=======

```js
import { getUserStats } from "@xan105/github-user-stats"

console.time("request");
const stats = await getStats("xan105");
console.timeEnd("request");
console.log(stats);
/*
  request: 1.432s
  {
    repos: 41,
    gists: 0,
    followers: 45,
    following: 4,
    stars: 559,
    forks: 73
  }
*/
```

Again but with a high number of repos

```js
import { getUserStats } from "@xan105/github-user-stats"

console.time("request");
const stats = await getStats("microsoft");
console.timeEnd("request");
console.log(stats);
/*
  request: 3.961s
  {
    repos: 5522,
    gists: 0,
    followers: 33898,
    following: 0,
    stars: 2204633,
    forks: 501477
  }
*/
```

Install
=======

```
npm install @xan105/github-user-stats
```

API
===

⚠️ This module is only available as an ECMAScript module (ESM).

## Named export

### `getUserStats(username: string): Promise<object>`

Fetch a given github user stats.

**Return**

```ts
{
  repos: number, //public repos
  gists: number, 
  followers: number,
  following: number,
  stars: number,
  forks: number
}
```

❌ Throws on error.

Related
=======

Inspired by:

- [yyx990803/starz](https://github.com/yyx990803/starz)
- [idealclover/GitHub-Star-Counter](https://github.com/idealclover/GitHub-Star-Counter)