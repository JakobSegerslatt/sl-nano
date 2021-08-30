import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { AxiosResponse } from 'axios';
import * as express from 'express';
import { existsSync } from 'fs';
import { join } from 'path';
import { SL_PLATSUPPSLAG_KEY, SL_REALTID_4_KEY } from 'src/KEYS';
import 'zone.js/dist/zone-node';
import { AppServerModule } from './src/main.server';
const axios = require('axios');

const SL_API_V2 = 'https://api.sl.se/api2';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/sl-go/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? 'index.original.html'
    : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    })
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  server.get('/api/fetch-places', (req, res) => {
    const search = req.query.search || '';
    const url = `${SL_API_V2}/typeahead.json?key=${SL_PLATSUPPSLAG_KEY}&searchstring=${search}`;

    axios(url)
      .then((response: AxiosResponse) => {
        res.status(response.status).send(response.data);
      })
      .catch((error: AxiosResponse) => {
        res.status(error.status).send(error.data);
      });
  });
  server.get('/api/fetch-realtime/:id', (req, res) => {
    const siteId = req.params.id;
    const timwWindow = req.query.timwWindow || 60;
    const url = `${SL_API_V2}/realtimedeparturesV4.json?key=${SL_REALTID_4_KEY}&siteid=${siteId}&timewindow=${timwWindow}&Bus=false&Metro=false`;

    axios(url)
      .then((response: AxiosResponse) => {
        res.status(response.status).send(response.data);
      })
      .catch((error: AxiosResponse) => {
        res.status(error.status).send(error.data);
      });
  });

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  return server;
}

function run(): void {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
