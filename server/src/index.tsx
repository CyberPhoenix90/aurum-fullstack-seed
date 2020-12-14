import { initializeDatabase } from 'aurum-db';
import { AurumServer } from 'aurum-server';
import {
    Aurum,
    aurumToString,
    CancellationToken,
    DataSource,
    DuplexDataSource,
} from 'aurumjs';
import * as compression from 'compression';
import * as express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import './extensions';
import { SSR } from './ssr';
import * as bodyParser from 'body-parser';

async function start() {
    const server = createServer();
    const db = await initializeDatabase({
        path: 'db',
    });

    const index = await db.createOrGetIndex('statistics');
    const chatlog = await db.createOrGetOrderedCollection('chatlog', 'utf8');

    if (!(await index.has('clicks'))) {
        index.set('clicks', 0, 'json');
    }

    const allTimeClicks = await index.observeKey<number>(
        'clicks',
        new CancellationToken(),
        'json'
    );

    const users = new DataSource(0);
    const clicksSinceLaunch = new DuplexDataSource(0);

    const as = AurumServer.create({
        reuseServer: server,
        onClientConnected: () => users.update(users.value + 1),
        onClientDisconnected: () => users.update(users.value - 1),
    });

    as.exposeDataSource('users', users);
    as.exposeDuplexDataSource('clicks', clicksSinceLaunch);
    as.exposeDataSource('persistentClicks', allTimeClicks);
    as.exposeArrayDataSource(
        'chat',
        await chatlog.observeEntireCollection(new CancellationToken())
    );

    clicksSinceLaunch.listen(() =>
        index.set('clicks', allTimeClicks.value + 1, 'json')
    );

    const app = express();
    app.use(compression());
    app.use(bodyParser.json());

    server.on('request', app);

    app.get('/', async (req, res) => {
        res.send(await aurumToString(<SSR></SSR>));
    });

    app.post('/chat', async (req, res) => {
        chatlog.push(req.body.message);
        res.status(200);
        res.end();
    });

    app.get('/favicon', async (req, res) => {
        const path = join(__dirname, '../../favicon.ico', req.url);
        res.sendFile(path);
    });

    app.get('/static/*', async (req, res) => {
        const path = join(__dirname, '../../dist', req.url);
        res.sendFile(path);
    });

    server.listen(3000, () => {
        console.log('Listening on port 3000 http://localhost:3000/');
    });
}

start();
