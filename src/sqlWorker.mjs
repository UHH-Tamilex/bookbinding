import { createDbWorker } from 'sql.js-httpvfs';

const sqlWorker = async (url) => {
    const workerUrl = new URL('sql.js-httpvfs/dist/sqlite.worker.js',import.meta.url);
    const wasmUrl = new URL('sql.js-httpvfs/dist/sql-wasm.wasm',import.meta.url);
    const sqlConfig = {
        from: 'inline',
        config: {
            serverMode: 'full',
            requestChunkSize: 4096,
            url: url
        }
    };
    const worker = await createDbWorker(
        [sqlConfig],
        workerUrl.toString(),
        wasmUrl.toString(),
        10 * 1024 * 1024
    );

    return worker;
};

export default sqlWorker;
