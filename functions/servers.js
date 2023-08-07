const fetch = require('node-fetch');

async function fetchServersAsync() {
  const url = `https://raw.githubusercontent.com/PedroFonseca/EcoDumpConfigs/main/ecodump/servers.json`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (e) {
    console.log(`Functions - Could not fetch servers.json`);
  }
  return {};
}

async function checkIsServerOnlineAsync(serverUrl) {
  const url = serverUrl.replace('<filename>', 'Tags');
  try {
    const response = await fetch(url, { timeout: 500 });
    return (await response.json())?.Version !== undefined;
  } catch (e) {
    console.log(`Functions - Could not check server online: ${url}`);
  }
  return false;
}

async function getServerOnlineAsync(key, name, url) {
  return {
    key,
    name,
    isOnline: await checkIsServerOnlineAsync(url),
  };
}

exports.handler = async function () {
  const result = await fetchServersAsync();
  const onlineServerNames = await Promise.all(
    Object.entries(result).map((t) =>
      getServerOnlineAsync(t[0], t[1].name, t[1].url)
    )
  );

  return {
    statusCode: 200,
    body: JSON.stringify(onlineServerNames),
  };
};
