const fetch = require('node-fetch');

async function fetchServerUrlAsync(serverName) {
  const url = `https://raw.githubusercontent.com/PedroFonseca/EcoDumpConfigs/main/ecodump/servers.json`;
  try {
    const response = await fetch(url);
    const jsonResponse = await response.json();
    return jsonResponse[serverName]?.url;
  } catch (e) {
    console.log(`Functions - Could not fetch from servers.json`);
  }
  return {};
}

async function fetchFileAsync(serverUrl, fileName) {
  const url = serverUrl.replace('<filename>', fileName);
  try {
    const response = await fetch(url);
    return response.json();
  } catch (e) {
    console.log(`Functions - Could not fetch file ${fileName}`);
  }
  return {};
}

exports.handler = async function (event) {
  const serverToRead = event.queryStringParameters.server;
  const fileToRead = event.queryStringParameters.file;
  const serverUrl = await fetchServerUrlAsync(serverToRead);
  const result = await fetchFileAsync(serverUrl, fileToRead);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
