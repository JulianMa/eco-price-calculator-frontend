const fetch = require('node-fetch');

async function fetchServersAsync() {
  const url = `https://raw.githubusercontent.com/PedroFonseca/EcoDumpConfigs/main/ecodump/servers.json`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (e) {
    console.log(`Could not fetch from ${url}`);
  }
  return {};
}

exports.handler = async function () {
  const result = await fetchServersAsync();
  const serverNames = Object.entries(result).map((t) => ({
    key: t[0],
    name: t[1].name,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify(serverNames),
  };
};
