import { SkillListing, PeerProfile, SessionItem, ExchangeInquiry, UserSkillItem } from '../types';

export const currentUser = {
  name: 'Elena Rostova',
  role: 'Senior Frontend Lead',
  title: 'Exchange Pioneer',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqYkvUVDx90OoMqyUCT73GI1Co1tq7PlgE8pCbafW-s5bhJ7c_l2JIs92y7OpPo1VYBymEAJWQa9P2De8Q_0VeLughqetvKz0BkfXlQfsuI1vHcEO2xvqTBxAu87yMK_ss4Xteq1Js6WYUgBfPqCK2oo-xqYSwdy9QU0kJiLmqrQcvpYwOZFlGscV8UXFDIXd20j9E-ODfY45xbgYfh7QGd4fE22ZaAgDuzMFFdXbQnnmd3jDukoA',
  trustScore: 98,
  timeSwappedHours: 38,
  activePeers: 5,
  skillsOffered: 3,
  skillsLearning: 2,
  sessionsDone: 19,
  peerRating: 4.95,
  availableThisWeek: true,
};

export const initialSkillListings: SkillListing[] = [
  {
    id: 'skill-1',
    authorName: 'Elena Rostova',
    authorRole: 'Senior Frontend Lead',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxMNrTaRFbBT66EiRDqLQiokn1_8jlOvL3R_yAAFQMAUn411-wY1n3mhMKv5Eu09NbH0ZQcDV78LrhtQ_0ZpKKyqkeBeevpMaL_c5x0dbVn8Gqd-SFJd4sHS-jHSsRDgszwxBeau5NPcD7DbyY14mbG3NyjrvkXfBmaZ2EUXuXPy-eluEf59O_syxLKNZR2H_mu2IHmZBcfMxCk-At2pQyiw84JHlWKgTAuTauBh4P0ryqMyeb8Xs',
    rating: 4.9,
    swapsCount: 24,
    verified: true,
    tierBadge: 'Intermediate',
    tierBadgeBg: 'bg-primary-fixed text-on-primary-fixed-variant',
    teaches: 'Modern React & TypeScript Architecture',
    wants: 'Conversational Italian & Pronunciation',
    ratioLabel: '1:1 Mutual Exchange',
    hoursPerWeek: '1 hr / week',
    cycleWeeks: '4-week cycle',
    formatBadge: '1:1 Video Call',
    category: 'tech',
    curriculum: {
      sessions: [
        { num: 1, title: 'Session 1: Strict Types & Custom Hooks', description: 'Eliminating runtime crashes, creating declarative state engines.' },
        { num: 2, title: 'Session 2: Performance Profiling & Hydration', description: 'Preventing re-render waterfalls, tree-shaking patterns.' },
        { num: 3, title: 'Session 3: Design Tokens & Component Encapsulation', description: 'Building a production component library with variant props.' },
        { num: 4, title: 'Session 4: Architecture Review & Testing', description: 'Comprehensive code review and production deployment sign-off.' }
      ],
      prerequisites: 'Basic JavaScript (ES6+), fundamental HTML/CSS',
      mutualDeliverable: '1 Shipped Mini-Project + Code Review Sign-off'
    }
  },
  {
    id: 'skill-2',
    authorName: 'Kenji Takahashi',
    authorRole: 'Design Systems Architect',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi9a3oDf26lGVFZU0YfEdf282taP7MkaxgL6dRoBuMczdz1eUmTeacPz9gTHIn9NSsJsQrdrJRuZvDHNLH0OjWga2yk5Q38IIIsgjaSLoxTASf9mtReGY2G6YvRw3vKeKd_Z4oTPQFrSrGE9Tg7WOCXrpyE7r4pKytCPZ-i7rvijiaOVifhqCaMPNwCyhq4aLYjADWxNpe6mQm4sH3AJxPjrbvBddr5Hu-u8_t2xemq5nPgfW82yc',
    rating: 5.0,
    swapsCount: 18,
    verified: true,
    tierBadge: 'Master',
    tierBadgeBg: 'bg-tertiary-fixed text-on-tertiary-fixed',
    teaches: 'Design Systems & Figma Component Mastery',
    wants: 'B2B SaaS Growth & GTM Positioning',
    ratioLabel: '1:1 Mutual Exchange',
    hoursPerWeek: '2 hrs / week',
    cycleWeeks: 'Bi-weekly review',
    formatBadge: 'Async Video Critiques',
    category: 'creative',
    curriculum: {
      sessions: [
        { num: 1, title: 'Session 1: Figma Variables & Semantic Token Architecture', description: 'Multi-brand token sets, light/dark mode logic and binding.' },
        { num: 2, title: 'Session 2: Dynamic Auto-layout & Complex Nesting', description: 'Building bulletproof responsive components without breakage.' },
        { num: 3, title: 'Session 3: Component Slot Patterns & Properties', description: 'Advanced variants, boolean props, and instance swap tricks.' }
      ],
      prerequisites: 'Figma intermediate familiarity, basic UI layouts',
      mutualDeliverable: 'Complete verified token library + handoff document'
    }
  },
  {
    id: 'skill-3',
    authorName: 'Mateo Silva',
    authorRole: 'Concert Guitarist & Educator',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpEqpkXnnphGckSsuyc-tS5SO-rW7M3ewnsTYxYZvBtOT5gI0le7t7kRZZ4XmFcuUwqjHKb8BB_oe2g81gLhVrwJIkC6scaxQfUykLghXDqn5uXk7BmjY2eQ1K9SO-NBf_ZSFrF_V9aEvglwkYL8oe5CGE0SsocJMKnmyiJgU3RtjxrH9t4tfgncq-nfDhKPNyfgrvZtoXhPC4p4I_H9uDlN7N0o_xcaFhieTnN0WBDsRzMQ7yB_M',
    rating: 4.8,
    swapsCount: 31,
    verified: true,
    tierBadge: 'Beginner Friendly',
    tierBadgeBg: 'bg-secondary-container text-on-secondary-container',
    teaches: 'Fingerstyle Acoustic Guitar & Chord Voicings',
    wants: 'Audio Editing & Podcast Mastering (Logic Pro)',
    ratioLabel: '1:1 Mutual Exchange',
    hoursPerWeek: '1.5 hrs / week',
    formatBadge: 'Live Jam Practice',
    category: 'music',
    curriculum: {
      sessions: [
        { num: 1, title: 'Session 1: Travis Picking & Thumb Independence', description: 'Developing relaxed right-hand groove and steady alternating bass.' },
        { num: 2, title: 'Session 2: Open Tunings (DADGAD) & Modal Harmonies', description: 'Rich acoustic soundscapes and Celtic/folk chord voicings.' },
        { num: 3, title: 'Session 3: Dynamic Phrasing & Natural Harmonics', description: 'Expressive touch, percussive slaps, and clean bell harmonics.' }
      ],
      prerequisites: 'Basic acoustic guitar, tuning ability, basic open chords',
      mutualDeliverable: '1 Recorded instrumental song duet + audio critique'
    }
  },
  {
    id: 'skill-4',
    authorName: 'Julian Morales',
    authorRole: 'Concert Guitarist & Composer',
    authorAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGlvAi8kZKsN2Xbzp3xZ1NuUypqlbAPDHT9qrvhKZsOMqYvQVJdoJiewJL5ahEbflrLxPsYO6zc89fTi65QMsDQdMaQOho1H5xT_WAFkD8EUO8oP8l22412xL6CO9DC0gg6TsQQ3ZWXqUh_upiA6zJGnycduhXN-lpDxWXu7znBgc1-sx7G3q7UesHeswJswdSq5ZXBKvgKKc7MjcIzmJNFDQZNzRKSt1cIlM4inYBv0GBhxEIuuk',
    rating: 4.9,
    swapsCount: 42,
    verified: true,
    tierBadge: 'Intermediate',
    tierBadgeBg: 'bg-primary-fixed text-on-primary-fixed-variant',
    teaches: 'Classical & Flamenco Guitar Technique',
    wants: 'SEO & Technical Website Audit',
    ratioLabel: 'Direct 1:1',
    hoursPerWeek: '1 hr / week',
    formatBadge: '1:1 Video Call',
    category: 'music',
    curriculum: {
      sessions: [
        { num: 1, title: 'Session 1: Rasgueado & Picado Mechanics', description: 'Finger placement, tone production, and velocity exercises.' },
        { num: 2, title: 'Session 2: Compás & Flamenco Rhythm Cycles', description: 'Understanding Soleá and Bulerías timing structures.' }
      ],
      prerequisites: 'Nylon string classical guitar, willingness to drill technique',
      mutualDeliverable: 'Mastery of a traditional flamenco falseta'
    }
  }
];

export const mockPeerProfiles: PeerProfile[] = [
  {
    id: 'elena',
    name: 'Elena Vance',
    badge: 'Pro',
    verified: true,
    role: 'Staff Product Designer',
    company: 'FinCorp',
    location: 'Berlin (UTC+1)',
    timezone: 'UTC+1',
    availability: 'Available Sat',
    mutualMatchPct: 98,
    rating: 4.95,
    swapsCount: 31,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBiC7FCA0Bj4QwGnU9OD1KdSSMqS3t2_UtTbnDR_buOnQtp4OwT7U7DJar0T_6T70HLeglDGr2m_saQyTgc_naw7vUhdWnKyMCCubBEzTWOzHigYisXtaTdjdCPOn9MsJ5T75vdWrmUqIzZ9Vv4NKslnHm1FuKgJRSj6AgyU9c2rvqjh4WjyJrsuVHQmZgy31ZrpObvdbBQcGSoYihTYxp7Xg9kNHuutucqv_xExT5-SS8Ou0tyCU0',
    offers: ['Figma Tokens', 'Design Systems', 'Design Handoff'],
    wants: ['Python Data Analysis', 'Pandas', 'Jupyter Workflows'],
    bio: '"I believe design systems should bridge engineers and creatives seamlessly. I\'m patient with code beginners, and I want an exchange partner who enjoys breaking down algorithmic problem-solving step by step."',
    verifiedCredential: {
      title: 'Design Tokens 2.0 Certified',
      issuer: 'Figma Guild Official'
    },
    testimonial: {
      peerName: 'Julian K. (Traded for React Hooks)',
      tradedFor: '1:1 Hour Swapped',
      quote: '"Elena demystified Figma variable modes in 40 minutes. I helped her set up a Flask endpoint in return. Flawless exchange!"'
    }
  },
  {
    id: 'tariq',
    name: 'Tariq Mansour',
    badge: 'Verified',
    verified: true,
    role: 'Senior Engineer',
    company: 'CloudBase',
    location: 'London (UTC+0)',
    timezone: 'UTC+0',
    availability: 'Weekday eves',
    mutualMatchPct: 94,
    rating: 4.89,
    swapsCount: 19,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCvszd_QyZDOFuEQZWUwtGZN1SIJXFom_cngY-N8pMRLceKQjvuln9xBmmPVDnOiy4HgbSQHQnXYeXjL2I3pO3PjUOSDqb2jz2UHa-mYaBqJGDjUx7F6jEQY89XcHuVZegxwtfdYSOLPtogBEOF62nYPsHJeA-HdusDr48I_qb4GyOaeOhBzVys0lIU9trAKNfik16GBWyJYd6e8gHcF6TsNHtIHlHej9CwEcPRIPrAXkQP5N4rbgc',
    offers: ['FastAPI Architecture', 'Dockerization', 'CI/CD Pipelines'],
    wants: ['UX Prototyping', 'User Testing', 'Figma Wireframing'],
    bio: '"Building infrastructure shouldn\'t be intimidating. I offer clean mental models for Docker, async queues, and APIs. Looking to level up my UX validation to make my open-source tools friendlier."',
    verifiedCredential: {
      title: 'Certified Kubernetes Administrator (CKA)',
      issuer: 'Linux Foundation'
    },
    testimonial: {
      peerName: 'Maya L. (Traded for Usability Testing)',
      tradedFor: '2h Exchange',
      quote: '"Tariq explained Docker networking in 20 minutes better than 10 documentation pages. Clear, patient, and methodical."'
    }
  },
  {
    id: 'maya',
    name: 'Maya Lin',
    badge: 'Mentor',
    verified: true,
    role: 'Lead UX Researcher',
    company: 'HealthScale',
    location: 'Amsterdam (UTC+1)',
    timezone: 'UTC+1',
    availability: 'Instant Match',
    mutualMatchPct: 91,
    rating: 5.0,
    swapsCount: 27,
    avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf3eKkhXS9LqrZ5DKojtYMNZSMJYPQ1ovw2GyDFNhLR08XS8I6_hJEvJv4v9ehkXk9FRnMQ1TP4bpWclBe4sTTT4wQZTMF2B7Ghg8Q0wzz0SXrhWRJq4rttA6w2B3InUbLTe7AJYn64DOGgc8alBEEBgCfvssEJHzZKv3PHX_HgDGJMzcgxEoaI6CMQWooeIMFMFA1o-XA1LrVt9gubjHA-NZ24c6wm08E5QlI4qFqqcx1NK2xC20',
    offers: ['Usability Testing', 'Journey Mapping', 'User Interviews'],
    wants: ['SQL for Analytics', 'Dashboarding', 'PostgreSQL Basics'],
    bio: '"Qualitative research is a superpower. I\'ll teach you how to write interview scripts that avoid bias. In return, I want to conquer SQL subqueries and automate my own dashboard pipelines!"',
    verifiedCredential: {
      title: 'Human-Centered Research Fellow',
      issuer: 'MIT Media Lab'
    },
    testimonial: {
      peerName: 'Sven B. (Traded for PostgreSQL Queries)',
      tradedFor: '1:1 Hour Swapped',
      quote: '"Her user interview cheat sheet transformed our discovery calls. Highly recommended trade partner!"'
    }
  }
];

export const initialSessions: SessionItem[] = [
  {
    id: 'session-liam',
    peerName: 'Liam Vance',
    peerRole: 'Senior Product Designer @ Neobank',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASk3KxJaOcZGvpeQZ0LcBnfFe3sg_EnaDJBgJ-Jcl3BpH1Bzr4O_pi2OKhEUXZcMj5FNF6C6iD3lVKAiPb6wDQN4rNqKP9MNQ6wdPt6pfwDg83tTu4Tr4bdFelPx8k-SGTYZzWN3kQ7KZMXBuBlzG8eGhmEzvUi9zCYVQQHMkpxWvwZwzlJ6VcqKg0BcApQXpKTpJQfP_to9eBGc7yJv_mE1Nc_1U8JtIcsigchHfv6kueYB_wb60',
    verified: true,
    timeLabel: 'Today • 15:00',
    status: 'starting-soon',
    youTeach: 'UX Research',
    peerTeaches: 'German Basics',
    teachMins: 45,
    peerMins: 45,
    note: 'Agenda: 45m qualitative research synthesis + 45m German conversation drills.'
  },
  {
    id: 'session-chloe',
    peerName: 'Chloe Chen',
    peerRole: 'Tech Founder & Mobile Architect',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWag059AbfWK49fMEWnb3iwBYks4G2hiPqNHiRPsWWLvj2_zo8tRZ99P3TW8bCD0fgdg7X5mDo8-4oJYwphVOJLH4zvk4QSSObpypSOOGmQpWlDokgmrriG5mVufl_MdFgCxHKdjfI4nisSdtdqw0PyEX5BQ-1EuzJ6UcvO6PfeZG__bocoslTQ2wFGQM_98W0UlAkc1VvqWlSRJ9yWxOmoIU7I8lGCKPFVpX0nzBx9CaqgCTRHW8',
    verified: true,
    timeLabel: '17:30 – 19:00 (90 min total)',
    dateGroup: 'Thursday, Oct 24',
    status: 'confirmed',
    youTeach: 'Design Systems',
    peerTeaches: 'React Native',
    teachMins: 45,
    peerMins: 45
  },
  {
    id: 'session-marcus',
    peerName: 'Marcus Thorne',
    peerRole: 'Audio Engineer & Sound Designer',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDTJlFIoJLodsNxNP9sRPQ7WaFoEMRLqXQcT0hgpnHeflHbQPkCNL7FzvYUeXgcPHS85X8lFXuuXY__JgjyFpKWiP9LNIvFigBy9ydJwFBa9x4sNoCT-VdH2Dtg0rETpFEtC8bWsY73FoY_o2iC0urUAgu8GGsmQNcTCjCqIS9y1pSAUmC4v2rt1DTTyzCJpMASfojS9AmJMtkRvBRGVF-2vWELZ7lxuFS0q17op3WFQAXNrTi0fpk',
    verified: true,
    timeLabel: '11:00 – 12:00 (60 min total)',
    dateGroup: 'Monday, Oct 28',
    status: 'needs-rescheduling',
    youTeach: 'SEO Strategy',
    peerTeaches: 'Podcast Audio',
    teachMins: 30,
    peerMins: 30,
    note: 'Marcus requested a 30m shift due to studio booking overlap.'
  }
];

export const initialPendingRequests: SessionItem[] = [
  {
    id: 'pending-elena',
    peerName: 'Elena Rostova',
    peerRole: 'Senior Frontend Lead',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzLf_34q9bLcL0uIu4mXfL_tZWlebpPLOYN9dD3wCIypf2GekFZYNnCL5WAuPyPr3tXUYf4aVa18muJDDmqnhM394HtPKIXa38q3dhlCNHXy2FcKbAw6gHhwcs-xKBPwuhv4oS6HWOeNigGhFf67a6hf1c0XxlD6MNjZzY4yToT5PWN-vaYHXb0_dXNFYZYaSGVc6aiu0FnUkPMaWMxU6H-m7hjjdJpcKvkvzO5fTIcIKeN1yBtGw',
    verified: true,
    timeLabel: 'Fri, Nov 1 • 14:00',
    status: 'pending',
    youTeach: 'Figma Auto-Layout & Tokens',
    peerTeaches: 'Architectural 3D Modeling',
    teachMins: 60,
    peerMins: 60,
    rating: 4.9,
    note: '"Hi! Loved your recent portfolio breakdown. I\'m building a design system for my studio and need help refining nested components."'
  },
  {
    id: 'pending-samir',
    peerName: 'Samir Kulkarni',
    peerRole: 'Data Scientist & ML Researcher',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClMnvkyZ73pS01HKC9KpNuUimtV38U2Awd0usCgC4ds8MJwtPvL__EMa-7swjaypS0pX78lyvFTnL3D_ZsCmleldB7HrMaONnm_qUWmmeZ_Hl0woxfahwsdSOuQeTY1BMDZVS8guw7tUxYTV3YanJVzd8WRCie5x5ohFKlvgaz27xt0k0xWbGAzawau_l-4bspI7aelh9yj2laSZJlF-Kk7_k-OSfgiqEjdcMvAkFmIKKAHOHWu5E',
    verified: true,
    timeLabel: 'Sun, Nov 3 • 10:00',
    status: 'pending',
    youTeach: 'User Journey Mapping',
    peerTeaches: 'Python Data Visuals',
    teachMins: 45,
    peerMins: 45,
    rating: 5.0,
    note: '"Interested in exchanging 45 minutes of Plotly/Seaborn visualization scripts for user interview and journey mapping techniques."'
  }
];

export const initialCompletedSessions: SessionItem[] = [
  {
    id: 'completed-sarah',
    peerName: 'Sarah Jenkins',
    peerRole: 'Watercolor Illustrator',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUeU4vNriV4xRHmLaWWi2t3RISzN4DUQ36qtln9n77kpe15x96nYDodJt9okhsCMh_bNV8VLLIpquTT9Uw_emwChxgrmSfveWwCQMrKPjZCIol69DhwoGfwDbXPl_reCZtg-tMpCtrzHK92HzJaZJDXDPjuKNjIkRY7XDLglGfmQ51Q4denX_LF2MpT2R2hYrtSebGT9cFGPqKSIlee177mvMllvKqP3QO4nn3DghZW0OU7NrtA6M',
    verified: true,
    timeLabel: 'Completed on Oct 14 • 60m swap',
    status: 'completed',
    youTeach: 'Webflow CMS',
    peerTeaches: 'Watercolour 101',
    teachMins: 30,
    peerMins: 30,
    rating: 5.0,
    completedDate: 'Oct 14'
  },
  {
    id: 'completed-david',
    peerName: 'David O\'Reilly',
    peerRole: 'Senior Copywriter & Brand Strategist',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUYgN2uQm7c8M2CF2kcqyGARa9gzoa9ajdqmw3wH2VSNHADFXaZJxw4JOR9PRSy8dDtOg8ybDhbxLbFa419CgQIo-76sIQjjXy6pF4bgJibuqlPSh7K65nnIboziJxnhuBjDYYMOo4_7iKQ5Pdkl2R9zxHYQByts7iY-57ulQbNimkiQaqe8VX3v2QFQ-CPxbLt_-2yc0XjQJ1KzVV6WhTVEV7mYe0oLubxsTahkgVobkb7UanJLs',
    verified: true,
    timeLabel: 'Completed on Oct 02 • 90m swap',
    status: 'completed',
    youTeach: 'UX Wireframes',
    peerTeaches: 'Brand Storytelling',
    teachMins: 45,
    peerMins: 45,
    rating: 5.0,
    completedDate: 'Oct 02'
  }
];

export const initialInquiries: ExchangeInquiry[] = [
  {
    id: 'inquiry-marcus',
    peerName: 'Marcus Vance',
    peerRole: 'Design Lead • 99% Karma',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB2iQcjddADLrTAqm3fEKpiZQ_hEWnyaP8laiBu4BtZsB9ykSAEIrjHL0s1wJeA9-QMLYEglCvcWrkL2r4aKZeISfE3wqAas5FhmiOWVfkdd13nSY_LBX1ZHirgJu8D-L2sciB_JpMaWBrIDRtpnFhnxHpAi4292TucFty6qGCBOVujvV_p_iXcKVMCyNUDJS8pThMm36uLeiohlvV-JlMRnp8VGmMzbimWz2ldUF2_ZJY5i5XRYn8',
    karma: 99,
    offers: 'Design Systems',
    wants: 'Senior React Mentoring',
    note: '"Hey Elena! Love your component architecture articles. Looking to swap 2 hours of Design Tokens for React 19 concurrent patterns."',
    ratioType: '1:1 Direct',
    status: 'pending'
  },
  {
    id: 'inquiry-kenji',
    peerName: 'Kenji Takahashi',
    peerRole: 'Tokyo Native • 95% Karma',
    peerAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9k2ZexjOEDuXsjJICyqEz5SOu_DPkGROjXqDNcr1aFd9PFRQ8tVB80SJpVbzMNmMM_ruFAdKUx5o6rqT8MJqAdfm5M9pZLy3_8I4ivty2n5f_HD8JdcCdlV8J47DqJIh1lL9vpxDqMjfueqYxZRXXNh-Sqt16zxbJbUI_2zVmV4ErEDJjTRrEka5A_bnlVHWFcKt1mgKUrMirylUGOPp3mKShyMZevN7j0SPOR6nNBCkVnZhTeO4',
    karma: 95,
    offers: 'Japanese N5 Drill',
    wants: 'UI Prototyping',
    note: '"Konichiwa! Ready to run weekly conversational drills in exchange for polishing my indie app\'s Figma prototypes!"',
    ratioType: 'Flexible',
    status: 'pending'
  }
];

export const initialUserPortfolio: UserSkillItem[] = [
  {
    id: 'user-skill-1',
    type: 'teach',
    title: 'Senior React Mentoring',
    description: 'Deep-dive architecture, custom hooks, SSR debugging, and state machines with real-world codebase walk-throughs.',
    hoursSpent: 14,
    status: 'active',
    metricNote: '1:1 Hour Credit Equivalence'
  },
  {
    id: 'user-skill-2',
    type: 'teach',
    title: 'UI Prototyping',
    description: 'Figma component variants, advanced physics curves, realistic handoff specs, and delightful micro-interactions.',
    hoursSpent: 8,
    status: 'active',
    metricNote: 'Instant Swap Ready'
  },
  {
    id: 'user-skill-3',
    type: 'learn',
    title: 'Japanese N5 Conversational',
    description: 'Pronunciation nuances, practical restaurant and transit dialogues, and Hiragana/Katakana daily drills.',
    hoursSpent: 16,
    status: 'active',
    metricNote: '2 Active Mentors'
  }
];
