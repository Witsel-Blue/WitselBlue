import { ziziSnippet } from '../snippet/ziziSnippet';
import { kikiSnippet } from '../snippet/kikiSnippet';
import { witchpotSnippet } from '../snippet/witchpotSnippet';
import { redlightgreenlightSnippet } from '../snippet/redlightgreenlightSnippet';
import { gallerySnippet } from '../snippet/gallerysnippet';
import { beadsSnippet } from '../snippet/beadsSnippet';

export default [
    {
        slug: 'beads',
        title: {
            en: 'Beads',
            ko: '구슬',
        },
        tags: {
            work: {
                en: 'three.js',
                ko: 'three.js',
            },
        },
        images: {
            thumb: require('@/assets/img/archive/dev/beads_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/beads_thumb.png'),
        },
        content: {
            about: {
                en: 'You can scatter rotating beads<br>by hovering mouse.',
                ko: '마우스를 움직여서 <br>회전하는 구슬을 흩뿌릴 수 있습니다.',
            },
            snippet: beadsSnippet,
        }
    },
    {
        slug: '3dgallery',
        title: {
            en: '3D Gallery',
            ko: '갤러리',
        },
        tags: {
            work: {
                en: 'three.js',
                ko: 'three.js',
            },
        },
        images: {
            thumb: require('@/assets/img/archive/dev/3dgallery_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/3dgallery_thumb.png'),
        },
        content: {
            about: {
                en: 'Click left and right corner<br> to view more pictures!',
                ko: '더 많은 그림을 보기 위해 <br>왼쪽 오른쪽 사이드를 클릭해 보세요!',
            },
            snippet: gallerySnippet,
        }
    },
    {
        slug: 'kiki',
        title: {
            en: 'Kiki',
            ko: '키키',
        },
        tags: {
            work: {
                en: 'p5.js',
                ko: 'p5.js',
            },
        },
        link: {
            href: 'https://editor.p5js.org/witselblue/full/qY2ZOCn7V',
            target: '_blank',
            text: {
                en: 'veiw code',
                ko: '코드 보기',
            }
        },
        images: {
            thumb: require('@/assets/img/archive/dev/kiki_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/kiki_main.png'),
        },
        content: {
            about: {
                en: 'If butterfly approaches<br>Kiki&#39;s expression changes.<br>Don&#39;t make her surprised too much!',
                ko: '나비가 가까이 다가가면 <br>키키의 얼굴이 바뀝니다. <br>키키가 너무 놀라게 하지 마세요!',
            },
            snippet: kikiSnippet,
        },
    },
    {
        slug: 'zizi',
        title: {
            en: 'Zizi',
            ko: '지지'
        },
        tags: {
            work: {
                en: 'p5.js',
                ko: 'p5.js',
            },
        },
        link: {
            href: 'https://editor.p5js.org/witselblue/full/s33BLxgzG',
            target: '_blank',
            text: {
                en: 'veiw code',
                ko: '코드 보기',
            }
        },
        images: {
            thumb: require('@/assets/img/archive/dev/zizi_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/zizi_main.png'),
        },
        content: {
            about: {
                en:  'Eyes and face of Zizi <br class="mb">from Kiki&#39;s Delivery Service<br>follow a moving butterfly <br class="mb">(your mouse!).',
                ko: '마녀배달부 키키에 나오는 고양이 지지는<br>날아다니는 나비를 보는걸 좋아해요<br class="mb">(당신의 마우스!)',
            },
            snippet: ziziSnippet,
        }
    },
    {
        slug: 'witchpot',
        title: {
            en: 'Witch Pot',
            ko: '마녀의 솥',
        },
        tags: {
            work: {
                en: 'p5.js',
                ko: 'p5.js',
            },
        },
        link: {
            href: 'https://editor.p5js.org/witselblue/full/w-L-mWvpM',
            target: '_blank',
            text: {
                en: 'veiw code',
                ko: '코드 보기',
            }
        },
        images: {
            thumb: require('@/assets/img/archive/dev/witchpot_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/witchpot_main.png'),
        },
        content: {
            about: {
                en: 'You can draw trails of sparkling fume<br> from Kiki&#39;s cauldron.',
                ko: '키키의 마법 솥에서 <br>반짝이는 연기의 길을 그릴 수 있어요.',
            },
            snippet: witchpotSnippet,
        }
    },
    {
        slug: 'redlightgreenlight',
        title: {
            en: 'RedLight, GreenLight',
            ko: '무궁화꽃이 피었습니다',
        },
        tags: {
            work: {
                en: 'pixi.js',
                ko: 'pixi.js',
            },
        },
        images: {
            thumb: require('@/assets/img/archive/dev/redlightgreenlight_thumb.png'),
            mainvisual: require('@/assets/img/archive/dev/redlightgreenlight_thumb.png'),
        },
        content: {
            about: {
                en: 'In 60 seconds, 5 cats have to <br class="mb">get to the goal line.<br>When Kiki turns back and cats are still moving, you are eliminated.<br>(Cats can only move <br class="mb">when Kiki is not seeing!)<br>Click on each cats for run or stop.<br>Check out how many cats can <br class="mb">get to the goal line!',
                ko: '60초 안에 모든 다섯마리 고양이가 <br class="mb">결승선에 도착해야합니다!<br>키키가 뒤돌아보고 있을 때 <br class="mb">고양이가 움직이면 아웃이에요.<br>(키키가 보고 있지 않을 때 움직여야합니다!)<br>각 고양이를 클릭하면 <br class="mb">움직이거나 멈출 수 있어요.<br>얼마나 많은 고양이가 결승선에 <br class="mb">도달할 수 있는지 테스트해보세요!',
            },
            snippet: redlightgreenlightSnippet,
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
]