export default [
    {
        slug: 'damgon',
        title: {
            en: 'Damgon Research',
            ko: '담곤 연구소',
        },
        desc: {
            duration: { start: '2025.05', end: '2025.8', },
            client: {
                en: 'Damgon Research',
                ko: '담곤 연구소',
            },
            agency: {
                en: 'Witsel Blue',
                ko: '비첼 블루',
            },
            stack: {
                en: 'React / Next / CSS module / typescript',
                ko: 'React / Next / CSS 모듈 / 타입스크립트',
            },
        },
        tags: {
            work: {
                en: 'development',
                ko: '전체개발',
            },
            scope: {
                en: 'individual',
                ko: '개인',
            },
            env: {
                en: 'react',
                ko: '리액트',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://damgon.vercel.app',
            target: '_blank',
            text: {
                en: 'visit site',
                ko: '사이트 방문',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/damgon_thumb.png'),
            mainvisual: require('@/assets/img/projects/damgon_main.png'),
            pc1: require('@/assets/img/projects/damgon_pc1.png'),
            pc2: require('@/assets/img/projects/damgon_pc2.png'),
            pc3: require('@/assets/img/projects/damgon_pc3.png'),
            mb1: require('@/assets/img/projects/damgon_mb1.png'),
            mb2: require('@/assets/img/projects/damgon_mb2.png'),
            mb3: require('@/assets/img/projects/damgon_mb3.png'),
            pc4: require('@/assets/img/projects/damgon_pc4.png'),
            pc5: require('@/assets/img/projects/damgon_pc5.png'),
            pc6: require('@/assets/img/projects/damgon_pc6.png'),
        },
        content: {
            about: {
                en: 'A website for insect research institute, Damgon Research.<br>Developed with React and Next.js, <br> and you can write, manage articles<br class="mb"> with admin pages.<br>Supbase and Vecel are used for <br class="mb">data management and distribution.',
                ko: '담곤 연구소를 위한<br class="mb"> 곤충 연구 웹사이트입니다.<br>React와 Next.js를 사용하여 개발하였고, <br> admin 페이지를 통해<br class="mb"> 글을 등록, 관리할 수 있습니다.<br>Supbase와 Vecel을 통해 데이터 관리 및<br class="mb"> 배포까지 진행하였습니다.',
            },
            detail1_title: {
                en: 'Requirements → What problems needed solving',
                ko: '요구사항 → 문제 해결 방법',
            },
            detail1: {
                en: [
                    'A modern website where visitors can browse research articles, galleries, and news.',
                    'An admin panel where staff can write, edit, and manage all content without technical knowledge.',
                    'A “Contact / Inquiry” page that allows visitors to send messages directly.',
                    'Fast performance, responsive layout, and stable deployment.',
                ],
                ko: [
                    '연구 자료, 사진 갤러리, 기관 소식 등을 살펴볼 수 있는 웹사이트.',
                    'admin 페이지를 통해 글 등록, 관리 가능.',
                    '방문자가 직접 메시지를 보낼 수 있는 "문의/연락처" 페이지가 존재.',
                    '빠른 성능, 반응형 레이아웃 및 안정적인 배포.',
                ],
            },
            detail2_title: {
                en: 'My work (Actions)',
                ko: '내 작업 (행동)',
            },
            detail2: {
                en: [
                    'Built the full website using React + Next.js + TypeScript.',
                    'Created a secure admin login and custom admin dashboard.',
                    'Implemented article creation, editing, search, archive, and gallery features.',
                    'Designed responsive UI for PC and mobile.',
                    'Built database + storage structure with Supabase.',
                    'Set up hosting and CI/CD with Vercel.',
                    'Added search, archive, gallery, and content management features.',
                    'Integrated SendGrid email service to send inquiries directly to the institute’s email inbox',
                ],
                ko: [
                    'React, Next.js, TypeScript를 사용하여 웹사이트 전체 구축.',
                    '안전한 관리자 로그인과 맞춤형 관리자 대시보드 구축.',
                    '글 작성, 편집, 검색, 보관 및 갤러리 기능을 구현.',
                    'PC와 모바일 반응형 레이아웃 설계.',
                    'Supabase를 사용하여 데이터베이스와 저장소 구축.',
                    'Vercel을 사용하여 호스팅과 CI/CD 설정.',
                    '검색, 보관, 갤러리 및 콘텐츠 관리 기능 추가.',
                    'SendGrid 이메일 서비스를 통해 문의 메시지를 기관 이메일로 직접 전송.',
                ],
            },
            detail3_title: {
                en: 'Result',
                ko: '결과',
            },
            detail3: {
                en: [
                    'The institute now has a fully functional, easy-to-manage website.',
                    'Staff can publish research articles without developer involvement.',
                    'Integrated SendGrid email service to send inquiries directly to the institute’s email inbox.',
                    'The website loads fast, is mobile friendly, and deploys automatically through Vercel.',
                    'Responsive layout for all sizes and devices.',
                ],
                ko: [
                    '관리자가 쉽게 관리할 수 있는 웹사이트를 구축.',
                    '개발자 참여 없이 글 등록, 관리 가능.',
                    'SendGrid 이메일 서비스를 통해 문의 메시지를 기관 이메일로 직접 전송.',
                    'Vercel을 통해 자동으로 배포됨.',
                    '모든 디바이스 사이즈 대응 반응형 레이아웃.',
                ],
            }
        },
    },
    {
        slug: 'myportfolio',
        title: {
            en: 'MyPortfolio',
            ko: '나의 포트폴리오',
        },
        desc: {
            duration: { start: '2024.11, 2025.09', end: '2025.11' },
            stack: {
                en: 'Vue2 / Nuxt / SCSS / javascript',
                ko: 'Vue2 / Nuxt / SCSS / 자바스크립트',
            },
        },
        tags: {
            work: {
                en: 'development',
                ko: '전체개발',
            },
            scope: {
                en: 'individual',
                ko: '개인',
            },
            env: {
                en: 'vue',
                ko: 'vue',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://github.com/Witsel-Blue/WitselBlue',
            target: '_blank',
            text: {
                en: 'view code',
                ko: '깃허브 코드 보기',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/myportfolio_thumb.png'),
            mainvisual: require('@/assets/img/projects/myportfolio_main.png'),
            mainvisual_mb: require('@/assets/img/projects/myportfolio_main_mb.png'),
            gif: require('@/assets/img/projects/myportfolio_gif.gif'),
            pc1: require('@/assets/img/projects/myportfolio_pc1.png'),
            pc2: require('@/assets/img/projects/myportfolio_pc2.png'),
            pc3: require('@/assets/img/projects/myportfolio_pc3.png'),
            mb1: require('@/assets/img/projects/myportfolio_mb1.png'),
            mb2: require('@/assets/img/projects/myportfolio_mb2.png'),
            mb3: require('@/assets/img/projects/myportfolio_mb3.png'),
        },
        content: {
            about: {
                en:  'This is a 2025 version portfolio site<br class="mb"> built with Vue and Nuxt. <br>Main idea is blank note and cards, <br>and both English and Korean<br class="mb"> are supported.<br>The full code is available on GitHub, <br class="mb">so check it out!',
                ko: 'vue와 nuxt로 구축한<br class="mb"> 2025년 버전 포트폴리오 사이트입니다.<br>전체적인 아이디어는 백지 노트와 카드이고, <br>영문, 한글 지원이 가능합니다. <br>GitHub에 전체 코드를 올려두었으니<br class="mb"> 확인해 보세요!',
            },
            detail1_title: {
                en: 'Requirements → What problems needed solving',
                ko: '요구사항 → 문제 해결 방법',
            },
            detail1: {
                en: [
                    'A portfolio that expresses technical identity with custom interactions & animations.',
                    'A CMS-free setup that still allows easy content expansion (projects, development, music).',
                    'A multilingual site (EN/KR) with smooth transitions.',
                    'High-performance animations without slowing down mobile devices.'
                ],
                ko: [
                    '맞춤형 인터랙션 및 애니메이션을 통해 기술적 정체성을 표현하는 포트폴리오',
                    'CMS 없이 쉽게 콘텐츠 확장(프로젝트, 개발, 음악) 가능한 설정.',
                    'EN/KR 언어 지원이 가능한 멀티 라이트 사이트.',
                    '모바일 기기 성능 저하 없이 높은 성능의 애니메이션 구현.',
                ],
            },
            detail2_title: {
                en: 'My work (Actions)',
                ko: '내 작업 (행동)',
            },
            detail2: {
                en: [
                    'Built the entire website with Vue + Nuxt, optimizing rendering and routing.',
                    'Developed 27+ reusable UI components for consistent and scalable structure.',
                    'Implemented Three.js, GSAP, p5.js, Lottie, AOS for rich interactive effects.',
                    'Designed and coded the Projects, Dev Archive, and Music Archive pages from scratch.',
                    'Created custom transition animations between pages.',
                    'Built responsive layouts for desktop, tablet, and mobile.',
                    'Added full bilingual support with language switching (EN ↔ KR).',
                    'Set up project deployment and asset optimization.',
                ],
                ko: [
                    'Vue와 Nuxt를 사용하여 전체 웹사이트 구축, 렌더링과 라우팅을 최적화.',
                    '27개 이상의 재사용 가능한 UI 컴포넌트를 개발하여 일관되고 확장 가능한 구조를 구축.',
                    'Three.js, GSAP, p5.js, Lottie, AOS를 사용하여 풍부한 인터랙티브 효과를 구현.',
                    '프로젝트, 개발, 음악 페이지를 처음부터 설계하고 개발.',
                    '페이지 간 커스텀 트랜지션 애니메이션을 생성.',
                    '데스크탑, 태블릿, 모바일 반응형 레이아웃을 구축.',
                    'EN ↔ KR 언어 전환 지원을 추가.',
                    '프로젝트 배포와 자산 최적화를 설정.',
                ],
            },
            detail3_title: {
                en: 'Result',
                ko: '결과',
            },
            detail3: {
                en: [
                    'A visually unique portfolio that highlights advanced front-end and interaction skills.',
                    'Modular components make future updates and content additions easy.',
                    'A polished, professional web presence supporting both Korean and international audiences.',
                ],
                ko: [
                    '기술적 정체성을 표현하는 시각적으로 독창적인 포트폴리오.',
                    '모듈화된 컴포넌트로 업데이트와 콘텐츠 추가가 쉬움.',
                    '영어, 한국어 모두 지원하는 정돈된 웹사이트.',
                ],
            }
        },
    },
    {
        slug: 'monimo',
        title: {
            en: 'Monimo',
            ko: '모니모',
        },
        desc: {
            duration: { start: '2024.07', end: '2024.10' },
            client: {
                en: 'Samsung',
                ko: '삼성',
            },
            agency: {
                en: 'Lisn',
                ko: '리즌디자인',
            },
            stack: {
                en: 'Vue2 / SCSS / javascript / Storybook',
                ko: 'Vue2 / SCSS / 자바스크립트 / 스토리북',
            },
        },
        tags: {
            work: {
                en: 'frontend',
                ko: '프론트엔드',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'vue',
                ko: 'vue',
            },
            platform: {
                en: 'app',
                ko: '앱',
            },
        },
        link: {
            href: 'https://www.monimo.com/w/main/WPFMHP0101M0',
            target: '_blank',
            text: {
                en: 'visit site',
                ko: '사이트 방문',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/monimo_thumb.png'),
            mainvisual: require('@/assets/img/projects/monimo_main.png'),
            mainvisual_mb: require('@/assets/img/projects/monimo_main_mb.png'),
            mb1: require('@/assets/img/projects/monimo_mb1.png'),
            mb2: require('@/assets/img/projects/monimo_mb2.png'),
            mb3: require('@/assets/img/projects/monimo_mb3.png'),
        },
        content: {
            about: {
                en: 'Financial Services app<br>planned by Samsung Life Insurance, <br class="mb">Fire Insurance and Samsung Card.<br> Developed under security system <br class="mb">in collaboration with multiple teams. <br>Managed & renewed all components and <br class="mb">1,400+ pages with 5 team memebers.<br class="mb"> Renewed the card main page.',
                ko: '삼성생명, 삼성화재, 삼성카드,<br class="mb"> 삼성증권에서 만든 금융 서비스 앱.<br> 여러 팀과 협력하여 <br class="mb">인터넷 사용 없이 보안 시스템 아래에서 개발.<br>5명의 팀원과 함께<br class="mb"> 모든 컴포넌트와 1400여개 페이지 관리 및 리뉴얼. <br>카드 메인 페이지 담당.',
            },
            detail1_title: {
                en: 'Requirements → What problems needed solving',
                ko: '요구사항 → 문제 해결 방법',
            },
            detail1: {
                en: [
                    'A stable, secure financial app required continuous updates with zero downtime.',
                    'The component system needed consistent maintenance across thousands of pages.',
                    'UI/UX renewal was needed for key pages (including the card main page).',
                    'Multiple teams (planning, design, QA, development) had to coordinate reliably.',
                ],
                ko: [
                    '안정적이고 보안된 금융 서비스 앱.',
                    '수천 개의 페이지에서 일관성이 필요한 컴포넌트 시스템.',
                    '카드 메인 페이지를 포함한 주요 페이지의 UI/UX 리뉴얼.',
                    '여러 팀(기획, 디자인, QA, 개발)과 함께 협력 필요.',
                ],
            },
            detail2_title: {
                en: 'My work (Actions)',
                ko: '내 작업 (행동)',
            },
            detail2: {
                en: [
                    'Renewed, maintained and refactored 1,400+ pages in a secure enterprise environment.',
                    'Updated and standardized shared UI components across the entire application.',
                    'Renewed the card main page, improving structure, styles, and performance.',
                    'Used Storybook to test, document, and validate component behavior.',
                    'Collaborated closely with planning, design, backend, and QA teams during weekly release cycles.',
                    'Ensured stable, bug-free updates under strict security and review pipelines.',
                ],
                ko: [
                    '인터넷 없는 보안 환경에서 1,400여 개의 페이지를 리뉴얼, 유지보수, 리팩토링.',
                    '전체 애플리케이션에서 공통 UI 컴포넌트를 업데이트하고 표준화.',
                    '카드 메인 페이지를 리뉴얼하여 구조, 스타일, 성능을 개선.',
                    'Storybook을 사용하여 컴포넌트 동작을 테스트, 문서화, 검증.',
                    '기획, 디자인, 백엔드, QA 팀과 함께 주기적인 릴리스 주기에서 밀접하게 협력.',
                    '엄격한 보안 및 검토 파이프라인 하에서 안정적이고 버그 없는 업데이트를 보장.',
                ],
            },
            detail3_title: {
                en: 'Result',
                ko: '결과',
            },
            detail3: {
                en: [
                    'Improved UI consistency across all pages and components.',
                    'Delivered stable updates with zero interruption for millions of users.',
                    'Helped streamline component usage, reducing duplicated code and maintenance cost.',
                    'Successfully renewed essential parts of the app, including the card main page.',
                ],
                ko: [
                    '모든 페이지와 컴포넌트에서 UI 일관성을 개선.',
                    '수백만 명의 사용자에게 안정적인 업데이트를 제공.',
                    '컴포넌트 사용을 단순화하여 중복 코드 감소와 유지보수 비용 절감.',
                    '카드 메인 페이지를 포함한 앱의 핵심 부분을 성공적으로 리뉴얼.',
                ],
            }
        }
    },
    {
        slug: '416',
        title: {
            en: '4·16 Online Memorial',
            ko: '4·16 온라인 기억공간',
        },
        desc: {
            duration: { start: '2022.04', },
            client: {
                en: '4·16 Foundation',
                ko: '4·16 재단',
            },
            agency: {
                en: 'SKNK',
                ko: '스컹크웍스 스튜디오'
            },
            stack: {
                en: 'HTML / CSS / jQuery / ScrollMagic',
                ko: 'HTML / CSS / jQuery / ScrollMagic',
            },
        },
        tags: {
            work: {
                en: 'publishing',
                ko: '퍼블리싱',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'vanila',
                ko: '바닐라',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://416foundation.org/%EC%98%A8%EB%9D%BC%EC%9D%B8-%EA%B8%B0%EC%96%B5-%EA%B3%B5%EA%B0%84',
            target: '_blank',
            text: {
                en: 'visit site',
                ko: '사이트 방문',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/416_thumb.png'),
            mainvisual: require('@/assets/img/projects/416_main.png'),
            pc1: require('@/assets/img/projects/416_pc1.png'),
            pc2: require('@/assets/img/projects/416_pc2.png'),
            pc3: require('@/assets/img/projects/416_pc3.png'),
            mb1: require('@/assets/img/projects/416_mb1.png'),
            mb2: require('@/assets/img/projects/416_mb2.png'),
            mb3: require('@/assets/img/projects/416_mb3.png'),
        },
        content: {
            about: {
                en: 'An online space <br class="mb">which can leave messages<br> commemorating the 10th anniversary of <br class="mb">the Sewol Ferry Disaster.<br> Main visuals implemented using libraries <br class="mb">like Scrollmagic and Tweenmax.',
                ko: '세월호참사 10주기를 기념하여<br class="mb"> 메세지를 남길 수 있는 공간<br> Scrollmagic, Tweenmax 등의<br class="mb"> 라이브러리를 이용하여 메인비주얼 구현',
            },

        },
    },
    {
        slug: 'dcamp',
        title: {
            en: 'DCAMP',
            ko: '디캠프',
        },
        desc: {
            duration: { start: '2022.01', end: '2022.03', },
            client: {
                en: 'Banks Foundation for Young Entrepreneurs',
                ko: '은행권청년창업재단',
            },
            agency: {
                en: 'SKNK',
                ko: '스컹크웍스 스튜디오'
            },
            stack: {
                en: 'Drupal9 / CSS / jQuery',
                ko: 'Drupal9 / CSS / jQuery',
            },
        },
        tags: {
            work: {
                en: 'frontend',
                ko: '프론트엔드',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'drupal',
                ko: 'drupal',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://dcamp.kr/',
            target: '_blank',
            text: {
                en: 'visit site',
                ko: '사이트 방문',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/dcamp_thumb.png'),
            mainvisual: require('@/assets/img/projects/dcamp_main.png'),
            pc1: require('@/assets/img/projects/dcamp_pc1.png'),
            pc2: require('@/assets/img/projects/dcamp_pc2.png'),
            pc3: require('@/assets/img/projects/dcamp_pc3.png'),
            mb1: require('@/assets/img/projects/dcamp_mb1.png'),
            mb2: require('@/assets/img/projects/dcamp_mb2.png'),
            mb3: require('@/assets/img/projects/dcamp_mb3.png'),
        },
        content: {
            about: {
                en: 'Banks Foundation for <br class="mb">Young Entrepreneurs, <br class="mb">DCAMP site renewal.<br>Responsible for the entire<br class="mb"> frontend of the site.<br>You can search and apply for <br class="mb">programs DCAMP provides.<br>English site and <br class="mb">personal membership window exists.',
                ko: '은행권청년창업재단 디캠프 사이트 리뉴얼.<br> 사이트 전체 프론트엔드 담당<br>디캠프가 제공하는 프로그램을<br class="mb"> 검색하고 신청할 수 있습니다.<br>영문사이트와 개인 멤버십<br class="mb"> 페이지가 따로 있습니다.',
            },
            detail1_title: {
                en: 'Requirements → What problems needed solving',
                ko: '요구사항 → 문제 해결 방법',
            },
            detail1: {
                en: [
                    'A full renewal of DCAMP’s website with modern, clean UI.',
                    'A front-end structure that works seamlessly with Drupal and its data structure.',
                    'Program search & application flow needed to be rebuilt for better usability.',
                    'English-language pages and personal membership features had to be integrated.',
                    'Mobile responsiveness and accessibility improvements were required.',
                ],
                ko: [
                    '모던하고 깔끔한 UI로 DCAMP 사이트 전체 리뉴얼.',
                    'Drupal과 데이터 구조와 원활하게 작동하는 프론트엔드 구조.',
                    '프로그램 검색 및 신청 흐름 재구축.',
                    '영문 페이지와 개인 멤버십 기능',
                    '모바일 반응형 및 접근성.',
                ],
            },
            detail2_title: {
                en: 'My work (Actions)',
                ko: '내 작업 (행동)',
            },
            detail2: {
                en: [
                    'Developed the full front-end for all major pages (home, programs, detail views, membership, English site).',
                    'Implemented program search, filter, and application interactions using HTML/CSS/jQuery.',
                    'Built layouts and UI components compatible with Drupal templates and data output.',
                    'Implemented responsive layouts for desktop → tablet → mobile.',
                    'Coordinated with backend/Drupal developers to integrate views, forms, and user flows.',
                    'Ensured cross-browser compatibility and stable behavior across all pages.'
                ],
                ko: [
                    '홈, 프로그램, 상세 뷰, 멤버십, 영문 사이트 등 모든 주요 페이지의 전체 프론트엔드 개발.',
                    'HTML/CSS/jQuery를 사용하여 프로그램 검색, 필터, 신청 인터랙션 구현.',
                    'Drupal 템플릿과 데이터 출력과 호환되는 레이아웃과 UI 컴포넌트 구축.',
                    '데스크탑 → 태블릿 → 모바일 반응형 레이아웃 구축.',
                    '백엔드/Drupal 개발자와 함께 뷰, 폼, 사용자 흐름 통합.',
                    '모든 페이지에서 크로스 브라우저 호환성과 안정적인 동작 보장.',
                ],
            },
            detail3_title: {
                en: 'Result',
                ko: '결과',
            },
            detail3: {
                en: [
                    'A modern, fully responsive DCAMP website used by thousands of startup founders.',
                    'Improved search & application flow increased usability for program participation.',
                    'English support expanded accessibility for international users.',
                    'Provided a consistent front-end architecture compatible with Drupal’s backend system.',
                ],
                ko: [
                    '수천 명의 창업가들이 사용하는 모던한 반응형 사이트.',
                    '프로그램 참여 사용성을 개선하여 프로그램 검색 및 신청 흐름 개선.',
                    '영문 지원으로 국제 사용자 접근성 확대.',
                    'Drupal의 백엔드 시스템과 호환되는 일관된 프론트엔드 구조 제공.',
                ],
            }
        },
    },
    {
        slug: 'dcdc',
        title: {
            en: 'DCDC',
            ko: '전문무용수지원센터',
        },
        desc: {
            duration: { start: '2021.11', end: '2021.12', },
            client: {
                en: 'Dancers Career Development Center',
                ko: '전문무용수지원센터',
            },
            agency: {
                en: 'SKNK',
                ko: '스컹크웍스 스튜디오'
            },
            stack: {
                en: 'Drupal9 / CSS / jQuery',
                ko: 'Drupal9 / CSS / jQuery',
            },
        },
        tags: {
            work: {
                en: 'frontend',
                ko: '프론트엔드',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'drupal',
                ko: 'drupal',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://www.dcdcenter.or.kr/',
            target: '_blank',
            text: {
                en: 'visit site',
                ko: '사이트 방문',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/dcdc_thumb.png'),
            mainvisual: require('@/assets/img/projects/dcdc_main.png'),
            pc1: require('@/assets/img/projects/dcdc_pc1.png'),
            pc2: require('@/assets/img/projects/dcdc_pc2.png'),
            pc3: require('@/assets/img/projects/dcdc_pc3.png'),
            mb1: require('@/assets/img/projects/dcdc_mb1.png'),
            mb2: require('@/assets/img/projects/dcdc_mb2.png'),
            mb3: require('@/assets/img/projects/dcdc_mb3.png'),
        },
        content: {
            about: {
                en: 'The site operates various support<br class="mb"> programs helping dance artists.<br>You can apply support programs<br class="mb"> for health improvement <br class="mb">or career transition.<br>Checking latest news,<br class="mb"> donation functioning are also possible.',
                ko: '무용예술인의 직업전환과 복지증진을 목표로<br class="mb"> 다양한 지원사업을 운영하고 있는 사이트.<br> 사이트 내에서 다양한 지원을 신청할 수 있고,<br class="mb">  소식을 확인할 수 있습니다.<br> 후원기능이 있고, 간단한 <br class="mb">영문 페이지가 따로 존재합니다.', 
            },
            detail1_title: {
                en: 'Requirements → What problems needed solving',
                ko: '요구사항 → 문제 해결 방법',
            },
            detail1: {
                en: [
                    'A modern, accessible, and responsive website to support dancers nationwide.',
                    'A clean UI for browsing support programs and submitting application',
                    'Integration with Drupal’s backend structure and data flow.',
                    'A clear donation flow and up-to-date news section.',
                    'Mobile-friendly layouts for dancers using phones/tablets.',
                ],
                ko: [
                    '전국 무용예술인을 지원하는 모던하고 접근성이 뛰어난 반응형 사이트.',
                    '프로그램 조회 및 신청을 위한 깔끔한 UI.',
                    'Drupal의 백엔드 구조와 데이터 흐름 통합.',
                    '후원 흐름과 최신 뉴스 섹션.',
                    '모바일 사용자를 위한 반응형 레이아웃.',
                ],
            },
            detail2_title: {
                en: 'My work (Actions)',
                ko: '내 작업 (행동)',
            },
            detail2: {
                en: [
                    'Developed the complete front-end for all main user flows (program list, detail pages, applications, donations, news).',
                    'Built UI components compatible with Drupal’s templating system.',
                    'Implemented user-friendly application forms and content browsing using jQuery.',
                    'Designed responsive layouts optimized for mobile-first usage.',
                    'Ensured stable interaction behavior and cross-browser compatibility.',
                ],
                ko: [
                    '프로그램 목록, 상세 페이지, 신청, 기부, 뉴스 등 모든 페이지 전체 프론트엔드 개발.',
                    'Drupal의 템플릿 시스템과 호환되는 UI 컴포넌트 구축.',
                    'jQuery를 사용하여 사용자 친화적인 신청 폼과 콘텐츠 조회 구현.',
                    '모바일 사용자를 위한 반응형 레이아웃 설계.',
                    '안정적인 인터랙션 동작과 크로스 브라우저 호환성 보장.',
                ],
            },
            detail3_title: {
                en: 'Result',
                ko: '결과',
            },
            detail3: {
                en: [
                    'A reliable, accessible website supporting thousands of dancers across the country.',
                    'Seamless UI for application submission improved participation rates.',
                    'Clean redesign of content sections (news, programs, donation).',
                    'Mobile optimization significantly improved usability for a wide range of users.',
                ],
                ko: [
                    '전국 무용예술인을 지원하는 신뢰할 수 있는 접근성이 뛰어난 사이트.',
                    '신청 제출 UI를 개선하여 참여율 증가.',
                    '뉴스, 프로그램, 기부 콘텐츠 섹션 깔끔한 리뉴얼.',
                    '모바일 최적화로 다양한 사용자 접근성 향상.',
                ],
            }
        },
    },
    {
        slug: 'kace',
        title: {
            en: 'KACE',
            ko: 'KACE',
        },
        desc: {
            duration: { start: '2021.09', end: '2021.10', },
            client: {
                en: 'Korea Association for Community Education',
                ko: '한국지역사회교육협의회연합',
            },
            agency: {
                en: 'SKNK',
                ko: '스컹크웍스 스튜디오'
            },
            stack: {
                en: 'Drupal9 / CSS / jQuery',
                ko: 'Drupal9 / CSS / jQuery',
            },
        },
        tags: {
            work: {
                en: 'frontend',
                ko: '프론트엔드',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'drupal',
                ko: 'drupal',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://ukace.or.kr/',
            target: '_blank',
            text: {
                en: 'visit site',
                ko: '사이트 방문',
            },
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
            about: {
                en: 'KACE site renewal.<br>The site provides training experts in<br class="mb"> community education research<br>and applying services for<br class="mb"> community programs.',
                ko: 'KACE 사이트 리뉴얼.<br>지역사회교육에 관한 조사연구 전문가 양성과<br> 다양한 교육공동체 프로그램을<br class="mb"> 신청할 수 있는 서비스를 제공합니다.',
            },
            // detail: [
            //     '홈 화면 호버 이벤트가 있는 배너 구현',
            //     'Developed banner at home screen with hover events',
            //     'Responsible sliders at home scren made with Slick.js'
            // ]
        },
    },
    {
        slug: 'rnjob',
        title: {
            en: 'RNJOB',
            ko: 'RNJOB',
        },
        desc: {
            duration: { start: '2021.07', end: '', },
            client: {
                en: 'Korean Nursing Association',
                ko: '대한간호협회',
            },
            agency: {
                en: 'SKNK',
                ko: '스컹크웍스 스튜디오'
            },
            stack: {
                en: 'HTML / CSS / jQuery',
                ko: 'HTML / CSS / jQuery',
            },
        },
        tags: {
            work: {
                en: 'publishing',
                ko: '퍼블리싱',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'drupal',
                ko: 'drupal',
            },
            platform: {
                en: 'app',
                ko: '앱',
            },
        },
        link: {
            href: 'https://play.google.com/store/apps/details?id=kr.or.rnjob.recruit&hl=uz',
            target: '_blank',
            text: {
                en: 'google play',
                ko: '구글 플레이',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/rnjob_thumb.png'),
            mainvisual: require('@/assets/img/projects/rnjob_main.png'),
            mainvisual_mb: require('@/assets/img/projects/rnjob_main_mb.png'),
            pc1: '',
            mb1: require('@/assets/img/projects/rnjob_mb1.png'),
            mb2: require('@/assets/img/projects/rnjob_mb2.png'),
            mb3: require('@/assets/img/projects/rnjob_mb3.png'),
        },
        content: {
            about: {
                en: 'App version of the <br class="mb">RNJOB website providing<br>training, employment counseling <br class="mb">for nursing staffs.<br>You can access information about <br class="mb">hospitals and institutions.',
                ko: '간호인력의 교육, 취업, 상담을 지원·관리하는<br>RNJOB 웹사이트의 앱 버전입니다.<br>병원이나 기관의 정보 열람, <br class="mb">채용정보를 확인할 수 있습니다.',
            },
        },
    },
    {
        slug: 'oxfam',
        title: {
            en: 'Oxfam Virtual Walker',
            ko: '옥스팜 버추얼 워커',
        },
        desc: {
            duration: { start: '2021.08', end: '2021.09', },
            client: {
                en: 'Oxfam Korea',
                ko: '옥스팜코리아',
            },
            agency: {
                en: 'SKNK',
                ko: '스컹크웍스 스튜디오'
            },
            stack: {
                en: 'Drupal9 / CSS / jQuery',
                ko: 'Drupal9 / CSS / jQuery',
            },
        },
        tags: {
            work: {
                en: 'frontend',
                ko: '프론트엔드',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'drupal',
                ko: 'drupal',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://v50.oxfamtrailwalker.or.kr/',
            target: '_blank',
            text: {
                en: 'visit site',
                ko: '사이트 방문',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/oxfam_thumb.png'),
            mainvisual: require('@/assets/img/projects/oxfam_main.png'),
            mainvisual_mb: require('@/assets/img/projects/oxfam_main_mb.png'),
            pc1: require('@/assets/img/projects/oxfam_pc1.png'),
            pc2: require('@/assets/img/projects/oxfam_pc2.png'),
            pc3: require('@/assets/img/projects/oxfam_pc3.png'),
            mb1: require('@/assets/img/projects/oxfam_mb1.png'),
            mb2: require('@/assets/img/projects/oxfam_mb2.png'),
            mb3: require('@/assets/img/projects/oxfam_mb3.png'),
        },
        content: {
            about: {
                en: 'An introduction and registeration site <br class="mb">for walking donation event<br> sponsored by Oxfam Korea.<br>Scroll animation with SVG <br class="mb">at home scren.<br>Team stamps are awarded based on <br class="mb">mission completion.',
                ko: '옥스팜코리아에서 주최한 걷기 기부<br class="mb"> 소개 및 참가신청 사이트.<br> 스크롤에 따라 SVG 라인이 그려지는<br class="mb"> 애니메이션 구현.<br>미션에 따라 팀의 스탬프가 인증됩니다.',
            },
            // detail: [
            //     '이미지형 폰트를 반응형으로 사용',
            // ]
        },
    },
    {
        slug: 'cabinnet',
        title: {
            en: 'Cabin.net',
            ko: '캐빈닷넷',
        },
        desc: {
            duration: { start: '2021.05', end: '2021.07', },
            client: {
                en: 'Seoul Social Economy Center',
                ko: '서울특별시 사회적경제지원센터',
            },
            agency: {
                en: 'SKNK',
                ko: '스컹크웍스 스튜디오'
            },
            stack: {
                en: 'Drupal9 / CSS / jQuery',
                ko: 'Drupal9 / CSS / jQuery',
            },
        },
        tags: {
            work: {
                en: 'frontend',
                ko: '프론트엔드',
            },
            scope: {
                en: 'teamwork',
                ko: '팀워크',
            },
            env: {
                en: 'drupal',
                ko: 'drupal',
            },
            platform: {
                en: 'web',
                ko: '웹',
            },
        },
        link: {
            href: 'https://sehub.net/archives/2076582',
            target: '_blank',
            text: {
                en: 'related link',
                ko: '관련 공지링크',
            },
        },
        images: {
            thumb: require('@/assets/img/projects/cabinnet_thumb.png'),
            mainvisual: require('@/assets/img/projects/cabinnet_main.png'),
            pc1: '',
            mb1: '',
        },
        content: {
            about: {
                en: 'Content platform <br class="mb">where personal preferences <br class="mb">and product stories meet.<br>The site introduces social economy <br class="mb">products and brands.<br>Developed in blog format providing <br class="mb">easy writing system for site operators.',
                ko: '나의 취향과 상품의 스토리가<br class="mb"> 만나는 콘텐츠 플랫폼으로,<br> 세상을 바꾸는 실험과 시도가 담긴<br class="mb"> 사회적경제의 상품과 브랜드를 소개.<br> 블로그 형식으로 운영에서 쉽게<br class="mb"> 글을 작성할 수 있도록 개발.<br>관리자가 더 편하게 글을 쓸 수 있도록<br class="mb"> 가이드 페이지를 따로 제작했습니다.',
            },
        },
    },
]