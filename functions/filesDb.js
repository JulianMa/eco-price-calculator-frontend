const fetch = require('node-fetch');

async function fetchFileAsync(fileName) {
  const url = `https://getpantry.cloud/apiv1/pantry/${process.env.VITE_SECRET}/basket/${fileName}`;
  try {
    const response = await fetch(url);
    return response.json();
  } catch (e) {
    console.log(`Could not fetch from ${url}`);
  }
  return {};
}

exports.handler = async function (event) {
  const fileToRead = event.queryStringParameters.file;
  const result = await fetchFileAsync(fileToRead);

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
};
