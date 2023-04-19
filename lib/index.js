/*
Copyright (c) Anthony Beaumont
This source code is licensed under the MIT License
found in the LICENSE file in the root directory of this source tree.
*/

function relativeTime(timestamp, locales = "en"){
  const rtf = new Intl.RelativeTimeFormat(locales, { numeric: "auto" });
  const elapsed = timestamp - Math.floor(Date.now() / 1000);
  return rtf.format(Math.round(elapsed / 60), "minute");
}

async function queryGithub(path, decode = true){

  const API = "https://api.github.com";
  
  const response = await fetch(API + path, {
    headers: {
      "X-GitHub-Api-Version": "2022-11-28"
    },
    priority: "low"
  })
  
  if(response.status >= 400){
    const { message } = await response.json();
    const error = new Error(message);
    error.code = response.status;
    error.info = {
      limit: +response.headers.get("x-ratelimit-limit"),
      used: +response.headers.get("x-ratelimit-used"),
      remaining: +response.headers.get("x-ratelimit-remaining"),
      reset: relativeTime(+response.headers.get("x-ratelimit-reset")) // eg: "in 30 minutes"
    };
    throw error;
  }
  
  if(decode){
    const data = await response.json();
    return data;
  } else {
    return response;
  }
}

async function getUserStats(username){

  if (!(typeof username === "string" && username.length > 0))
    throw new Error("Expected non-empty string !");

  const response = await queryGithub("/users/" + username, false);
  const remaining = +response.headers.get("x-ratelimit-remaining");
  const user = await response.json();
  
  const per_page = 100; //API pagination
  const pages = Math.ceil(user.public_repos / per_page); //calculate how many requests we would need to fetch all stars and forks
  if (pages > remaining){
    const error = new Error(`"${username}" has too many repos! You will exceed the maximum number of requests you are permitted to make per hour`);
    error.code = "ERR_RATELIMIT_SAFEGUARD";
    error.info = {
      repos: user.public_repos,
      needed: pages,
      remaining
    };
    throw error;
  }

  const promises = [...Array(pages).keys()] //[0, 1, 2, ..., N]
                   .map(page => queryGithub(`/users/${username}/repos?per_page=${per_page}&page=${page}`) );
                   
  const repos = await Promise.all(promises); //GitHub can handle it (concurrency)
  const total = repos.flat().reduce(
    (acc, cur) => {
      acc.stars += cur.stargazers_count
      acc.forks += cur.forks
      return acc
    },
    { stars: 0, forks: 0 }
  );
  
  return {
    repos: user.public_repos,
    gists: user.public_gists,
    followers: user.followers,
    following: user.following,
    ...total
  }
}

export { getUserStats }