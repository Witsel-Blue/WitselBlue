export default {
    intro: {
        textTyping: '안녕, 세상아',
    },
    gnb: {
        home: '홈',
        projects: '프로젝트',
        archive: '아카이브',
    },
    home: {
        mainSub: '프론트엔드 개발자',
        mainTitle: '비첼블루',
        profileParagraphs: [
            '안녕하세요,<br class="mb"> 프론트엔드 개발자 <span class="mouse-hover1 ko"><b>비첼블루</b></span>입니다.',
            '<span class="mouse-hover1 ko">인터렉티브</span>한 디자인과 개발에 관심을 두고',
            '확장가능성 있는 <span class="mouse-hover1 ko">클린코딩</span>을 하려고 합니다.',
            '다양한 방법으로 사용자가 <span class="mouse-hover1 ko">경험</span>할 수 있는',
            '사이트를 만드는 <br class="mb"><span class="mouse-hover1 ko"><b>웹 공간 설계자</b></span>가 제 목표입니다.',
        ],
        subTitle_skills: '기술 스택',
        subTitle_history: '히스토리',
    },
    history: {
        triggers: [
            { 
                id: 1, 
                title: '성신여대 졸업',
                text: '글로벌의과학과(Global Medical Science) 졸업',
            },
            { 
                id: 2, 
                title: '음악 프로듀싱',
                text: '전자음악 프로듀싱, 믹스셋 제작, 크루 활동',
            },
            { 
                id: 3, 
                title: 'SBS 아카데미 웹디자인 수료',
                text: '기획, 디자인, 퍼블리싱 등 웹 개발 전반 공부',
            },
            { 
                id: 4, 
                title: '스컹크웍스 스튜디오',
                text: '스타트업 웹에이전시 회사에서 프론트엔드 개발자로 활동',
            },
            { 
                id: 5, 
                title: '인터렉티브 개발자 준비',
                text: 'touchdesigner, three.js, p5.js 등 공부',
            },
            { 
                id: 6, 
                title: '리즌디자인',
                text: '삼성카드 모니모 앱개발 참여'
            },
            { 
                id: 7, 
                title: '프리랜스 개인 작업 및 공부',
                text: '담곤 연구소 홈페이지, 포트폴리오 작업 및 python, typescript 등 공부',
            }
        ],
        triggers_mb: [
            { 
                id: 1, 
                title: '성신여대',
                text: '글로벌의과학과 졸업',
            },
            { 
                id: 2, 
                title: '음악 프로듀싱',
                text: '전자음악 프로듀싱, 믹스셋 제작, 크루 활동',
            },
            { 
                id: 3, 
                title: 'SBS 아카데미 웹디자인',
                text: '기획, 디자인, 퍼블리싱 등 웹 개발 전반 공부',
            },
            { 
                id: 4, 
                title: '스컹크웍스 스튜디오',
                text: '스타트업 웹에이전시 회사에서 프론트엔드 개발자로 활동',
            },
            { 
                id: 5, 
                title: '인터렉티브 개발',
                text: 'touchdesigner, three.js, p5.js 등 공부',
            },
            { 
                id: 6, 
                title: '리즌디자인',
                text: '삼성카드 모니모 앱개발 참여'
            },
            { 
                id: 7, 
                title: '개인 작업 및 공부',
                text: '담곤 연구소 홈페이지, 포트폴리오 등 작업 및 python, typescript 등 공부',
            }
        ]
    },
    randomSkillCards: {
        categories: ['프레임워크', '라이브러리', '언어', '디자인', '작업환경'],
        def: [
            '할 수 있어요',
            '잘 합니다',
            '통달!',
        ],
    },
    footer: {
        lists: {
            btn1: '메일 보내기',
            btn2: '이력서 보기',
        },
        subLists: {
            btn1: '깃허브',
            btn2: '링크드인',
            btn3: '오픈 카카오톡',
        },
    },
    detailFooter: {
        'projects': '모든 프로젝트 보기',
        'dev': '모든 개발 보기',
        'music': '모든 음악 보기',
    },
    pager: {
        paragraphs: [
            '클릭해서',
            '맨 위로 스크롤',
        ],
    },
    projects: {
        title: '프로젝트',
        sortBy: '필터 분류',
        tabs: {
            'all': '전체',
            'work': '개발범위',
            'env': '개발환경',
            'scope': '참여도',
            'platform': '플랫폼',
        }
    },
    archive: {
        title: '아카이브',
    },
    archive_dev: {
        title: '개발',
        tabs: {
            'all': '전체',
            'p5.js': 'p5.js',
            'pixi.js': 'pixi.js',
            'three.js': 'three.js',
        }
    },
    archive_music: {
        title: '음악',
        tabs: {
            'all': '전체',
            'producing': '프로듀싱',
            'mixset': '믹스셋',
        }
    }
}