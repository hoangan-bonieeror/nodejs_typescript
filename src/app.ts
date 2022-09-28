import express from 'express';
import config from 'config';
import log from './logger/log';
import connect from './db/connect';
import { createUserHandler } from './controller/user.controller';
import { validateRequest } from './middleware/validateRequest';
import { schema_createUser, schema_createUserSession } from './schema/user.schema';
import { createSessionHandler } from './controller/session.controller';
import deserializeUser from './middleware/deserializeUser';
import requireUser from './middleware/requireUser';
import { postRoute } from './route/post.route';

const app = express();

const port = config.get('port') as number;
const host = config.get('host') as string;

app.use(express.json());
app.use(express.urlencoded({ extended : false }))
app.use(deserializeUser)

// Register user
app.post('/api/users', validateRequest(schema_createUser) , createUserHandler)

// Create session
app.post('/api/sessions', validateRequest(schema_createUserSession), createSessionHandler)

// Post Route
app.use("/api/posts", requireUser, postRoute)

app.listen(port, host, () => {
    log.info(`Server listening on http://${host}:${port}`);
    connect();
})