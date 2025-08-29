export default [
    // {
    //     name: 'Damgon Research',
    //     path: '/projects/damgon',
    //     link: '',
    //     img: '',
    //     duration: '2025.06-2025.08',
    //     tags: {
    //         work: 'development',
    //         team: 'individual',
    //         env: 'react',
    //         platrom: 'web',
    //     }
    // },
    {
        slug: 'myportfolio',
        title: 'MyPortfolio',
        desc: {
            duration: { start: '2024.11', },
        },
        tags: {
            work: 'development',
            scope: 'individual',
            env: 'vue',
            platform: 'web',
        },
        link: {
            href: 'https://github.com/Witsel-Blue/WitselBlue',
            target: '_blank',
            text: 'visit site',
        },
        images: {
            thumb: require('@/assets/img/project09_main.png'),
            mainvisual: require('@/assets/img/project09_main.png'),
            pc: require('@/assets/img/project09_pc.png'),
            mb1: require('@/assets/img/project09_mb01.png'),
            mb2: require('@/assets/img/project09_mb02.png'),
            mb3: require('@/assets/img/project09_mb03.png'),
        },
        content: {
            about: 'vue와 nuxt로 구축한 2024년 버전 포트폴리오 사이트입니다.<br> GSAP, AOS 등의 라이브러리를 이용하였고, <br> 메인비주얼은 three.js를 사용했습니다. <br> GitHub에 전체 코드를 올려두었으니 확인해 보세요!',
        }
    },
    {
        slug: 'monimo',
        title: 'Monimo',
        desc: {
            duration: { start: '2024-07', end: '2024-10' },
            client: 'Samsung',
            agency: 'lisn',
        },
        tags: {
            work: 'frontend',
            scope: 'teamwork',
            env: 'vue',
            platform: 'app',
        },
        link: {
            href: 'https://www.monimo.com/w/main/WPFMHP0101M0',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/project01_main.png'),
            mainvisual: require('@/assets/img/project01_main.png'),
            mb1: require('@/assets/img/project01_mb01.png'),
            mb2: require('@/assets/img/project01_mb02.png'),
            mb3: require('@/assets/img/project01_mb03.png'),
        },
        content: {
            // locales: projects.monimo.about
            about: '삼성생명, 삼성화재, 삼성카드,<br class="mb"> 삼성증권에서 만든 금융 서비스 앱<br> 여러 팀과 협력하여<br class="mb"> 보안 시스템 아래에서 개발<br> 컴포넌트와 1400여개 페이지 관리,<br class="mb"> 카드 메인 페이지 담당',

        }
    },
    // {
    //     name: '4·16 Online Memorial',
    //     path: '/projects/OnlineMemorial',
    //     link: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84/',
    //     img: require('@/assets/img/project02_main.png'),
    //     duration: '2022.04',
    //     tags: {
    //         work: 'publishing',
    //         team: 'teamwork',
    //         env: 'vanila',
    //         platform: 'web',
    //     }
    // },
    // {
    //     name: 'DCAMP',
    //     path: '/projects/DCAMP',
    //     link: 'https://dcamp.kr/',
    //     img: require('@/assets/img/project03_main.png'),
    //     duration: '2022.01-2022.03',
    //     tags: {
    //         work: 'frontend',
    //         team: 'teamwork',
    //         env: 'drupal',
    //         platform: 'web',
    //     }
    // },
    // {
    //     name: 'Oxfam VirtualWalker',
    //     path: '/projects/OxfamVirtualWalker',
    //     link: 'https://v50.oxfamtrailwalker.or.kr/',
    //     img: require('@/assets/img/project04_main.png'),
    //     duration: '2021.08-2021.09',
    //     tags: {
    //         work: 'frontend',
    //         team: 'teamwork',
    //         env: 'drupal',
    //         platform: 'web',
    //     }
    // },
    // {
    //     name: 'DCDCenter',
    //     path: '/projects/DCDCenter',
    //     link: 'https://www.dcdcenter.or.kr/',
    //     img: require('@/assets/img/project05_main.png'),
    //     duration: '2021.11-2021.12',
    //     tags: {
    //         work: 'frontend',
    //         team: 'teamwork',
    //         env: 'drupal',
    //         platform: 'web',
    //     }
    // },
    // {
    //     name: 'Cabinnet',
    //     path: '/projects/cabinnet',
    //     link: '/',
    //     img: require('@/assets/img/project06_main.png'),
    //     duration: '2021.05-2021.07',
    //     tags: {
    //         work: 'frontend',
    //         team: 'teamwork',
    //         env: 'drupal',
    //         platform: 'web',
    //     }
    // },
    // {
    //     name: 'KACE',
    //     path: '/projects/KACE',
    //     link: 'http://www.kace.or.kr/',
    //     img: require('@/assets/img/project07_main.png'),
    //     duration: '2021.09-2021.10',
    //     tags: {
    //         work: 'frontend',
    //         team: 'teamwork',
    //         env: 'drupal',
    //         platform: 'web',
    //     }
    // },
    // {
    //     name: 'RNJOB App',
    //     path: '/projects/RNJOB',
    //     link: 'https://rnjob.or.kr/',
    //     img: require('@/assets/img/project08_main.png'),
    //     duration: '2021.07',
    //     tags: {
    //         work: 'publishing',
    //         team: 'teamwork',
    //         env: 'drupal',
    //         platform: 'app',
    //     }
    // },
]