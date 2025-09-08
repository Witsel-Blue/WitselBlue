export default [
    {
        slug: 'damgon',
        title: 'Damgon Research',
        desc: {
            duration: { start: '2025.07', end: '2025.09', },
            client: 'Damgon Research',
            agency: 'Witsel Blue',
            stack: 'react / Next / CSS module / typescript',
        },
        tags: {
            work: 'development',
            scope: 'individual',
            env: 'react',
            platform: 'web',
        },
        link: {
            href: '',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            // thumb: '',
            // mainvisual: '',
            // gif: '',
            // pc1: '',
            // mb1: '',
        },
        content: {
            about: '',
        },
    },
    {
        slug: 'myportfolio',
        title: 'MyPortfolio',
        desc: {
            duration: { start: '2024.11', },
            stack: 'vue2 / Nuxt / scss / javascript',
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
            text: 'view code',
        },
        images: {
            // thumb: require('@/assets/img/projects/myportfolio_thumb.png'),
            mainvisual: require('@/assets/img/projects/myportfolio_pc1.png'),
            gif: require('@/assets/img/projects/myportfolio_gif.gif'),
            pc1: require('@/assets/img/projects/myportfolio_pc1.png'),
            pc2: require('@/assets/img/projects/myportfolio_pc2.png'),
            pc3: require('@/assets/img/projects/myportfolio_pc3.png'),
            mb1: require('@/assets/img/projects/myportfolio_mb1.png'),
            // mb2: require('@/assets/img/projects/project09_mb02.png'),
            // mb3: require('@/assets/img/projects/project09_mb03.png'),
        },
        content: {
            // about: 'vue와 nuxt로 구축한 2025년 버전 포트폴리오 사이트입니다.<br> GSAP, AOS 등의 라이브러리를 이용하였고, <br> 메인비주얼은 p5.js를 사용했습니다. <br> GitHub에 전체 코드를 올려두었으니 확인해 보세요!',
            about: 'This is a 2025 version portfolio site built with Vue and Nuxt.<br> It utilizes libraries like GSAP and AOS,<br>and the main visuals are built by using p5.js.<br>The full code is available on GitHub, so check it out!',
            detail: [
                // '한글, 영문 지원',
                // '스크롤 시 페이저 회전 구현',
                // '스크롤 시 카드 속도에 따라 기울기 구현',
                // '텍스트 쉬프팅 애니메이션 구현',
                // '텍스트 스크롤에 따라 올라가는 애니메이션 구현',
                // 'Reusable code with over 20 components',
                // 'Responsible with every viewport',
            ]
        }
    },
    {
        slug: 'monimo',
        title: 'Monimo',
        desc: {
            duration: { start: '2024-07', end: '2024-10' },
            client: 'Samsung',
            agency: 'Lisn',
            stack: 'vue2 / scss / javascript / storybook',
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
            thumb: require('@/assets/img/projects/monimo_thumb.png'),
            mainvisual: require('@/assets/img/projects/monimo_main.png'),
            mb1: require('@/assets/img/projects/monimo_mb1.png'),
            mb2: require('@/assets/img/projects/monimo_mb2.png'),
            mb3: require('@/assets/img/projects/monimo_mb3.png'),
        },
        content: {
            // locales: projects.monimo.about
            // about: '삼성생명, 삼성화재, 삼성카드,<br class="mb"> 삼성증권에서 만든 금융 서비스 앱<br> 여러 팀과 협력하여<br class="mb"> 보안 시스템 아래에서 개발<br> 컴포넌트와 1400여개 페이지 관리,<br class="mb"> 카드 메인 페이지 담당',
            about: 'Financial Services app<br>planned by Samsung Life Insurance, Fire Insurance and Samsung Card.<br> Developed under security system in collaboration with multiple teams.<br> Managed components and over 1,400 pages, including the card main page.',
            detail: [
                // 'vue2에서 vue3 마이그레이션',
                // '보안 시스템으로 인터넷 사용 없이 개발',
                // 'Migration from Vue2 to Vue3',
                // 'Developed without internet connect under security system'
            ]
        }
    },
    {
        slug: '416',
        title: '4·16 Online Memorial',
        desc: {
            duration: { start: '2022.04', },
            client: '4·16 Foundation',
            agency: 'SKNK',
            stack: 'html / css / jQuery / ScrollMagic'
        },
        tags: {
            work: 'publishing',
            scope: 'teamwork',
            env: 'vanila',
            platform: 'web',
        },
        link: {
            href: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/projects/416_thumb.png'),
            mainvisual: require('@/assets/img/projects/416_main.png'),
            // gif: require('@/assets/img/projects/416_gif.gif'),
            pc1: require('@/assets/img/projects/416_pc1.png'),
            pc2: require('@/assets/img/projects/416_pc2.png'),
            pc3: require('@/assets/img/projects/416_pc3.png'),
            mb1: require('@/assets/img/projects/416_mb1.png'),
            mb2: require('@/assets/img/projects/416_mb2.png'),
        },
        content: {
            // about: '세월호참사 10주기를 기념하여<br class="mb"> 메세지를 남길 수 있는 공간<br> Scrollmagic, Tweenmax 등의<br class="mb"> 라이브러리를 이용하여 메인비주얼 구현',
            about: 'An online space which can leave messages<br> commemorating the 10th anniversary of the Sewol Ferry Disaster.<br> Main visuals implemented using libraries like Scrollmagic and Tweenmax.'
        },
    },
    {
        slug: 'dcamp',
        title: 'DCAMP',
        desc: {
            duration: { start: '2022.01', end: '2022.03', },
            client: 'Banks Foundation for Young Entrepreneurs',
            agency: 'SKNK',
            stack: 'drupal9 / css / jQuery',
        },
        tags: {
            work: 'frontend',
            scope: 'teamwork',
            env: 'drupal',
            platform: 'web',
        },
        link: {
            href: 'https://dcamp.kr/',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/projects/dcamp_thumb.png'),
            mainvisual: require('@/assets/img/projects/dcamp_main.png'),
            // gif: require('@/assets/img/projects/dcamp_gif.gif'),
            pc1: require('@/assets/img/projects/dcamp_pc1.png'),
            pc2: require('@/assets/img/projects/dcamp_pc2.png'),
            pc3: require('@/assets/img/projects/dcamp_pc3.png'),
            mb1: require('@/assets/img/projects/dcamp_mb1.png'),
            mb2: require('@/assets/img/projects/dcamp_mb2.png'),
            mb3: require('@/assets/img/projects/dcamp_mb3.png'),
        },
        content: {
            // about: '은행권청년창업재단 디캠프 사이트 리뉴얼<br> 사이트 전체 프론트엔드 담당',
            about: 'Banks Foundation for Young Entrepreneurs, DCAMP site renewal.<br>Responsible for the entire frontend of the site.<br>You can search and apply for programs DCAMP provides.<br>English site and personal membership window exists.',
            // detail: [
            //     '영문 사이트, 로그인 개인 페이지 포함',
            //     '다양한 스크롤 이벤트 포함한 프로모션 메인페이지 제작',
            // ]
        },
    },
    {
        slug: 'dcdc',
        title: 'DCDC',
        desc: {
            duration: { start: '2021.11', end: '2021.12', },
            client: 'Dancers Career Development Center',
            agency: 'SKNK',
            stack: 'drupal9 / css / jQuery',
        },
        tags: {
            work: 'frontend',
            scope: 'teamwork',
            env: 'drupal',
            platform: 'web',
        },
        link: {
            href: 'https://www.dcdcenter.or.kr/',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/projects/dcdc_thumb.png'),
            mainvisual: require('@/assets/img/projects/dcdc_main.png'),
            // gif: require('@/assets/img/projects/dcdc_gif.gif'),
            pc1: require('@/assets/img/projects/dcdc_pc1.png'),
            pc2: require('@/assets/img/projects/dcdc_pc2.png'),
            pc3: require('@/assets/img/projects/dcdc_pc3.png'),
            mb1: require('@/assets/img/projects/dcdc_mb1.png'),
            mb2: require('@/assets/img/projects/dcdc_mb2.png'),
            mb3: require('@/assets/img/projects/dcdc_mb3.png'),
        },
        content: {
            // about: '무용예술인의 직업전환과 복지증진을 목표로 다양한 지원사업을 운영하고 있는 사이트.<br> 사이트 내에서 다양한 지원을 신청할 수 있고, 소식을 확인할 수 있습니다.<br> 후원기능이 있고, 간단한 영문 페이지가 따로 존재합니다.',
            about: 'The site operates various support programs helping dance artists.<br>You can apply support programs for health improvement or career transition.<br>Checking latest news, donation functioning are also possible.',
            detail: [
                // '연혁 쪽 내비게이션과 스크롤 직접 제작, 영문사이트 포함',
                // '회원 비회원일 시 바뀌는 내비게이션과 개인화면',
                // '유투브 링크로 비디오 연동기능 제작',
                'Developed video link to thumbnail service<br> at Community > DCDC Archive > Videos corner.',
                'Scroll events at Introduction > History',
            ]
        },
    },
    {
        slug: 'kace',
        title: 'KACE',
        desc: {
            duration: { start: '2021.09', end: '2021.10', },
            client: 'Korea Association for Community Education',
            agency: 'SKNK',
            stack: 'drupal9 / css / jQuery',
        },
        tags: {
            work: 'frontend',
            scope: 'teamwork',
            env: 'drupal',
            platform: 'web',
        },
        link: {
            href: 'https://ukace.or.kr/',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/projects/kace_thumb.png'),
            mainvisual: require('@/assets/img/projects/kace_main.png'),
            // gif: require('@/assets/img/projects/kace_gif.gif'),
            pc1: require('@/assets/img/projects/kace_pc1.png'),
            pc2: require('@/assets/img/projects/kace_pc2.png'),
            pc3: require('@/assets/img/projects/kace_pc3.png'),
            mb1: require('@/assets/img/projects/kace_mb1.png'),
            mb2: require('@/assets/img/projects/kace_mb2.png'),
            mb3: require('@/assets/img/projects/kace_mb3.png'),
        },
        content: {
            // about: 'KACE 사이트 리뉴얼.<br>지역사회교육에 관한 조사연구 전문가 양성과<br> 다양한 교육공동체 프로그램을<br class="mb"> 신청할 수 있는 서비스를 제공합니다.',
            about: 'KACE site renewal.<br>The site provides training experts in community education research<br>and applying services for community programs.',
            detail: [
                // '홈 화면 호버 이벤트가 있는 배너 구현',
                'Developed banner at home screen with hover events',
                'Responsible sliders at home scren made with Slick.js'
            ]
        },
    },
    {
        slug: 'rnjob',
        title: 'RNJOB',
        desc: {
            duration: { start: '2021.07', end: '', },
            client: 'Korean Nursing Association',
            agency: 'SKNK',
            stack: 'html / css / jQuery',
        },
        tags: {
            work: 'publishing',
            scope: 'teamwork',
            env: 'drupal',
            platform: 'app',
        },
        link: {
            href: 'https://play.google.com/store/apps/details?id=kr.or.rnjob.recruit&hl=uz',
            target: '_blank',
            text: 'google play', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/projects/rnjob_thumb.png'),
            mainvisual: require('@/assets/img/projects/rnjob_main.png'),
            pc1: '',
            mb1: require('@/assets/img/projects/rnjob_mb1.png'),
            mb2: require('@/assets/img/projects/rnjob_mb2.png'),
            mb3: require('@/assets/img/projects/rnjob_mb3.png'),
        },
        content: {
            // about: '간호인력의 교육, 취업, 상담을 지원·관리하는<br>RNJOB 웹사이트의 앱 버전입니다.<br>병원이나 기관의 정보 열람, 채용정보를 확인할 수 있습니다.',
            about: 'App version of the RNJOB website providing<br>training, employment counseling for nursing staffs.<br>You can access information about hospitals and institutions.',
            // detail: [
            //     '외주 형식으로 참여하여 퍼블리싱을 도왔습니다',
            //     '전체 CSS 코드 정리 및 디테일 수정'
            // ]
        },
    },
    {
        slug: 'oxfam',
        title: 'Oxfam Virtual Walker',
        desc: {
            duration: { start: '2021.08', end: '2021.09', },
            client: 'Oxfam Korea',
            agency: 'SKNK',
            stack: 'drupal9 / css / jQuery',
        },
        tags: {
            work: 'frontend',
            scope: 'teamwork',
            env: 'drupal',
            platform: 'web',
        },
        link: {
            href: 'https://v50.oxfamtrailwalker.or.kr/',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/projects/oxfam_thumb.png'),
            mainvisual: require('@/assets/img/projects/oxfam_main.png'),
            // gif: require('@/assets/img/projects/oxfam_gif.gif'),
            pc1: require('@/assets/img/projects/oxfam_pc1.png'),
            pc2: require('@/assets/img/projects/oxfam_pc2.png'),
            pc3: require('@/assets/img/projects/oxfam_pc3.png'),
            mb1: require('@/assets/img/projects/oxfam_mb1.png'),
            mb2: require('@/assets/img/projects/oxfam_mb2.png'),
            mb3: require('@/assets/img/projects/oxfam_mb3.png'),
        },
        content: {
            // about: '옥스팜코리아에서 주최한 걷기 기부<br class="mb"> 소개 및 참가신청 사이트.<br> 스크롤에 따라 SVG 라인이 그려지는<br class="mb"> 애니메이션 구현.<br>미션에 따라 팀의 스탬프가 인증됩니다.',
            about: 'An introduction and registeration site for walking donation event<br> sponsored by Oxfam Korea.<br>Scroll animation with SVG at home scren.<br>Team stamps are awarded based on mission completion.',
            detail: [
                // '이미지형 폰트를 반응형으로 사용',
                // '홈화면 스크롤에 따라 섹션 명칭을 보여주는 네비게이션',
                'Used image fonts responsively.'
            ]
        },
    },
    {
        slug: 'cabinnet',
        title: 'Cabin.net',
        desc: {
            duration: { start: '2021.05', end: '2021.07', },
            client: 'Seoul Social Economy Center',
            agency: 'SKNK',
            stack: 'drupal9 / css / jQuery',
        },
        tags: {
            work: 'frontend',
            scope: 'teamwork',
            env: 'drupal',
            platform: 'web',
        },
        link: {
            href: 'https://sehub.net/archives/2076582',
            target: '_blank',
            text: 'visit site', // loacales: common.visit
        },
        images: {
            thumb: require('@/assets/img/projects/cabinnet_thumb.png'),
            mainvisual: require('@/assets/img/projects/cabinnet_main.png'),
            pc1: '',
            mb1: '',
        },
        content: {
            // about: '나의 취향과 상품의 스토리가<br class="mb"> 만나는 콘텐츠 플랫폼으로,<br> 세상을 바꾸는 실험과 시도가 담긴<br class="mb"> 사회적경제의 상품과 브랜드를 소개.<br> 네이버 블로그 형식으로 운영에서 쉽게<br class="mb"> 글을 작성할 수 있도록 개발.',
            about: 'Content platform where personal preferences and product stories meet.<br>The site introduces social economy products and brands.<br>Developed in blog format providing easy writing system for site operators.',
            // detail: [
            //     '실전으론 처음 담당한 프로젝트',
            //     '블로그 형식으로 진행되어, 관리자가 더 편하게 글을 쓸 수 있도록 가이드 페이지 제작',
            // ] 
        },
    },
]