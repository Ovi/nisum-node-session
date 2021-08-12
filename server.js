const http = require('http');
const fs = require('fs/promises');

const auth = {
  username: 'ovi',
  password: '123',
  base64: 'Bearer b3ZpOjEyMw==',
};

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    if (req.url === '/') {
      return sendResponse(res, 'Hello World');
    }

    if (['/animals', '/vehicles'].includes(req.url)) {
      const jsonData = await fs.readFile(`.${req.url}.json`, 'utf8');
      return sendResponse(res, jsonData);
    }

    if (req.url === '/user') {
      return sendResponse(res, JSON.stringify(auth));
    }

    return sendResponse(res, `${req.url} not found`, 404);
  }

  if (req.method === 'POST') {
    const user = getUser(req);

    if (!user) {
      return sendResponse(res, 'invalid credentials', 401);
    }

    if (['/animals', '/vehicles'].includes(req.url)) {
      const body = JSON.parse(await getBody(req));

      if (!body.name) {
        return sendResponse(res, 'invalid data', 400);
      }

      const dataStr = await fs.readFile(`.${req.url}.json`, 'utf8');
      const data = JSON.parse(dataStr);

      const newObj = {
        id: data.length + 1,
        name: body.name,
      };

      const result = [...data, newObj];

      await fs.writeFile(`.${req.url}.json`, JSON.stringify(result));

      return sendResponse(res, JSON.stringify(result));
    }

    return sendResponse(res, `${req.url} not found`, 404);
  }

  return sendResponse(res, 'Method Not Allowed', 405);
});

const port = 3001;

server.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

function sendResponse(res, message, statusCode = 200) {
  res.writeHead(statusCode, { 'Content-Type': 'text/plain' });
  res.end(message);
}

function getUser(req) {
  const { authorization } = req.headers;
  if (!authorization) return null;

  const [, encryptUser] = authorization.split(' ');
  const decryptUser = Buffer.from(encryptUser, 'base64').toString();

  const [username, password] = decryptUser.split(':');

  return username === auth.username && password === auth.password;
}

async function getBody(req) {
  return new Promise(function (resolve, reject) {
    const body = [];

    req
      .on('error', (err) => {
        reject(err);
      })
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        resolve(Buffer.concat(body).toString());
      });
  });
}
