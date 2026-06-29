import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repo = 'Witsel-Blue/WitselBlue';
const branch = process.env.VERCEL_GIT_COMMIT_REF || 'main';

const glbPaths = [
    'apps/static/models/seashell.glb',
    'apps/static/models/nacrebox.glb',
    'apps/static/models/hairpin.glb',
    'apps/static/models/hairpin2.glb',
];

const isLfsPointer = (buf) => buf.subarray(0, 40).toString('utf8').includes('git-lfs.github.com');

const download = (url, dest) =>
    new Promise((resolve, reject) => {
        const request = (target) => {
            https
                .get(target, (res) => {
                    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                        res.resume();
                        request(res.headers.location);
                        return;
                    }

                    if (res.statusCode !== 200) {
                        res.resume();
                        reject(new Error(`HTTP ${res.statusCode}: ${target}`));
                        return;
                    }

                    const file = fs.createWriteStream(dest);
                    res.pipe(file);
                    file.on('finish', () => file.close(() => resolve()));
                    file.on('error', reject);
                })
                .on('error', reject);
        };

        request(url);
    });

const main = async () => {
    for (const rel of glbPaths) {
        const full = path.join(root, rel);

        if (!fs.existsSync(full)) {
            throw new Error(`[glb] missing: ${rel}`);
        }

        const current = fs.readFileSync(full);
        if (!isLfsPointer(current)) {
            console.log(`[glb] ok ${rel} (${current.length} bytes)`);
            continue;
        }

        const url = `https://media.githubusercontent.com/media/${repo}/${branch}/${rel}`;
        const tmp = `${full}.download`;

        console.log(`[glb] LFS pointer detected, fetching ${rel}`);
        await download(url, tmp);

        const fetched = fs.readFileSync(tmp);
        if (isLfsPointer(fetched)) {
            fs.unlinkSync(tmp);
            throw new Error(`[glb] fetch failed for ${rel}`);
        }

        fs.renameSync(tmp, full);
        console.log(`[glb] restored ${rel} (${fetched.length} bytes)`);
    }
};

main();
