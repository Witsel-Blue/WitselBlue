import { Cache } from 'three';
import archiveData from '@/assets/data/archive.js';
import mirrorUrl from '@/assets/model/mirror.glb';
import nacreBoxUrl from '@/assets/model/nacrebox.glb';
import jadeUrl from '@/assets/model/texture/jade.png';
import nacreUrl from '@/assets/model/texture/nacre.png';
import nacreRedUrl from '@/assets/model/texture/nacre_red.png';
import nacrePurpleUrl from '@/assets/model/texture/nacre_purple.png';
import nacreWhiteUrl from '@/assets/model/texture/nacre_white.png';
import nacreBeigeUrl from '@/assets/model/texture/nacre_beige.png';
import treeUrl from '@/assets/img/home/tree.svg';
import mountain1Url from '@/assets/img/home/mountain1.svg';
import mountain2Url from '@/assets/img/home/mountain2.svg';
import mountain3Url from '@/assets/img/home/mountain3.svg';
import moonUrl from '@/assets/img/home/moon.svg';
import aboutImg1Url from '@/assets/img/home/about_img1.svg';
import aboutSideUrl from '@/assets/img/home/about_side.svg';

const LIST_INDEXES = [0, 2, 3, 4, 5, 9];

const IMAGE_URLS = [
    jadeUrl,
    nacreUrl,
    nacreRedUrl,
    nacrePurpleUrl,
    nacreWhiteUrl,
    nacreBeigeUrl,
    aboutSideUrl,
    ...LIST_INDEXES.map((index) => archiveData[index]?.images?.thumb).filter(Boolean),
];

const MODEL_URLS = [mirrorUrl, nacreBoxUrl, '/models/seashell.glb'];

const TEXT_URLS = [
    treeUrl,
    mountain1Url,
    mountain2Url,
    mountain3Url,
    moonUrl,
    aboutImg1Url,
];

const textCache = new Map();
const textPending = new Map();

function loadBuffer(url, onFraction) {
    return fetch(url).then(async (response) => {
        if (!response.ok) throw new Error(response.statusText);

        const total = Number(response.headers.get('Content-Length')) || 0;
        if (!response.body) {
            const buffer = await response.arrayBuffer();
            onFraction?.(1);
            return buffer;
        }

        const reader = response.body.getReader();
        const chunks = [];
        let loaded = 0;

        for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            loaded += value.byteLength;
            if (total) onFraction?.(Math.min(1, loaded / total));
        }

        const merged = new Uint8Array(loaded);
        let offset = 0;
        chunks.forEach((chunk) => {
            merged.set(chunk, offset);
            offset += chunk.byteLength;
        });
        onFraction?.(1);
        return merged.buffer;
    });
}

export function readAssetText(url, onFraction) {
    if (textCache.has(url)) {
        onFraction?.(1);
        return Promise.resolve(textCache.get(url));
    }
    if (textPending.has(url)) return textPending.get(url);

    const pending = loadBuffer(url, onFraction)
        .then((buffer) => {
            const text = new TextDecoder().decode(buffer);
            textCache.set(url, text);
            textPending.delete(url);
            onFraction?.(1);
            return text;
        })
        .catch((error) => {
            textPending.delete(url);
            throw error;
        });

    textPending.set(url, pending);
    return pending;
}

function preloadImage(url, onFraction) {
    return loadBuffer(url, onFraction).then(
        (buffer) =>
            new Promise((resolve) => {
                const blobUrl = URL.createObjectURL(new Blob([buffer]));
                const image = new Image();
                const done = () => {
                    URL.revokeObjectURL(blobUrl);
                    onFraction?.(1);
                    resolve();
                };
                image.onload = () => {
                    Cache.add(url, image);
                    done();
                };
                image.onerror = done;
                image.src = blobUrl;
            })
    );
}

function preloadModel(url, onFraction) {
    return loadBuffer(url, onFraction).then((buffer) => {
        Cache.add(url, buffer);
        onFraction?.(1);
    });
}

function preloadModule(loader, onFraction) {
    return loader().then(() => {
        onFraction?.(1);
    });
}

export function preloadHomeAssets(onProgress) {
    Cache.enabled = true;

    const jobs = [
        ...IMAGE_URLS.map((url) => (report) => preloadImage(url, report)),
        ...MODEL_URLS.map((url) => (report) => preloadModel(url, report)),
        ...TEXT_URLS.map((url) => (report) => readAssetText(url, report)),
        (report) => loadBuffer('/sound/crack.mp3', report),
        (report) => preloadModule(() => import('three'), report),
        (report) => preloadModule(() => import('three/examples/jsm/loaders/GLTFLoader.js'), report),
        (report) =>
            preloadModule(
                () => import('three/examples/jsm/environments/RoomEnvironment.js'),
                report
            ),
        (report) => preloadModule(() => import('@/components/home/FeaturedWork.vue'), report),
        (report) => preloadModule(() => import('@/components/home/RabbitHole.vue'), report),
    ];

    const fractions = new Array(jobs.length).fill(0);
    const emit = () => {
        const sum = fractions.reduce((total, value) => total + value, 0);
        const percent = Math.round((sum / jobs.length) * 100);
        onProgress?.(Math.min(100, percent));
    };

    emit();

    return Promise.all(
        jobs.map((job, index) =>
            job((fraction) => {
                fractions[index] = Math.max(fractions[index], Math.min(1, fraction));
                emit();
            }).catch(() => {
                fractions[index] = 1;
                emit();
            })
        )
    );
}
