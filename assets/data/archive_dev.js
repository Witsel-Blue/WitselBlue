import { ziziSnippet } from '../snippet/ziziSnippet';
import { kikiSnippet } from '../snippet/kikiSnippet';
import { witchpotSnippet } from '../snippet/witchpotSnippet';
import { redlightgreenlightSnippet } from '../snippet/redlightgreenlightSnippet';
import { gallerySnippet } from '../snippet/gallerysnippet';
import { beadsSnippet } from '../snippet/beadsSnippet';

export default [
    {
        slug: 'beads',
        title: 'Beads',
        tags: {
            work: 'three.js',
        },
        images: {
            thumb: require('@/assets/img/archive/dev/beads_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/beads_thumb.png'),
        },
        content: {
            about: 'You can scatter rotating beads<br>by hovering mouse.',
            snippet: beadsSnippet,
        }
    },
    {
        slug: '3dgallery',
        title: '3D Gallery',
        tags: {
            work: 'three.js',
        },
        images: {
            thumb: require('@/assets/img/archive/dev/3dgallery_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/3dgallery_thumb.png'),
        },
        content: {
            about: 'Click left and right corner to view more pictures!',
            snippet: gallerySnippet,
        }
    },
    {
        slug: 'kiki',
        title: 'Kiki',
        tags: {
            work: 'p5.js',
        },
        link: {
            href: 'https://editor.p5js.org/witselblue/full/qY2ZOCn7V',
            target: '_blank',
            text: 'veiw code',
        },
        images: {
            thumb: require('@/assets/img/archive/dev/kiki_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/kiki_thumb.png'),
        },
        content: {
            about: 'If butterfly approaches<br>Kiki&#39;s expression changes.<br>Don&#39;t make her surprised too much!',
            snippet: kikiSnippet,
        },
    },
    {
        slug: 'zizi',
        title: 'Zizi',
        tags: {
            work: 'p5.js',
        },
        link: {
            href: 'https://editor.p5js.org/witselblue/full/s33BLxgzG',
            target: '_blank',
            text: 'view code',
        },
        images: {
            thumb: require('@/assets/img/archive/dev/zizi_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/zizi_thumb.png'),
        },
        content: {
            about: 'Eyes and face of Zizi from Kiki&#39;s Delivery Service<br>follow a moving butterfly (your mouse!).',
            snippet: ziziSnippet,
        }
    },
    // {
    //     slug: 'flowergrow',
    //     title: 'FlowerGrow',
    //     tags: {
    //         work: 'p5.js',
    //     },
    //     link: {
    //         href: 'https://editor.p5js.org/witselblue/sketches/s7kdb7UlA',
    //         target: '_blank',
    //         text: 'view code',
    //     },
    //     images: {
    //         thumb: require('@/assets/img/archive/dev/flowergrow_thumb.png'),
    //         mainvisual: require('@/assets/img/archive/dev/flowergrow_thumb.png'),
    //     },
    //     content: {
    //         about: 'Click to grow a flower!',
    //     }
    // },
    {
        slug: 'witchpot',
        title: 'Witch Pot',
        tags: {
            work: 'p5.js',
        },
        link: {
            href: 'https://editor.p5js.org/witselblue/full/w-L-mWvpM',
            target: '_blank',
            text: 'view code',
        },
        images: {
            thumb: require('@/assets/img/archive/dev/witchpot_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/witchpot_thumb.png'),
        },
        content: {
            about: 'You can draw trails of sparkling fume<br> from Kiki&#39;s cauldron.',
            snippet: witchpotSnippet,
        }
    },
    {
        slug: 'redlightgreenlight',
        title: 'RedLight, GreenLight',
        tags: {
            work: 'pixi.js',
        },
        images: {
            thumb: require('@/assets/img/archive/dev/redlightgreenlight_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/redlightgreenlight_thumb.png'),
        },
        content: {
            about: 'In 60 seconds, 5 cats have to get to the goal line.<br>When Kiki turns back and cats are still moving, you are eliminated.<br>(Cats can only move when Kiki is not seeing!)<br>Click on each cats for run or stop.<br>Check out how many cats can get to the goal line!',
            snippet: redlightgreenlightSnippet,
        }
    },
]