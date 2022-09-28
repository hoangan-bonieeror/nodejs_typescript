import mongoose from "mongoose";
import config from 'config';
import log from '../logger/log';

export default function connect() {
    const dbUri = config.get('dbUri') as string;

    return mongoose
        .connect(dbUri)
        .then(() => log.info('Database Connected'))
        .catch((error) => log.error('DB error', error))
}