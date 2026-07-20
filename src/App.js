import { useState, useEffect, useRef, useCallback } from "react";
import { db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { BookOpen, FileText, Bell, BarChart3, Plus, Trash2, Send, User, GraduationCap, LogOut, Sparkles, CheckCircle, XCircle, Loader2, Megaphone, Lock, Clock, UserCheck, UserX, BookMarked, Edit3, ExternalLink, ChevronDown, ChevronUp, Download, BookText, ArrowUp, ArrowDown, Layers, RotateCcw, ArrowLeft, ArrowRight, Shuffle, FlagTriangleRight } from "lucide-react";

const DRIVE = "https://drive.google.com/drive/folders/1OL0qtkASaU_sj-VM0T79qXlef07zEseZ?usp=drive_link";
const DEFAULT_TB = [
  {id:"s0",title:"세종학당 한국어 입문 / Sejong Korean Intro",sl:"입문",lv:"beginner",desc:"한국어를 처음 시작하는 학생을 위한 입문 교재\nFor absolute beginners",ko:DRIVE,en:DRIVE},
  {id:"s1",title:"세종학당 한국어 1 / Sejong 1",sl:"1",lv:"beginner",desc:"기초 문법과 어휘를 다지는 1단계\nFoundational grammar & vocabulary",ko:DRIVE,en:DRIVE},
  {id:"s2",title:"세종학당 한국어 2 / Sejong 2",sl:"2",lv:"beginner",desc:"실생활 표현과 회화를 익히는 2단계\nEveryday expressions & conversations",ko:DRIVE,en:""},
  {id:"s3",title:"세종학당 한국어 3A / Sejong 3A",sl:"3A",lv:"intermediate",desc:"중급으로 도약하는 3A 교재\nStepping into intermediate level",ko:DRIVE,en:""},
];
const LV = {beginner:{b:"bg-emerald-100 text-emerald-700",e:"🌱",n:"초급"},intermediate:{b:"bg-amber-100 text-amber-700",e:"⭐",n:"중급"},advanced:{b:"bg-rose-100 text-rose-700",e:"🏆",n:"고급"}};
const AUTO_VOC = [
  {name:"초급1", words:[
    {word:"하나",meaning:"One (native)"},
    {word:"둘",meaning:"Two (native)"},
    {word:"셋",meaning:"Three (native)"},
    {word:"넷",meaning:"Four (native)"},
    {word:"다섯",meaning:"Five (native)"},
    {word:"여섯",meaning:"Six (native)"},
    {word:"일곱",meaning:"Seven (native)"},
    {word:"여덟",meaning:"Eight (native)"},
    {word:"아홉",meaning:"Nine (native)"},
    {word:"열",meaning:"Ten (native)"},
    {word:"백",meaning:"Hundred"},
    {word:"천",meaning:"Thousand"},
    {word:"만",meaning:"Ten thousand"},
    {word:"색깔",meaning:"Color"},
    {word:"빨강",meaning:"Red"},
    {word:"파랑",meaning:"Blue"},
    {word:"노랑",meaning:"Yellow"},
    {word:"초록",meaning:"Green"},
    {word:"검정",meaning:"Black"},
    {word:"하양",meaning:"White"},
    {word:"머리",meaning:"Head / Hair"},
    {word:"얼굴",meaning:"Face"},
    {word:"눈",meaning:"Eye"},
    {word:"코",meaning:"Nose"},
    {word:"입",meaning:"Mouth"},
    {word:"귀",meaning:"Ear"},
    {word:"손",meaning:"Hand"},
    {word:"발",meaning:"Foot"},
    {word:"팔",meaning:"Arm"},
    {word:"다리",meaning:"Leg"},
    {word:"화요일",meaning:"Tuesday"},
    {word:"수요일",meaning:"Wednesday"},
    {word:"목요일",meaning:"Thursday"},
    {word:"주",meaning:"Week"},
    {word:"년",meaning:"Year"},
    {word:"오전",meaning:"AM / Morning"},
    {word:"오후",meaning:"PM / Afternoon"},
    {word:"주말",meaning:"Weekend"},
    {word:"평일",meaning:"Weekday"},
    {word:"작년",meaning:"Last year"},
    {word:"올해",meaning:"This year"},
    {word:"내년",meaning:"Next year"},
    {word:"새벽",meaning:"Dawn"},
    {word:"빵",meaning:"Bread"},
    {word:"우유",meaning:"Milk"},
    {word:"사과",meaning:"Apple"},
    {word:"바나나",meaning:"Banana"},
    {word:"딸기",meaning:"Strawberry"},
    {word:"김치",meaning:"Kimchi"},
    {word:"라면",meaning:"Ramen"},
    {word:"치킨",meaning:"Chicken (dish)"},
    {word:"피자",meaning:"Pizza"},
    {word:"과일",meaning:"Fruit"},
    {word:"야채",meaning:"Vegetable"},
    {word:"고기",meaning:"Meat"},
    {word:"계란",meaning:"Egg"},
    {word:"설탕",meaning:"Sugar"},
    {word:"소금",meaning:"Salt"},
    {word:"차",meaning:"Tea"},
    {word:"주스",meaning:"Juice"},
    {word:"카페",meaning:"Cafe"},
    {word:"식당",meaning:"Restaurant"},
    {word:"공원",meaning:"Park"},
    {word:"도서관",meaning:"Library"},
    {word:"영화관",meaning:"Movie theater"},
    {word:"은행",meaning:"Bank"},
    {word:"우체국",meaning:"Post office"},
    {word:"호텔",meaning:"Hotel"},
    {word:"공항",meaning:"Airport"},
    {word:"버스",meaning:"Bus"},
    {word:"택시",meaning:"Taxi"},
    {word:"자전거",meaning:"Bicycle"},
    {word:"비행기",meaning:"Airplane"},
    {word:"기차",meaning:"Train"},
    {word:"배",meaning:"Boat / Ship"},
    {word:"길",meaning:"Road / Street"},
    {word:"신호등",meaning:"Traffic light"},
    {word:"쓰다",meaning:"To write / use"},
    {word:"읽다",meaning:"To read"},
    {word:"주다",meaning:"To give"},
    {word:"받다",meaning:"To receive"},
    {word:"보내다",meaning:"To send"},
    {word:"열다",meaning:"To open"},
    {word:"닫다",meaning:"To close"},
    {word:"앉다",meaning:"To sit"},
    {word:"서다",meaning:"To stand"},
    {word:"걷다",meaning:"To walk"},
    {word:"뛰다",meaning:"To run / jump"},
    {word:"입다",meaning:"To wear"},
    {word:"벗다",meaning:"To take off"},
    {word:"씻다",meaning:"To wash"},
    {word:"쉬다",meaning:"To rest"},
    {word:"길다",meaning:"To be long"},
    {word:"짧다",meaning:"To be short"},
    {word:"높다",meaning:"To be high / tall"},
    {word:"낮다",meaning:"To be low"},
    {word:"빠르다",meaning:"To be fast"},
    {word:"느리다",meaning:"To be slow"},
    {word:"뜨겁다",meaning:"To be hot (touch)"},
    {word:"차갑다",meaning:"To be cold (touch)"},
    {word:"덥다",meaning:"To be hot (weather)"},
    {word:"춥다",meaning:"To be cold (weather)"},
  ]},
  {name:"초급2", words:[
    {word:"날씨",meaning:"Weather"},
    {word:"비",meaning:"Rain"},
    {word:"눈",meaning:"Snow"},
    {word:"바람",meaning:"Wind"},
    {word:"구름",meaning:"Cloud"},
    {word:"해",meaning:"Sun"},
    {word:"달",meaning:"Moon"},
    {word:"별",meaning:"Star"},
    {word:"하늘",meaning:"Sky"},
    {word:"산",meaning:"Mountain"},
    {word:"바다",meaning:"Sea / Ocean"},
    {word:"강",meaning:"River"},
    {word:"호수",meaning:"Lake"},
    {word:"나무",meaning:"Tree"},
    {word:"꽃",meaning:"Flower"},
    {word:"풀",meaning:"Grass"},
    {word:"잎",meaning:"Leaf"},
    {word:"동물",meaning:"Animal"},
    {word:"개",meaning:"Dog"},
    {word:"고양이",meaning:"Cat"},
    {word:"새",meaning:"Bird"},
    {word:"물고기",meaning:"Fish"},
    {word:"닭",meaning:"Chicken (animal)"},
    {word:"소",meaning:"Cow"},
    {word:"돼지",meaning:"Pig"},
    {word:"말",meaning:"Horse / Speech"},
    {word:"토끼",meaning:"Rabbit"},
    {word:"곰",meaning:"Bear"},
    {word:"사자",meaning:"Lion"},
    {word:"호랑이",meaning:"Tiger"},
    {word:"형제",meaning:"Brothers"},
    {word:"자매",meaning:"Sisters"},
    {word:"부부",meaning:"Couple"},
    {word:"남편",meaning:"Husband"},
    {word:"아내",meaning:"Wife"},
    {word:"아들",meaning:"Son"},
    {word:"딸",meaning:"Daughter"},
    {word:"할아버지",meaning:"Grandfather"},
    {word:"할머니",meaning:"Grandmother"},
    {word:"손자",meaning:"Grandson"},
    {word:"손녀",meaning:"Granddaughter"},
    {word:"삼촌",meaning:"Uncle"},
    {word:"이모",meaning:"Aunt (mother's side)"},
    {word:"고모",meaning:"Aunt (father's side)"},
    {word:"사촌",meaning:"Cousin"},
    {word:"남자",meaning:"Man"},
    {word:"여자",meaning:"Woman"},
    {word:"아저씨",meaning:"Mister / middle-aged man"},
    {word:"아주머니",meaning:"Mrs. / middle-aged woman"},
    {word:"청년",meaning:"Young person"},
    {word:"노인",meaning:"Elderly person"},
    {word:"취미",meaning:"Hobby"},
    {word:"운동",meaning:"Exercise / Sports"},
    {word:"축구",meaning:"Soccer"},
    {word:"야구",meaning:"Baseball"},
    {word:"농구",meaning:"Basketball"},
    {word:"수영",meaning:"Swimming"},
    {word:"등산",meaning:"Hiking"},
    {word:"여행",meaning:"Travel"},
    {word:"영화",meaning:"Movie"},
    {word:"음악",meaning:"Music"},
    {word:"노래",meaning:"Song"},
    {word:"춤",meaning:"Dance"},
    {word:"그림",meaning:"Picture / Drawing"},
    {word:"사진",meaning:"Photo"},
    {word:"게임",meaning:"Game"},
    {word:"운전",meaning:"Driving"},
    {word:"요리",meaning:"Cooking"},
    {word:"청소",meaning:"Cleaning"},
    {word:"빨래",meaning:"Laundry"},
    {word:"쇼핑",meaning:"Shopping"},
    {word:"산책",meaning:"Walk / Stroll"},
    {word:"휴가",meaning:"Vacation"},
    {word:"생일",meaning:"Birthday"},
    {word:"파티",meaning:"Party"},
    {word:"선물",meaning:"Gift"},
    {word:"결혼",meaning:"Marriage"},
    {word:"사랑",meaning:"Love"},
    {word:"행복",meaning:"Happiness"},
    {word:"슬픔",meaning:"Sadness"},
    {word:"기쁨",meaning:"Joy"},
    {word:"걱정",meaning:"Worry"},
    {word:"두려움",meaning:"Fear"},
    {word:"화",meaning:"Anger"},
    {word:"마음",meaning:"Heart / Mind"},
    {word:"생각",meaning:"Thought"},
    {word:"꿈",meaning:"Dream"},
    {word:"희망",meaning:"Hope"},
    {word:"추억",meaning:"Memory"},
    {word:"약속",meaning:"Promise / Appointment"},
    {word:"부탁",meaning:"Favor / Request"},
    {word:"도움",meaning:"Help"},
    {word:"칭찬",meaning:"Praise"},
    {word:"인사",meaning:"Greeting"},
    {word:"대답",meaning:"Answer"},
    {word:"질문",meaning:"Question"},
    {word:"이야기",meaning:"Story"},
    {word:"소리",meaning:"Sound"},
    {word:"목소리",meaning:"Voice"},
    {word:"노력",meaning:"Effort"},
  ]},
  {name:"중급1", words:[
    {word:"직업",meaning:"Job / Occupation"},
    {word:"회의",meaning:"Meeting"},
    {word:"발표",meaning:"Presentation"},
    {word:"보고서",meaning:"Report"},
    {word:"계획",meaning:"Plan"},
    {word:"일정",meaning:"Schedule"},
    {word:"마감",meaning:"Deadline"},
    {word:"출장",meaning:"Business trip"},
    {word:"면접",meaning:"Job interview"},
    {word:"월급",meaning:"Salary"},
    {word:"직장",meaning:"Workplace"},
    {word:"동료",meaning:"Colleague"},
    {word:"사장",meaning:"Boss / President of company"},
    {word:"부장",meaning:"Manager (department head)"},
    {word:"과장",meaning:"Section chief"},
    {word:"정부",meaning:"Government"},
    {word:"대통령",meaning:"President (of country)"},
    {word:"법",meaning:"Law"},
    {word:"경찰",meaning:"Police"},
    {word:"군인",meaning:"Soldier"},
    {word:"변호사",meaning:"Lawyer"},
    {word:"교수",meaning:"Professor"},
    {word:"기자",meaning:"Reporter"},
    {word:"작가",meaning:"Writer"},
    {word:"가수",meaning:"Singer"},
    {word:"배우",meaning:"Actor"},
    {word:"사회",meaning:"Society"},
    {word:"문화",meaning:"Culture"},
    {word:"역사",meaning:"History"},
    {word:"전통",meaning:"Tradition"},
    {word:"종교",meaning:"Religion"},
    {word:"정치",meaning:"Politics"},
    {word:"경제",meaning:"Economy"},
    {word:"환경",meaning:"Environment"},
    {word:"자연",meaning:"Nature"},
    {word:"세계",meaning:"World"},
    {word:"나라",meaning:"Country"},
    {word:"도시",meaning:"City"},
    {word:"시골",meaning:"Countryside"},
    {word:"마을",meaning:"Village"},
    {word:"거리",meaning:"Street / Distance"},
    {word:"광장",meaning:"Plaza / Square"},
    {word:"건물",meaning:"Building"},
    {word:"시설",meaning:"Facility"},
    {word:"박물관",meaning:"Museum"},
    {word:"미술관",meaning:"Art gallery"},
    {word:"극장",meaning:"Theater"},
    {word:"교회",meaning:"Church"},
    {word:"절",meaning:"Buddhist temple"},
    {word:"성당",meaning:"Catholic church"},
    {word:"결정",meaning:"Decision"},
    {word:"선택",meaning:"Choice"},
    {word:"의견",meaning:"Opinion"},
    {word:"주장",meaning:"Argument / Claim"},
    {word:"토론",meaning:"Discussion"},
    {word:"회비",meaning:"Membership fee"},
    {word:"가격",meaning:"Price"},
    {word:"할인",meaning:"Discount"},
    {word:"세금",meaning:"Tax"},
    {word:"영수증",meaning:"Receipt"},
    {word:"계산",meaning:"Calculation / Payment"},
    {word:"카드",meaning:"Card"},
    {word:"현금",meaning:"Cash"},
    {word:"통장",meaning:"Bankbook"},
    {word:"저축",meaning:"Savings"},
    {word:"투자",meaning:"Investment"},
    {word:"빚",meaning:"Debt"},
    {word:"부자",meaning:"Rich person"},
    {word:"가난",meaning:"Poverty"},
    {word:"성공",meaning:"Success"},
    {word:"실패",meaning:"Failure"},
    {word:"기회",meaning:"Opportunity"},
    {word:"도전",meaning:"Challenge"},
    {word:"노력하다",meaning:"To make an effort"},
    {word:"성장하다",meaning:"To grow"},
    {word:"발전하다",meaning:"To develop"},
    {word:"변하다",meaning:"To change"},
    {word:"결정하다",meaning:"To decide"},
    {word:"선택하다",meaning:"To choose"},
    {word:"설명하다",meaning:"To explain"},
    {word:"이해하다",meaning:"To understand"},
    {word:"기억하다",meaning:"To remember"},
    {word:"잊다",meaning:"To forget"},
    {word:"느끼다",meaning:"To feel"},
    {word:"생각하다",meaning:"To think"},
    {word:"걱정하다",meaning:"To worry"},
    {word:"사랑하다",meaning:"To love"},
    {word:"미워하다",meaning:"To hate"},
    {word:"좋아하다",meaning:"To like"},
    {word:"싫어하다",meaning:"To dislike"},
    {word:"필요하다",meaning:"To be necessary"},
    {word:"가능하다",meaning:"To be possible"},
    {word:"불가능하다",meaning:"To be impossible"},
    {word:"중요하다",meaning:"To be important"},
    {word:"특별하다",meaning:"To be special"},
    {word:"평범하다",meaning:"To be ordinary"},
    {word:"친절하다",meaning:"To be kind"},
    {word:"정직하다",meaning:"To be honest"},
    {word:"똑똑하다",meaning:"To be smart"},
    {word:"게으르다",meaning:"To be lazy"},
  ]},
  {name:"중급2", words:[
    {word:"건강",meaning:"Health"},
    {word:"병",meaning:"Illness"},
    {word:"감기",meaning:"Cold (illness)"},
    {word:"열",meaning:"Fever"},
    {word:"두통",meaning:"Headache"},
    {word:"치료",meaning:"Treatment"},
    {word:"수술",meaning:"Surgery"},
    {word:"약",meaning:"Medicine"},
    {word:"주사",meaning:"Injection"},
    {word:"환자",meaning:"Patient"},
    {word:"간호사",meaning:"Nurse"},
    {word:"응급실",meaning:"Emergency room"},
    {word:"교통",meaning:"Traffic / Transportation"},
    {word:"사고",meaning:"Accident"},
    {word:"위험",meaning:"Danger"},
    {word:"안전",meaning:"Safety"},
    {word:"보호",meaning:"Protection"},
    {word:"규칙",meaning:"Rule"},
    {word:"질서",meaning:"Order"},
    {word:"평화",meaning:"Peace"},
    {word:"전쟁",meaning:"War"},
    {word:"자유",meaning:"Freedom"},
    {word:"권리",meaning:"Right (entitlement)"},
    {word:"의무",meaning:"Duty"},
    {word:"책임",meaning:"Responsibility"},
    {word:"약속하다",meaning:"To promise"},
    {word:"지키다",meaning:"To protect / keep"},
    {word:"잃다",meaning:"To lose"},
    {word:"찾다",meaning:"To find / look for"},
    {word:"얻다",meaning:"To gain / obtain"},
    {word:"만들다",meaning:"To make"},
    {word:"짓다",meaning:"To build"},
    {word:"부수다",meaning:"To break / destroy"},
    {word:"고치다",meaning:"To fix"},
    {word:"깨다",meaning:"To break (something)"},
    {word:"사용하다",meaning:"To use"},
    {word:"준비하다",meaning:"To prepare"},
    {word:"시작하다",meaning:"To start"},
    {word:"끝나다",meaning:"To end"},
    {word:"계속하다",meaning:"To continue"},
    {word:"멈추다",meaning:"To stop"},
    {word:"시도하다",meaning:"To try"},
    {word:"포기하다",meaning:"To give up"},
    {word:"도착하다",meaning:"To arrive"},
    {word:"출발하다",meaning:"To depart"},
    {word:"떠나다",meaning:"To leave"},
    {word:"돌아오다",meaning:"To return"},
    {word:"머무르다",meaning:"To stay"},
    {word:"방문하다",meaning:"To visit"},
    {word:"초대하다",meaning:"To invite"},
    {word:"환영하다",meaning:"To welcome"},
    {word:"감사하다",meaning:"To thank / appreciate"},
    {word:"미안하다",meaning:"To be sorry"},
    {word:"부끄럽다",meaning:"To be embarrassed"},
    {word:"자랑스럽다",meaning:"To be proud"},
    {word:"두렵다",meaning:"To be afraid"},
    {word:"외롭다",meaning:"To be lonely"},
    {word:"그립다",meaning:"To miss"},
    {word:"즐겁다",meaning:"To be enjoyable"},
    {word:"답답하다",meaning:"To feel stuffy / frustrated"},
    {word:"시원하다",meaning:"To feel refreshing"},
    {word:"부드럽다",meaning:"To be soft"},
    {word:"딱딱하다",meaning:"To be hard"},
    {word:"깨끗하다",meaning:"To be clean"},
    {word:"더럽다",meaning:"To be dirty"},
    {word:"조용하다",meaning:"To be quiet"},
    {word:"시끄럽다",meaning:"To be noisy"},
    {word:"가볍다",meaning:"To be light (weight)"},
    {word:"무겁다",meaning:"To be heavy"},
    {word:"두껍다",meaning:"To be thick"},
    {word:"얇다",meaning:"To be thin"},
    {word:"넓다",meaning:"To be wide"},
    {word:"좁다",meaning:"To be narrow"},
    {word:"깊다",meaning:"To be deep"},
    {word:"얕다",meaning:"To be shallow"},
    {word:"가깝다",meaning:"To be near"},
    {word:"멀다",meaning:"To be far"},
    {word:"같다",meaning:"To be same"},
    {word:"다르다",meaning:"To be different"},
    {word:"비슷하다",meaning:"To be similar"},
    {word:"예술",meaning:"Art"},
    {word:"과학",meaning:"Science"},
    {word:"기술",meaning:"Technology"},
    {word:"발명",meaning:"Invention"},
    {word:"연구",meaning:"Research"},
    {word:"실험",meaning:"Experiment"},
    {word:"자료",meaning:"Data / Material"},
    {word:"정보",meaning:"Information"},
    {word:"지식",meaning:"Knowledge"},
    {word:"경험",meaning:"Experience"},
    {word:"능력",meaning:"Ability"},
    {word:"재능",meaning:"Talent"},
    {word:"성격",meaning:"Personality"},
    {word:"태도",meaning:"Attitude"},
    {word:"습관",meaning:"Habit"},
    {word:"행동",meaning:"Behavior / Action"},
    {word:"표정",meaning:"Facial expression"},
    {word:"모양",meaning:"Shape"},
    {word:"종류",meaning:"Kind / Type"},
    {word:"부분",meaning:"Part / Portion"},
  ]},
];
const TOPIC_VOC=[
  {topic:"식당/외식",keywords:["식당","음식","외식","먹","메뉴","레스토랑","밥","점심","저녁","식사"],words:[
    {word:"메뉴판",meaning:"Menu (booklet)"},
    {word:"주문하다",meaning:"To order"},
    {word:"계산서",meaning:"Bill / Check"},
    {word:"반찬",meaning:"Side dish"},
    {word:"국물",meaning:"Broth / Soup base"},
    {word:"젓가락",meaning:"Chopsticks"},
    {word:"숟가락",meaning:"Spoon"},
    {word:"포장하다",meaning:"To take out / pack"},
    {word:"예약하다",meaning:"To make a reservation"},
    {word:"맵다",meaning:"To be spicy"},
    {word:"달다",meaning:"To be sweet"},
    {word:"짜다",meaning:"To be salty"},
    {word:"싱겁다",meaning:"To be bland"},
    {word:"쓰다",meaning:"To be bitter"},
    {word:"불고기",meaning:"Bulgogi (grilled beef)"},
    {word:"갈비",meaning:"Galbi (ribs)"},
    {word:"삼겹살",meaning:"Samgyeopsal (pork belly)"},
    {word:"된장찌개",meaning:"Doenjang jjigae (soybean paste stew)"},
    {word:"순두부찌개",meaning:"Sundubu jjigae (soft tofu stew)"},
    {word:"냉면",meaning:"Cold noodles"},
    {word:"비빔밥",meaning:"Bibimbap (mixed rice bowl)"},
    {word:"잡채",meaning:"Japchae (glass noodles)"},
    {word:"떡볶이",meaning:"Tteokbokki (spicy rice cakes)"},
    {word:"1인분",meaning:"One serving"},
    {word:"서비스",meaning:"On the house / Complimentary"},
    {word:"맛있다",meaning:"To be delicious"},
    {word:"맛없다",meaning:"To taste bad"},
    {word:"배부르다",meaning:"To be full"},
    {word:"배고프다",meaning:"To be hungry"},
    {word:"음료",meaning:"Beverage"},
  ]},
  {topic:"여행/관광",keywords:["여행","관광","여권","비자","숙소","해외","공항","투어","trip","travel"],words:[
    {word:"여권",meaning:"Passport"},
    {word:"비자",meaning:"Visa"},
    {word:"체크인",meaning:"Check-in"},
    {word:"체크아웃",meaning:"Check-out"},
    {word:"숙소",meaning:"Accommodation"},
    {word:"관광지",meaning:"Tourist spot"},
    {word:"여행사",meaning:"Travel agency"},
    {word:"지도",meaning:"Map"},
    {word:"환전",meaning:"Currency exchange"},
    {word:"환율",meaning:"Exchange rate"},
    {word:"입국심사",meaning:"Immigration check"},
    {word:"수하물",meaning:"Baggage / Luggage"},
    {word:"탑승권",meaning:"Boarding pass"},
    {word:"명소",meaning:"Famous attraction"},
    {word:"기념품",meaning:"Souvenir"},
    {word:"사진찍다",meaning:"To take a photo"},
    {word:"구경하다",meaning:"To sightsee / look around"},
    {word:"안내소",meaning:"Information center"},
    {word:"왕복",meaning:"Round trip"},
    {word:"편도",meaning:"One way"},
    {word:"투어",meaning:"Tour"},
    {word:"현지인",meaning:"Local person"},
    {word:"자유여행",meaning:"Independent travel"},
    {word:"패키지",meaning:"Package tour"},
    {word:"비수기",meaning:"Off-season"},
    {word:"성수기",meaning:"Peak season"},
    {word:"일출",meaning:"Sunrise"},
    {word:"일몰",meaning:"Sunset"},
    {word:"야경",meaning:"Night view"},
    {word:"렌트카",meaning:"Rental car"},
  ]},
  {topic:"쇼핑/패션",keywords:["쇼핑","패션","옷","의류","백화점","스타일","구매","구입","fashion","shopping"],words:[
    {word:"백화점",meaning:"Department store"},
    {word:"세일",meaning:"Sale"},
    {word:"사이즈",meaning:"Size"},
    {word:"교환하다",meaning:"To exchange"},
    {word:"환불하다",meaning:"To get a refund"},
    {word:"포인트",meaning:"Points / Rewards"},
    {word:"브랜드",meaning:"Brand"},
    {word:"유행",meaning:"Fashion trend"},
    {word:"트렌드",meaning:"Trend"},
    {word:"탈의실",meaning:"Fitting room"},
    {word:"바지",meaning:"Pants / Trousers"},
    {word:"치마",meaning:"Skirt"},
    {word:"원피스",meaning:"Dress"},
    {word:"자켓",meaning:"Jacket"},
    {word:"신발",meaning:"Shoes"},
    {word:"가방",meaning:"Bag"},
    {word:"악세서리",meaning:"Accessories"},
    {word:"목걸이",meaning:"Necklace"},
    {word:"귀걸이",meaning:"Earrings"},
    {word:"반지",meaning:"Ring"},
    {word:"무료배송",meaning:"Free shipping"},
    {word:"한정판",meaning:"Limited edition"},
    {word:"품절",meaning:"Out of stock"},
    {word:"재고",meaning:"Inventory / Stock"},
    {word:"코디",meaning:"Outfit coordination"},
    {word:"캐주얼",meaning:"Casual"},
    {word:"정장",meaning:"Formal wear / Suit"},
    {word:"어울리다",meaning:"To suit / match"},
    {word:"착용하다",meaning:"To wear"},
    {word:"핏",meaning:"Fit"},
  ]},
  {topic:"연애/관계",keywords:["연애","사랑","데이트","관계","커플","남자친구","여자친구","소개팅","썸","고백","love","dating"],words:[
    {word:"소개팅",meaning:"Blind date"},
    {word:"데이트",meaning:"Date"},
    {word:"고백하다",meaning:"To confess feelings"},
    {word:"사귀다",meaning:"To date / go out with"},
    {word:"헤어지다",meaning:"To break up"},
    {word:"짝사랑",meaning:"One-sided love / Crush"},
    {word:"썸",meaning:"Romantic tension / 'Almost dating'"},
    {word:"두근거리다",meaning:"To have a racing heart"},
    {word:"설레다",meaning:"To feel excited / flutter"},
    {word:"보고싶다",meaning:"To miss someone"},
    {word:"그리워하다",meaning:"To long for / miss"},
    {word:"질투하다",meaning:"To feel jealous"},
    {word:"다투다",meaning:"To argue / quarrel"},
    {word:"화해하다",meaning:"To make up / reconcile"},
    {word:"커플",meaning:"Couple"},
    {word:"연인",meaning:"Partner / Lover"},
    {word:"남자친구",meaning:"Boyfriend"},
    {word:"여자친구",meaning:"Girlfriend"},
    {word:"프러포즈",meaning:"Proposal"},
    {word:"기념일",meaning:"Anniversary"},
    {word:"장거리연애",meaning:"Long-distance relationship"},
    {word:"첫눈에반하다",meaning:"To fall in love at first sight"},
    {word:"밀당",meaning:"Push and pull (in dating)"},
    {word:"인연",meaning:"Fate / Connection"},
    {word:"매력",meaning:"Charm / Appeal"},
    {word:"이상형",meaning:"Ideal type"},
    {word:"솔로",meaning:"Single"},
    {word:"복잡하다",meaning:"To be complicated"},
    {word:"진지하다",meaning:"To be serious"},
    {word:"설레임",meaning:"Excitement / Flutter"},
  ]},
  {topic:"K-pop/연예",keywords:["kpop","k-pop","케이팝","아이돌","팬","콘서트","연예","한류","드라마","엔터","idol","hallyu"],words:[
    {word:"아이돌",meaning:"Idol"},
    {word:"팬클럽",meaning:"Fan club"},
    {word:"콘서트",meaning:"Concert"},
    {word:"앨범",meaning:"Album"},
    {word:"음원",meaning:"Digital music / Track"},
    {word:"뮤직비디오",meaning:"Music video"},
    {word:"안무",meaning:"Choreography"},
    {word:"데뷔",meaning:"Debut"},
    {word:"활동하다",meaning:"To promote / be active"},
    {word:"예능",meaning:"Entertainment show"},
    {word:"시청률",meaning:"TV ratings"},
    {word:"오디션",meaning:"Audition"},
    {word:"연습생",meaning:"Trainee"},
    {word:"팬미팅",meaning:"Fan meeting"},
    {word:"굿즈",meaning:"Merchandise / Goods"},
    {word:"포토카드",meaning:"Photo card"},
    {word:"스트리밍",meaning:"Streaming"},
    {word:"차트",meaning:"Chart"},
    {word:"입덕하다",meaning:"To become a fan"},
    {word:"탈덕하다",meaning:"To stop being a fan"},
    {word:"최애",meaning:"Favorite member / Bias"},
    {word:"직캠",meaning:"Fancam"},
    {word:"응원봉",meaning:"Light stick"},
    {word:"한류",meaning:"Korean Wave / Hallyu"},
    {word:"OST",meaning:"Original Soundtrack"},
    {word:"그룹",meaning:"Group"},
    {word:"리더",meaning:"Leader"},
    {word:"메인보컬",meaning:"Main vocalist"},
    {word:"래퍼",meaning:"Rapper"},
    {word:"컴백",meaning:"Comeback"},
  ]},
  {topic:"인터넷/SNS",keywords:["인터넷","sns","소셜","유튜브","인스타","온라인","미디어","앱","internet","social"],words:[
    {word:"검색하다",meaning:"To search"},
    {word:"다운로드",meaning:"Download"},
    {word:"업로드",meaning:"Upload"},
    {word:"공유하다",meaning:"To share"},
    {word:"팔로우",meaning:"Follow"},
    {word:"팔로워",meaning:"Follower"},
    {word:"게시물",meaning:"Post"},
    {word:"인플루언서",meaning:"Influencer"},
    {word:"유튜버",meaning:"YouTuber"},
    {word:"해시태그",meaning:"Hashtag"},
    {word:"알림",meaning:"Notification"},
    {word:"댓글",meaning:"Comment"},
    {word:"좋아요",meaning:"Like"},
    {word:"이모티콘",meaning:"Emoji / Emoticon"},
    {word:"비밀번호",meaning:"Password"},
    {word:"계정",meaning:"Account"},
    {word:"앱",meaning:"App"},
    {word:"업데이트",meaning:"Update"},
    {word:"와이파이",meaning:"Wi-Fi"},
    {word:"데이터",meaning:"Mobile data"},
    {word:"라이브",meaning:"Live broadcast"},
    {word:"구독자",meaning:"Subscriber"},
    {word:"조회수",meaning:"View count"},
    {word:"개인정보",meaning:"Personal information"},
    {word:"로그인",meaning:"Log in"},
    {word:"로그아웃",meaning:"Log out"},
    {word:"회원가입",meaning:"Sign up"},
    {word:"링크",meaning:"Link"},
    {word:"바이럴",meaning:"Viral"},
    {word:"블로그",meaning:"Blog"},
  ]},
  {topic:"요리/음식조리",keywords:["요리","조리","레시피","주방","부엌","만들기","cooking","recipe"],words:[
    {word:"재료",meaning:"Ingredient"},
    {word:"레시피",meaning:"Recipe"},
    {word:"냄비",meaning:"Pot"},
    {word:"프라이팬",meaning:"Frying pan"},
    {word:"칼",meaning:"Knife"},
    {word:"도마",meaning:"Cutting board"},
    {word:"볶다",meaning:"To stir-fry"},
    {word:"끓이다",meaning:"To boil"},
    {word:"굽다",meaning:"To grill / bake"},
    {word:"튀기다",meaning:"To deep-fry"},
    {word:"찌다",meaning:"To steam"},
    {word:"썰다",meaning:"To slice / cut"},
    {word:"다지다",meaning:"To mince / chop finely"},
    {word:"간을하다",meaning:"To season"},
    {word:"양념",meaning:"Seasoning / Marinade"},
    {word:"마늘",meaning:"Garlic"},
    {word:"생강",meaning:"Ginger"},
    {word:"파",meaning:"Green onion"},
    {word:"고춧가루",meaning:"Red pepper powder"},
    {word:"간장",meaning:"Soy sauce"},
    {word:"된장",meaning:"Soybean paste"},
    {word:"고추장",meaning:"Red pepper paste"},
    {word:"참기름",meaning:"Sesame oil"},
    {word:"식초",meaning:"Vinegar"},
    {word:"후추",meaning:"Black pepper"},
    {word:"밀가루",meaning:"Flour"},
    {word:"반죽하다",meaning:"To knead dough"},
    {word:"삶다",meaning:"To boil (food)"},
    {word:"식히다",meaning:"To cool down"},
    {word:"냉동하다",meaning:"To freeze"},
  ]},
  {topic:"집/생활",keywords:["집","생활","아파트","이사","주거","가구","인테리어","방","home","living"],words:[
    {word:"아파트",meaning:"Apartment"},
    {word:"원룸",meaning:"Studio apartment"},
    {word:"월세",meaning:"Monthly rent"},
    {word:"전세",meaning:"Jeonse (lump-sum deposit lease)"},
    {word:"보증금",meaning:"Security deposit"},
    {word:"집주인",meaning:"Landlord"},
    {word:"세입자",meaning:"Tenant"},
    {word:"거실",meaning:"Living room"},
    {word:"침실",meaning:"Bedroom"},
    {word:"발코니",meaning:"Balcony"},
    {word:"전등",meaning:"Light fixture"},
    {word:"에어컨",meaning:"Air conditioner"},
    {word:"냉장고",meaning:"Refrigerator"},
    {word:"세탁기",meaning:"Washing machine"},
    {word:"청소기",meaning:"Vacuum cleaner"},
    {word:"전자레인지",meaning:"Microwave"},
    {word:"이사하다",meaning:"To move (house)"},
    {word:"인테리어",meaning:"Interior design"},
    {word:"소파",meaning:"Sofa"},
    {word:"침대",meaning:"Bed"},
    {word:"책상",meaning:"Desk"},
    {word:"옷장",meaning:"Wardrobe / Closet"},
    {word:"수납",meaning:"Storage"},
    {word:"분리수거",meaning:"Waste sorting / Recycling"},
    {word:"수도세",meaning:"Water bill"},
    {word:"전기세",meaning:"Electricity bill"},
    {word:"관리비",meaning:"Maintenance fee"},
    {word:"아늑하다",meaning:"To be cozy"},
    {word:"쾌적하다",meaning:"To be comfortable / pleasant"},
    {word:"방음",meaning:"Soundproofing"},
  ]},
  {topic:"학교/교육",keywords:["학교","교육","공부","학습","수업","학생","대학","수험","시험","성적","study","school"],words:[
    {word:"과목",meaning:"Subject"},
    {word:"성적",meaning:"Grade / Score"},
    {word:"장학금",meaning:"Scholarship"},
    {word:"강의",meaning:"Lecture"},
    {word:"과제",meaning:"Assignment / Homework"},
    {word:"동아리",meaning:"Club / Society"},
    {word:"학생증",meaning:"Student ID"},
    {word:"필기하다",meaning:"To take notes"},
    {word:"복습하다",meaning:"To review"},
    {word:"예습하다",meaning:"To study in advance"},
    {word:"졸업하다",meaning:"To graduate"},
    {word:"합격하다",meaning:"To pass (an exam)"},
    {word:"불합격하다",meaning:"To fail (an exam)"},
    {word:"입학하다",meaning:"To enter school"},
    {word:"학기",meaning:"Semester"},
    {word:"방학",meaning:"School vacation"},
    {word:"교환학생",meaning:"Exchange student"},
    {word:"유학생",meaning:"International student"},
    {word:"수강신청",meaning:"Course enrollment"},
    {word:"출석",meaning:"Attendance"},
    {word:"지각하다",meaning:"To be late"},
    {word:"결석하다",meaning:"To be absent"},
    {word:"교과서",meaning:"Textbook"},
    {word:"숙제",meaning:"Homework"},
    {word:"연필",meaning:"Pencil"},
    {word:"지우개",meaning:"Eraser"},
    {word:"가위",meaning:"Scissors"},
    {word:"풀",meaning:"Glue"},
    {word:"칠판",meaning:"Blackboard"},
    {word:"시험공부",meaning:"Exam preparation"},
  ]},
  {topic:"스포츠/운동",keywords:["스포츠","운동","체육","헬스","피트니스","체력","선수","경기","sport","fitness"],words:[
    {word:"헬스장",meaning:"Gym"},
    {word:"트레이너",meaning:"Trainer"},
    {word:"운동복",meaning:"Sportswear"},
    {word:"스트레칭",meaning:"Stretching"},
    {word:"준비운동",meaning:"Warm-up exercise"},
    {word:"마라톤",meaning:"Marathon"},
    {word:"배드민턴",meaning:"Badminton"},
    {word:"탁구",meaning:"Table tennis"},
    {word:"골프",meaning:"Golf"},
    {word:"테니스",meaning:"Tennis"},
    {word:"볼링",meaning:"Bowling"},
    {word:"스키",meaning:"Skiing"},
    {word:"서핑",meaning:"Surfing"},
    {word:"필라테스",meaning:"Pilates"},
    {word:"요가",meaning:"Yoga"},
    {word:"근육",meaning:"Muscle"},
    {word:"유산소",meaning:"Cardio / Aerobic exercise"},
    {word:"무산소",meaning:"Anaerobic exercise"},
    {word:"경기",meaning:"Match / Game"},
    {word:"선수",meaning:"Player / Athlete"},
    {word:"감독",meaning:"Coach / Director"},
    {word:"응원하다",meaning:"To cheer for"},
    {word:"우승하다",meaning:"To win (championship)"},
    {word:"기록",meaning:"Record"},
    {word:"훈련하다",meaning:"To train"},
    {word:"부상",meaning:"Injury"},
    {word:"회복하다",meaning:"To recover"},
    {word:"다이어트",meaning:"Diet"},
    {word:"몸무게",meaning:"Body weight"},
    {word:"칼로리",meaning:"Calorie"},
  ]},
];
// Flashcard decks, taken verbatim from the teacher's own uploaded vocab sets (text only, no art).
const FLASH_DECKS = [
  {id:"dating-relationships",name:"연애/관계 (Dating/Relationships)",words:[
    {word:"소개팅",meaning:"Blind date"},{word:"데이트",meaning:"Date"},{word:"고백하다",meaning:"To confess feelings"},
    {word:"사귀다",meaning:"To date / go out with"},{word:"헤어지다",meaning:"To break up"},{word:"짝사랑",meaning:"One-sided love / Crush"},
    {word:"썸",meaning:"Romantic tension / 'Almost dating'"},{word:"두근거리다",meaning:"To have a racing heart"},{word:"설레다",meaning:"To feel excited / flutter"},
    {word:"보고싶다",meaning:"To miss someone"},{word:"그리워하다",meaning:"To long for / miss"},{word:"질투하다",meaning:"To feel jealous"},
    {word:"다투다",meaning:"To argue / quarrel"},{word:"화해하다",meaning:"To make up / reconcile"},{word:"커플",meaning:"Couple"},
    {word:"연인",meaning:"Partner / Lover"},{word:"남자친구",meaning:"Boyfriend"},{word:"여자친구",meaning:"Girlfriend"},
    {word:"프러포즈",meaning:"Proposal"},{word:"기념일",meaning:"Anniversary"},{word:"장거리연애",meaning:"Long-distance relationship"},
    {word:"첫눈에반하다",meaning:"To fall in love at first sight"},{word:"밀당",meaning:"Push and pull (in dating)"},{word:"인연",meaning:"Fate / Connection"},
    {word:"매력",meaning:"Charm / Appeal"},{word:"이상형",meaning:"Ideal type"},{word:"솔로",meaning:"Single"},
    {word:"복잡하다",meaning:"To be complicated"},{word:"진지하다",meaning:"To be serious"},{word:"설레임",meaning:"Excitement / Flutter"},
  ]},
  {id:"travel-tourism",name:"여행/관광 (Travel/Tourism)",words:[
    {word:"여권",meaning:"Passport"},{word:"비자",meaning:"Visa"},{word:"체크인",meaning:"Check-in"},
    {word:"체크아웃",meaning:"Check-out"},{word:"숙소",meaning:"Accommodation"},{word:"관광지",meaning:"Tourist spot"},
    {word:"여행사",meaning:"Travel agency"},{word:"지도",meaning:"Map"},{word:"환전",meaning:"Currency exchange"},
    {word:"환율",meaning:"Exchange rate"},{word:"입국심사",meaning:"Immigration check"},{word:"수하물",meaning:"Baggage / Luggage"},
    {word:"탑승권",meaning:"Boarding pass"},{word:"명소",meaning:"Famous attraction"},{word:"기념품",meaning:"Souvenir"},
    {word:"사진찍다",meaning:"To take a photo"},{word:"구경하다",meaning:"To sightsee / look around"},{word:"안내소",meaning:"Information center"},
    {word:"왕복",meaning:"Round trip"},{word:"편도",meaning:"One way"},{word:"투어",meaning:"Tour"},
    {word:"현지인",meaning:"Local person"},{word:"자유여행",meaning:"Independent travel"},{word:"패키지",meaning:"Package tour"},
    {word:"비수기",meaning:"Off-season"},{word:"성수기",meaning:"Peak season"},{word:"일출",meaning:"Sunrise"},
    {word:"일몰",meaning:"Sunset"},{word:"야경",meaning:"Night view"},{word:"렌트카",meaning:"Rental car"},
  ]},
  {id:"level1-beginner",name:"초급1 (Level1 for Beginner)",words:[
    {word:"하나 1",meaning:"One (native)"},{word:"둘 2",meaning:"Two (native)"},{word:"셋 3",meaning:"Three (native)"},
    {word:"넷 4",meaning:"Four (native)"},{word:"다섯 5",meaning:"Five (native)"},{word:"여섯 6",meaning:"Six (native)"},
    {word:"일곱 7",meaning:"Seven (native)"},{word:"여덟 8",meaning:"Eight (native)"},{word:"아홉 9",meaning:"Nine (native)"},
    {word:"열 10",meaning:"Ten (native)"},{word:"백 100",meaning:"Hundred"},{word:"천 1000",meaning:"Thousand"},
    {word:"만 10000",meaning:"Ten thousand"},{word:"색깔",meaning:"Color"},{word:"빨강",meaning:"Red"},
    {word:"파랑",meaning:"Blue"},{word:"노랑",meaning:"Yellow"},{word:"초록",meaning:"Green"},
    {word:"검정",meaning:"Black"},{word:"하양",meaning:"White"},{word:"머리",meaning:"Head / Hair"},
    {word:"얼굴",meaning:"Face"},{word:"눈",meaning:"Eye"},{word:"코",meaning:"Nose"},
    {word:"입",meaning:"Mouth"},{word:"귀",meaning:"Ear"},{word:"손",meaning:"Hand"},
    {word:"발",meaning:"Foot"},{word:"팔",meaning:"Arm"},{word:"다리",meaning:"Leg"},
    {word:"화요일",meaning:"Tuesday"},{word:"수요일",meaning:"Wednesday"},{word:"목요일",meaning:"Thursday"},
    {word:"주",meaning:"Week"},{word:"년",meaning:"Year"},{word:"오전",meaning:"AM / Morning"},
    {word:"오후",meaning:"PM / Afternoon"},{word:"주말",meaning:"Weekend"},{word:"평일",meaning:"Weekday"},
    {word:"작년",meaning:"Last year"},{word:"올해",meaning:"This year"},{word:"내년",meaning:"Next year"},
    {word:"새벽",meaning:"Dawn"},{word:"빵",meaning:"Bread"},{word:"우유",meaning:"Milk"},
    {word:"사과",meaning:"Apple"},{word:"바나나",meaning:"Banana"},{word:"딸기",meaning:"Strawberry"},
    {word:"김치",meaning:"Kimchi"},{word:"라면",meaning:"Ramen"},{word:"치킨",meaning:"Chicken (dish)"},
    {word:"피자",meaning:"Pizza"},{word:"과일",meaning:"Fruit"},{word:"야채",meaning:"Vegetable"},
    {word:"고기",meaning:"Meat"},{word:"계란",meaning:"Egg"},{word:"설탕",meaning:"Sugar"},
    {word:"소금",meaning:"Salt"},{word:"차",meaning:"Tea"},{word:"주스",meaning:"Juice"},
    {word:"카페",meaning:"Cafe"},{word:"식당",meaning:"Restaurant"},{word:"공원",meaning:"Park"},
    {word:"도서관",meaning:"Library"},{word:"영화관",meaning:"Movie theater"},{word:"은행",meaning:"Bank"},
    {word:"우체국",meaning:"Post office"},{word:"호텔",meaning:"Hotel"},{word:"공항",meaning:"Airport"},
    {word:"버스",meaning:"Bus"},{word:"택시",meaning:"Taxi"},{word:"자전거",meaning:"Bicycle"},
    {word:"비행기",meaning:"Airplane"},{word:"기차",meaning:"Train"},{word:"배",meaning:"Boat / Ship"},
    {word:"길",meaning:"Road / Street"},{word:"신호등",meaning:"Traffic light"},{word:"쓰다",meaning:"To write / use"},
    {word:"읽다",meaning:"To read"},{word:"주다",meaning:"To give"},{word:"받다",meaning:"To receive"},
    {word:"보내다",meaning:"To send"},{word:"열다",meaning:"To open"},{word:"닫다",meaning:"To close"},
    {word:"앉다",meaning:"To sit"},{word:"서다",meaning:"To stand"},{word:"걷다",meaning:"To walk"},
    {word:"뛰다",meaning:"To run / jump"},{word:"입다",meaning:"To wear"},{word:"벗다",meaning:"To take off"},
    {word:"씻다",meaning:"To wash"},{word:"쉬다",meaning:"To rest"},{word:"길다",meaning:"To be long"},
    {word:"짧다",meaning:"To be short"},{word:"높다",meaning:"To be high / tall"},{word:"낮다",meaning:"To be low"},
    {word:"빠르다",meaning:"To be fast"},{word:"느리다",meaning:"To be slow"},{word:"뜨겁다",meaning:"To be hot (touch)"},
    {word:"차갑다",meaning:"To be cold (touch)"},{word:"덥다",meaning:"To be hot (weather)"},{word:"춥다",meaning:"To be cold (weather)"},
  ]},
  {id:"level2-beginner",name:"초급2 (Level2 for Beginner)",words:[
    {word:"날씨",meaning:"Weather"},{word:"비",meaning:"Rain"},{word:"눈",meaning:"Snow"},
    {word:"바람",meaning:"Wind"},{word:"구름",meaning:"Cloud"},{word:"해",meaning:"Sun"},
    {word:"달",meaning:"Moon"},{word:"별",meaning:"Star"},{word:"하늘",meaning:"Sky"},
    {word:"산",meaning:"Mountain"},{word:"바다",meaning:"Sea / Ocean"},{word:"강",meaning:"River"},
    {word:"호수",meaning:"Lake"},{word:"나무",meaning:"Tree"},{word:"꽃",meaning:"Flower"},
    {word:"풀",meaning:"Grass"},{word:"잎",meaning:"Leaf"},{word:"동물",meaning:"Animal"},
    {word:"개",meaning:"Dog"},{word:"고양이",meaning:"Cat"},{word:"새",meaning:"Bird"},
    {word:"물고기",meaning:"Fish"},{word:"닭",meaning:"Chicken (animal)"},{word:"소",meaning:"Cow"},
    {word:"돼지",meaning:"Pig"},{word:"말",meaning:"Horse / Speech"},{word:"토끼",meaning:"Rabbit"},
    {word:"곰",meaning:"Bear"},{word:"사자",meaning:"Lion"},{word:"호랑이",meaning:"Tiger"},
    {word:"형제",meaning:"Brothers"},{word:"자매",meaning:"Sisters"},{word:"부부",meaning:"Couple"},
    {word:"남편",meaning:"Husband"},{word:"아내",meaning:"Wife"},{word:"아들",meaning:"Son"},
    {word:"딸",meaning:"Daughter"},{word:"할아버지",meaning:"Grandfather"},{word:"할머니",meaning:"Grandmother"},
    {word:"손자",meaning:"Grandson"},{word:"손녀",meaning:"Granddaughter"},{word:"삼촌",meaning:"Uncle"},
    {word:"이모",meaning:"Aunt (mother's side)"},{word:"고모",meaning:"Aunt (father's side)"},{word:"사촌",meaning:"Cousin"},
    {word:"남자",meaning:"Man"},{word:"여자",meaning:"Woman"},{word:"아저씨",meaning:"Mister / middle-aged man"},
    {word:"아주머니",meaning:"Mrs. / middle-aged woman"},{word:"청년",meaning:"Young person"},{word:"노인",meaning:"Elderly person"},
    {word:"취미",meaning:"Hobby"},{word:"운동",meaning:"Exercise / Sports"},{word:"축구",meaning:"Soccer"},
    {word:"야구",meaning:"Baseball"},{word:"농구",meaning:"Basketball"},{word:"수영",meaning:"Swimming"},
    {word:"등산",meaning:"Hiking"},{word:"여행",meaning:"Travel"},{word:"영화",meaning:"Movie"},
    {word:"음악",meaning:"Music"},{word:"노래",meaning:"Song"},{word:"춤",meaning:"Dance"},
    {word:"그림",meaning:"Picture / Drawing"},{word:"사진",meaning:"Photo"},{word:"게임",meaning:"Game"},
    {word:"운전",meaning:"Driving"},{word:"요리",meaning:"Cooking"},{word:"청소",meaning:"Cleaning"},
    {word:"빨래",meaning:"Laundry"},{word:"쇼핑",meaning:"Shopping"},{word:"산책",meaning:"Walk / Stroll"},
    {word:"휴가",meaning:"Vacation"},{word:"생일",meaning:"Birthday"},{word:"파티",meaning:"Party"},
    {word:"선물",meaning:"Gift"},{word:"결혼",meaning:"Marriage"},{word:"사랑",meaning:"Love"},
    {word:"행복",meaning:"Happiness"},{word:"슬픔",meaning:"Sadness"},{word:"기쁨",meaning:"Joy"},
    {word:"걱정",meaning:"Worry"},{word:"두려움",meaning:"Fear"},{word:"화",meaning:"Anger"},
    {word:"마음",meaning:"Heart / Mind"},{word:"생각",meaning:"Thought"},{word:"꿈",meaning:"Dream"},
    {word:"희망",meaning:"Hope"},{word:"추억",meaning:"Memory"},{word:"약속",meaning:"Promise / Appointment"},
    {word:"부탁",meaning:"Favor / Request"},{word:"도움",meaning:"Help"},{word:"칭찬",meaning:"Praise"},
    {word:"인사",meaning:"Greeting"},{word:"대답",meaning:"Answer"},{word:"질문",meaning:"Question"},
    {word:"이야기",meaning:"Story"},{word:"소리",meaning:"Sound"},{word:"목소리",meaning:"Voice"},
    {word:"노력",meaning:"Effort"},
  ]},
  {id:"level1-intermediate",name:"중급1 (Level1 for Intermediate)",words:[
    {word:"직업",meaning:"Job / Occupation"},{word:"회의",meaning:"Meeting"},{word:"발표",meaning:"Presentation"},
    {word:"보고서",meaning:"Report"},{word:"계획",meaning:"Plan"},{word:"일정",meaning:"Schedule"},
    {word:"마감",meaning:"Deadline"},{word:"출장",meaning:"Business trip"},{word:"면접",meaning:"Job interview"},
    {word:"월급",meaning:"Salary"},{word:"직장",meaning:"Workplace"},{word:"동료",meaning:"Colleague"},
    {word:"사장",meaning:"Boss / President of company"},{word:"부장",meaning:"Manager (department head)"},{word:"과장",meaning:"Section chief"},
    {word:"정부",meaning:"Government"},{word:"대통령",meaning:"President (of country)"},{word:"법",meaning:"Law"},
    {word:"경찰",meaning:"Police"},{word:"군인",meaning:"Soldier"},{word:"변호사",meaning:"Lawyer"},
    {word:"교수",meaning:"Professor"},{word:"기자",meaning:"Reporter"},{word:"작가",meaning:"Writer"},
    {word:"가수",meaning:"Singer"},{word:"배우",meaning:"Actor"},{word:"사회",meaning:"Society"},
    {word:"문화",meaning:"Culture"},{word:"역사",meaning:"History"},{word:"전통",meaning:"Tradition"},
    {word:"종교",meaning:"Religion"},{word:"정치",meaning:"Politics"},{word:"경제",meaning:"Economy"},
    {word:"환경",meaning:"Environment"},{word:"자연",meaning:"Nature"},{word:"세계",meaning:"World"},
    {word:"나라",meaning:"Country"},{word:"도시",meaning:"City"},{word:"시골",meaning:"Countryside"},
    {word:"마을",meaning:"Village"},{word:"거리",meaning:"Street / Distance"},{word:"광장",meaning:"Plaza / Square"},
    {word:"건물",meaning:"Building"},{word:"시설",meaning:"Facility"},{word:"박물관",meaning:"Museum"},
    {word:"미술관",meaning:"Art gallery"},{word:"극장",meaning:"Theater"},{word:"교회",meaning:"Church"},
    {word:"절",meaning:"Buddhist temple"},{word:"성당",meaning:"Catholic church"},{word:"결정",meaning:"Decision"},
    {word:"선택",meaning:"Choice"},{word:"의견",meaning:"Opinion"},{word:"주장",meaning:"Argument / Claim"},
    {word:"토론",meaning:"Discussion"},{word:"회비",meaning:"Membership fee"},{word:"가격",meaning:"Price"},
    {word:"할인",meaning:"Discount"},{word:"세금",meaning:"Tax"},{word:"영수증",meaning:"Receipt"},
    {word:"계산",meaning:"Calculation / Payment"},{word:"카드",meaning:"Card"},{word:"현금",meaning:"Cash"},
    {word:"통장",meaning:"Bankbook"},{word:"저축",meaning:"Savings"},{word:"투자",meaning:"Investment"},
    {word:"빚",meaning:"Debt"},{word:"부자",meaning:"Rich person"},{word:"가난",meaning:"Poverty"},
    {word:"성공",meaning:"Success"},{word:"실패",meaning:"Failure"},{word:"기회",meaning:"Opportunity"},
    {word:"도전",meaning:"Challenge"},{word:"노력하다",meaning:"To make an effort"},{word:"성장하다",meaning:"To grow"},
    {word:"발전하다",meaning:"To develop"},{word:"변하다",meaning:"To change"},{word:"결정하다",meaning:"To decide"},
    {word:"선택하다",meaning:"To choose"},{word:"설명하다",meaning:"To explain"},{word:"이해하다",meaning:"To understand"},
    {word:"기억하다",meaning:"To remember"},{word:"잊다",meaning:"To forget"},{word:"느끼다",meaning:"To feel"},
    {word:"생각하다",meaning:"To think"},{word:"걱정하다",meaning:"To worry"},{word:"사랑하다",meaning:"To love"},
    {word:"미워하다",meaning:"To hate"},{word:"좋아하다",meaning:"To like"},{word:"싫어하다",meaning:"To dislike"},
    {word:"필요하다",meaning:"To be necessary"},{word:"가능하다",meaning:"To be possible"},{word:"불가능하다",meaning:"To be impossible"},
    {word:"중요하다",meaning:"To be important"},{word:"특별하다",meaning:"To be special"},{word:"평범하다",meaning:"To be ordinary"},
    {word:"친절하다",meaning:"To be kind"},{word:"정직하다",meaning:"To be honest"},{word:"똑똑하다",meaning:"To be smart"},
    {word:"게으르다",meaning:"To be lazy"},
  ]},
];
const TEACHER_PASSWORD = process.env.REACT_APP_TEACHER_PASSWORD || "may2024";

// Firestore helpers
const fget = async (key) => {
  try { const d = await getDoc(doc(db,"data",key)); return d.exists()?d.data().value:null; } catch { return null; }
};
const fset = async (key, val) => {
  try { await setDoc(doc(db,"data",key),{value:val}); } catch(e) { console.error(e); }
};

const normStudents = a => Array.isArray(a)?a.map(s=>typeof s==="string"?{name:s,status:"approved",requestedAt:null}:s):[];
const LvBadge = ({lv}) => { const l=LV[lv]||LV.beginner; return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${l.b}`}>{l.e} {l.n}</span>; };
const Empty = ({ko,en}) => <div className="bg-white rounded-xl p-8 text-center text-slate-400 border border-dashed border-slate-300"><p>{ko}</p><p className="text-xs italic mt-1">{en}</p></div>;
const SectionTitle = ({ko,en}) => <h2 className="text-lg font-bold text-slate-800 mb-3">{ko} <span className="text-sm text-slate-400 font-normal">/ {en}</span></h2>;

const Hdr = ({user,onLogout,tc}) => (
  <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
    <div className="max-w-2xl mx-auto px-3 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`w-8 h-8 bg-gradient-to-br ${tc?"from-purple-500 to-pink-600":"from-indigo-500 to-purple-600"} rounded-xl flex items-center justify-center`}><BookOpen className="w-4 h-4 text-white"/></div>
        <div><div className="font-bold text-slate-800 text-sm">May's Korean Class</div><div className="text-xs text-slate-500">{tc?"선생님":"학생"} · {user.name}</div></div>
      </div>
      <button onClick={onLogout} className="text-slate-500 hover:text-slate-700 p-1"><LogOut className="w-4 h-4"/></button>
    </div>
  </div>
);

const Tabs = ({tabs,active,setActive}) => (
  <div className="bg-white border-b border-slate-100 sticky top-[57px] z-10">
    <div className="max-w-2xl mx-auto flex overflow-x-auto">
      {tabs.map(([id,Icon,ko,en])=>(
        <button key={id} onClick={()=>setActive(id)} className={`flex-1 min-w-0 flex flex-col items-center gap-0 py-2 px-1 border-b-2 transition ${active===id?"border-indigo-500 text-indigo-600":"border-transparent text-slate-500"}`}>
          <Icon className="w-4 h-4 mb-0.5"/>
          <span className="text-[11px] font-medium leading-tight">{ko}</span>
          {en&&<span className="text-[9px] opacity-50 leading-tight">{en}</span>}
        </button>
      ))}
    </div>
  </div>
);

const Wrap = ({children}) => <div className="max-w-2xl mx-auto px-3 py-4">{children}</div>;

export default function App() {
  const [view,setView]=useState("loading");
  const [user,setUser]=useState(null);
  const [data,setData]=useState({mat:[],tb:DEFAULT_TB,voc:[],ann:[],stu:[]});

  useEffect(()=>{
    setView("login"); // show login immediately; data loads in background
    (async()=>{
      const [mat,tb,voc,ann,stuRaw]=await Promise.all([
        fget("materials"),fget("textbooks"),fget("vocab"),fget("announcements"),fget("students"),
      ]);
      setData({mat:mat||[],tb:tb||DEFAULT_TB,voc:voc||[],ann:ann||[],stu:normStudents(stuRaw||[])});
    })();
  },[]);

  // Real-time listener for students (for pending approval)
  useEffect(()=>{
    if(view!=="pending") return;
    const unsub = onSnapshot(doc(db,"data","students"),(snap)=>{
      if(snap.exists()){
        const list=normStudents(snap.data().value);
        setData(d=>({...d,stu:list}));
      }
    });
    return ()=>unsub();
  },[view]);

  const save = useCallback(async (key,val)=>{
    const keyMap={mat:"materials",tb:"textbooks",voc:"vocab",ann:"announcements",stu:"students"};
    await fset(keyMap[key],val);
    setData(d=>({...d,[key]:val}));
  },[]);

  const login = async (name,role,code) => {
    if(role==="teacher"){
      if(code!==TEACHER_PASSWORD) return {error:"선생님 코드가 틀렸습니다. / Wrong teacher code."};
      setUser({name,role}); setView("teacher"); return {ok:true};
    }
    const latest=normStudents(await fget("students")||[]);
    const ex=latest.find(s=>s.name===name);
    if(ex){
      if(ex.status==="approved"){setUser({name,role});setView("student");return{ok:true};}
      if(ex.status==="pending"){setUser({name,role});setView("pending");return{ok:true};}
      if(ex.status==="rejected") return{error:"접속이 거절되었습니다. May 선생님께 문의하세요.\nAccess denied. Please contact May."};
    }
    const newStu=[...latest,{name,status:"pending",requestedAt:new Date().toISOString()}];
    await fset("students",newStu);
    setData(d=>({...d,stu:newStu}));
    setUser({name,role}); setView("pending"); return{ok:true};
  };

  const logout=()=>{setUser(null);setView("login");};

  if(view==="loading") return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin"/></div>;
  if(view==="login") return <LoginScreen onLogin={login}/>;
  if(view==="pending") return <PendingScreen user={user} data={data} onApproved={()=>setView("student")} onRejected={()=>{setUser(null);setView("login");}} onCancel={()=>{setUser(null);setView("login");}}/>;
  if(view==="teacher") return <TeacherApp user={user} data={data} save={save} onLogout={logout}/>;
  return <StudentApp user={user} data={data} onLogout={logout}/>;
}

function LoginScreen({onLogin}){
  const [n,setN]=useState("");const [role,setRole]=useState("student");const [code,setCode]=useState("");const [err,setErr]=useState("");const [loading,setLoading]=useState(false);
  const go=async()=>{
    if(!n.trim()){setErr("이름을 입력해주세요. / Enter your name.");return;}
    if(role==="teacher"&&!code.trim()){setErr("코드를 입력해주세요.");return;}
    setLoading(true);setErr("");
    const r=await onLogin(n.trim(),role,code.trim());
    if(r.error)setErr(r.error);
    setLoading(false);
  };
  return(
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
        <div className="text-center mb-6">
<div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"><BookOpen className="w-7 h-7 text-white"/></div>
            <h1 className="text-2xl font-bold text-slate-800">Korean Class</h1>
            <p className="text-slate-600 text-sm mt-2">✨ 함께하는 한국어 학습 공간 ✨</p>
            <p className="text-xs text-slate-400 italic">A cozy Korean learning space with May</p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {[["student","학생","Student",User],["teacher","선생님","Teacher",GraduationCap]].map(([r,ko,en,Icon])=>(
              <button key={r} onClick={()=>setRole(r)} className={`p-3 rounded-xl border-2 transition flex flex-col items-center gap-1 ${role===r?(r==="student"?"border-indigo-500 bg-indigo-50 text-indigo-700":"border-purple-500 bg-purple-50 text-purple-700"):"border-slate-200 text-slate-600"}`}>
                <Icon className="w-5 h-5"/><span className="text-sm font-medium">{ko}</span><span className="text-xs opacity-70">{en}</span>
              </button>
            ))}
          </div>
          <input type="text" value={n} onChange={e=>setN(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="이름 / Your name" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-400 focus:outline-none text-sm"/>
          {role==="student"&&<p className="text-xs text-slate-400 italic leading-relaxed">ℹ️ 첫 접속은 May 선생님 승인 필요<br/>First access needs teacher approval</p>}
          {role==="teacher"&&<input type="password" value={code} onChange={e=>setCode(e.target.value)} onKeyDown={e=>e.key==="Enter"&&go()} placeholder="선생님 코드 / Teacher code" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-purple-400 focus:outline-none text-sm"/>}
          {err&&<div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2 whitespace-pre-wrap">{err}</div>}
          <button onClick={go} disabled={loading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium py-3 rounded-xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2">
            {loading&&<Loader2 className="w-4 h-4 animate-spin"/>}시작하기 / Start
          </button>
        </div>
      </div>
    </div>
  );
}

function PendingScreen({user,data,onApproved,onRejected,onCancel}){
  const [dots,setDots]=useState("");
  useEffect(()=>{const iv=setInterval(()=>setDots(d=>d.length>=3?"":d+"."),500);return()=>clearInterval(iv);},[]);
  const me=data.stu.find(s=>s.name===user?.name);
  useEffect(()=>{
    if(me?.status==="approved") onApproved();
    if(me?.status==="rejected") onRejected();
  },[me?.status]);
  return(
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">승인 대기 중{dots}</h2>
        <p className="text-sm text-slate-500 italic mb-4">Waiting for May's approval{dots}</p>
        <p className="text-sm text-slate-600 mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3">승인되면 자동으로 입장됩니다.<br/><span className="italic text-xs">You'll enter automatically once approved.</span></p>
        <button onClick={onCancel} className="text-sm text-slate-400 underline">취소 / Cancel</button>
      </div>
    </div>
  );
}

function TeacherApp({user,data,save,onLogout}){
  const [tab,setTab]=useState("students");
  const pending=data.stu.filter(s=>s.status==="pending").length;
  const tabs=[["students",BarChart3,`학생${pending>0?`(${pending})`:""}`, "Students"],["mat",FileText,"학습자료","Materials"],["tb",BookMarked,"수업교재","Textbook"],["voc",BookText,"단어장","Vocab"],["flash",Layers,"플래시카드","Flashcards"],["ann",Megaphone,"공지","Notice"]];
  return(
    <div className="min-h-screen bg-slate-50">
      <Hdr user={user} onLogout={onLogout} tc/>
      <Tabs tabs={tabs} active={tab} setActive={setTab}/>
      <Wrap>
        {tab==="students"&&<TeacherStudents data={data} save={save}/>}
        {tab==="mat"&&<TeacherMat data={data} save={save}/>}
        {tab==="tb"&&<TeacherTB data={data} save={save}/>}
        {tab==="voc"&&<TeacherVoc data={data} save={save}/>}
        {tab==="flash"&&<TeacherFlash/>}
        {tab==="ann"&&<TeacherAnn data={data} save={save}/>}
      </Wrap>
    </div>
  );
}

function StudentApp({user,data,onLogout}){
  const [tab,setTab]=useState("ann");
  const tabs=[["ann",Bell,"공지","Notice"],["mat",FileText,"학습자료","Materials"],["tb",BookMarked,"수업교재","Textbook"],["voc",BookText,"단어장","Vocab"]];
  return(
    <div className="min-h-screen bg-slate-50">
      <Hdr user={user} onLogout={onLogout} tc={false}/>
      <Tabs tabs={tabs} active={tab} setActive={setTab}/>
      <Wrap>
        {tab==="ann"&&<StudentAnn ann={data.ann}/>}
        {tab==="mat"&&<StudentMat mat={data.mat}/>}
        {tab==="tb"&&<StudentTB tb={data.tb}/>}
        {tab==="voc"&&<StudentVoc voc={data.voc}/>}
      </Wrap>
    </div>
  );
}

function TeacherStudents({data,save}){
  const [del,setDel]=useState(null);
  const stu=data.stu;
  const upd=async(name,status)=>{const u=stu.map(s=>s.name===name?{...s,status}:s);await save("stu",u);};
  const doDelete=async()=>{await save("stu",stu.filter(s=>s.name!==del));setDel(null);};
  const pending=stu.filter(s=>s.status==="pending");
  const approved=stu.filter(s=>s.status==="approved");
  const rejected=stu.filter(s=>s.status==="rejected");
  return(
    <div>
      <SectionTitle ko="학생 관리" en="Students"/>
      {pending.length>0&&<div className="mb-4">
        <div className="flex items-center gap-2 mb-2"><span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">NEW</span><span className="font-bold text-sm text-slate-700">승인 대기 ({pending.length})</span></div>
        {pending.map(s=>(
          <div key={s.name} className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 mb-2">
            <div className="font-bold text-slate-800 mb-2">{s.name}</div>
            <div className="flex gap-2">
              <button onClick={()=>upd(s.name,"approved")} className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1"><UserCheck className="w-4 h-4"/>승인</button>
              <button onClick={()=>upd(s.name,"rejected")} className="flex-1 bg-white border border-red-300 text-red-600 py-2 rounded-lg text-sm flex items-center justify-center gap-1"><UserX className="w-4 h-4"/>거절</button>
            </div>
          </div>
        ))}
      </div>}
      <div className="mb-3 font-bold text-sm text-slate-700">승인됨 ({approved.length})</div>
      {approved.length===0?<Empty ko="아직 없어요" en="No approved students"/>:approved.map(s=>(
        <div key={s.name} className="bg-white rounded-xl p-3 mb-2 border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2"><div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">{s.name[0]}</div><span className="font-medium text-slate-800">{s.name}</span></div>
          <button onClick={()=>setDel(s.name)} className="text-slate-300 hover:text-red-500 p-1"><Trash2 className="w-4 h-4"/></button>
        </div>
      ))}
      {rejected.length>0&&<><div className="mt-4 mb-2 font-bold text-sm text-slate-500">거절됨 ({rejected.length})</div>
        {rejected.map(s=>(
          <div key={s.name} className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-500">{s.name}</span>
            <div className="flex gap-3"><button onClick={()=>upd(s.name,"approved")} className="text-xs text-green-600">승인으로 변경</button><button onClick={()=>setDel(s.name)} className="text-slate-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button></div>
          </div>
        ))}
      </>}
      {del&&<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setDel(null)}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-xs text-center" onClick={e=>e.stopPropagation()}>
          <Trash2 className="w-10 h-10 text-red-400 mx-auto mb-3"/>
          <p className="font-bold text-slate-800 mb-1">삭제할까요?</p>
          <p className="text-sm font-bold text-indigo-600 mb-4">{del}</p>
          <div className="flex gap-2"><button onClick={()=>setDel(null)} className="flex-1 bg-slate-100 py-2 rounded-lg text-sm">취소</button><button onClick={doDelete} className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm">삭제</button></div>
        </div>
      </div>}
    </div>
  );
}

const toEmbedUrl=url=>{
  if(!url)return"";
  const slides=url.match(/docs\.google\.com\/presentation\/d\/([\w-]+)/);
  if(slides)return`https://docs.google.com/presentation/d/${slides[1]}/embed?start=false&loop=false`;
  const docs=url.match(/docs\.google\.com\/document\/d\/([\w-]+)/);
  if(docs)return`https://docs.google.com/document/d/${docs[1]}/preview`;
  const sheets=url.match(/docs\.google\.com\/spreadsheets\/d\/([\w-]+)/);
  if(sheets)return`https://docs.google.com/spreadsheets/d/${sheets[1]}/preview`;
  return url;
};

function MatContent({m}){
  return(
    <div className="space-y-3">
      {m.embed&&(
        <div className="space-y-1.5">
          <div className="rounded-xl overflow-hidden bg-slate-100" style={{position:"relative",paddingTop:"56.25%"}}>
            <iframe src={toEmbedUrl(m.embed)} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} frameBorder="0" allowFullScreen title={m.title}/>
          </div>
          <a href={m.embed} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-sm font-medium hover:bg-indigo-100 transition">
            <ExternalLink className="w-4 h-4"/>전체화면으로 열기
          </a>
        </div>
      )}
      {(m.images||[]).filter(Boolean).map((img,i)=>(
        <a key={i} href={img} target="_blank" rel="noopener noreferrer">
          <img src={img} alt={`자료 ${i+1}`} className="w-full rounded-xl cursor-pointer hover:opacity-90 transition" onError={e=>e.target.style.display="none"}/>
        </a>
      ))}
      {m.content&&<p className="text-sm text-slate-600 whitespace-pre-wrap">{m.content}</p>}
      {m.link&&<a href={m.link} target="_blank" rel="noopener noreferrer" className="text-indigo-500 text-sm inline-block">🔗 링크</a>}
    </div>
  );
}

function TeacherMat({data,save}){
  const mat=data.mat;
  const [form,setForm]=useState(null);
  const [open,setOpen]=useState(null);
  const E={id:null,title:"",content:"",link:"",images:[],embed:""};
  const upd=f=>setForm(p=>({...p,...f}));
  const saveForm=async()=>{
    if(!form.title.trim())return;
    const u=form.id?mat.map(m=>m.id===form.id?{...m,...form}:m):[{...form,id:Date.now()+"",createdAt:new Date().toISOString()},...mat];
    await save("mat",u);setForm(null);
  };
  const del=async id=>{await save("mat",mat.filter(m=>m.id!==id));};
  const moveUp=async origIdx=>{
    if(origIdx===0)return;
    const arr=[...mat];[arr[origIdx-1],arr[origIdx]]=[arr[origIdx],arr[origIdx-1]];
    await save("mat",arr);
  };
  const moveDown=async origIdx=>{
    if(origIdx>=mat.length-1)return;
    const arr=[...mat];[arr[origIdx],arr[origIdx+1]]=[arr[origIdx+1],arr[origIdx]];
    await save("mat",arr);
  };
  const imgs=form?.images||[];
  return(
    <div>
      <div className="flex justify-between items-center mb-3">
        <SectionTitle ko="학습 자료" en="Materials"/>
        {!form&&<button onClick={()=>setForm(E)} className="bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/>추가</button>}
      </div>
      {form&&<div className="bg-white rounded-xl p-4 mb-3 border-2 border-purple-200 space-y-2">
        <div className="text-xs font-bold text-purple-600">{form.id?"✏️ 수정":"➕ 새 자료"}</div>
        <input placeholder="제목 / Title" value={form.title} onChange={e=>upd({title:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <textarea placeholder="내용 / Content (선택)" value={form.content} onChange={e=>upd({content:e.target.value})} rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <div className="rounded-lg border border-slate-200 p-3 space-y-2 bg-slate-50">
          <p className="text-xs font-medium text-slate-600">🖼 이미지 URL</p>
          {imgs.map((img,i)=>(
            <div key={i} className="flex gap-1">
              <input value={img} onChange={e=>{const a=[...imgs];a[i]=e.target.value;upd({images:a});}} placeholder="https://..." className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none bg-white"/>
              <button onClick={()=>upd({images:imgs.filter((_,j)=>j!==i)})} className="text-slate-300 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          ))}
          <button onClick={()=>upd({images:[...imgs,""]})} className="text-purple-600 text-xs hover:underline">+ 이미지 추가</button>
        </div>
        <div className="rounded-lg border border-slate-200 p-3 bg-slate-50 space-y-1">
          <p className="text-xs font-medium text-slate-600">📄 Google 문서 링크 (Slides · Docs · Sheets)</p>
          <input placeholder="공유 링크 붙여넣기 → 자동으로 뷰어 모드 변환" value={form.embed||""} onChange={e=>upd({embed:e.target.value})} className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none bg-white"/>
        </div>
        <input placeholder="🔗 외부 링크 (선택)" value={form.link} onChange={e=>upd({link:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <div className="flex gap-2"><button onClick={saveForm} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm">저장</button><button onClick={()=>setForm(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm">취소</button></div>
      </div>}
      {mat.length===0&&!form?<Empty ko="자료가 없습니다" en="No materials yet"/>:mat.filter(m=>m.id!==form?.id).map((m,fi,fa)=>{
        const oi=mat.findIndex(x=>x.id===m.id);
        return(
        <div key={m.id} className="bg-white rounded-xl mb-2 border border-slate-200">
          <div className="flex items-center px-3 py-3">
            <button onClick={()=>setOpen(open===m.id?null:m.id)} className="flex-1 flex items-center gap-2 text-left min-w-0">
              <span className="font-medium text-slate-800 text-sm truncate">{m.title}</span>
              {open===m.id?<ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0"/>:<ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0"/>}
            </button>
            <div className="flex gap-0.5 ml-2">
              <button onClick={()=>moveUp(oi)} disabled={fi===0} className="text-slate-300 hover:text-indigo-500 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUp className="w-3.5 h-3.5"/></button>
              <button onClick={()=>moveDown(oi)} disabled={fi===fa.length-1} className="text-slate-300 hover:text-indigo-500 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDown className="w-3.5 h-3.5"/></button>
              <button onClick={()=>setForm({id:m.id,title:m.title,content:m.content||"",link:m.link||"",images:m.images||[],embed:m.embed||""})} className="text-slate-400 hover:text-indigo-500 p-1.5 rounded-lg"><Edit3 className="w-4 h-4"/></button>
              <button onClick={()=>del(m.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
          {open===m.id&&<div className="px-3 pb-3 border-t border-slate-100 pt-3"><MatContent m={m}/></div>}
        </div>
        );
      })}
    </div>
  );
}

function TeacherTB({data,save}){
  const tb=data.tb;
  const E={id:null,title:"",sl:"",lv:"beginner",desc:"",ko:"",en:""};
  const [form,setForm]=useState(null);
  const upd=f=>setForm(p=>({...p,...f}));
  const saveForm=async()=>{
    if(!form.title.trim())return;
    const u=form.id?tb.map(t=>t.id===form.id?{...form}:t):[...tb,{...form,id:"tb"+Date.now()}];
    await save("tb",u);setForm(null);
  };
  const del=async id=>{await save("tb",tb.filter(t=>t.id!==id));};
  const moveUp=async oi=>{if(oi===0)return;const a=[...tb];[a[oi-1],a[oi]]=[a[oi],a[oi-1]];await save("tb",a);};
  const moveDown=async oi=>{if(oi>=tb.length-1)return;const a=[...tb];[a[oi],a[oi+1]]=[a[oi+1],a[oi]];await save("tb",a);};
  return(
    <div>
      <div className="flex justify-between items-center mb-3">
        <SectionTitle ko="수업교재" en="Textbooks"/>
        {!form&&<button onClick={()=>setForm(E)} className="bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/>추가</button>}
      </div>
      {form&&<div className="bg-white rounded-xl p-4 mb-3 border-2 border-purple-200 space-y-2">
        <div className="text-xs font-bold text-purple-600">{form.id?"✏️ 수정":"➕ 새 교재"}</div>
        <input placeholder="제목 / Title" value={form.title} onChange={e=>upd({title:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-purple-400"/>
        <div className="grid grid-cols-2 gap-2">
          <input placeholder="세종 단계 (입문/1/2...)" value={form.sl} onChange={e=>upd({sl:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
          <select value={form.lv} onChange={e=>upd({lv:e.target.value})} className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white focus:outline-none">
            <option value="beginner">🌱 초급</option><option value="intermediate">⭐ 중급</option><option value="advanced">🏆 고급</option>
          </select>
        </div>
        <textarea placeholder="설명 / Description" value={form.desc} onChange={e=>upd({desc:e.target.value})} rows={2} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
        <input placeholder="🇰🇷 한국어판 Google Drive URL" value={form.ko} onChange={e=>upd({ko:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
        <input placeholder="🇺🇸 English URL (선택)" value={form.en} onChange={e=>upd({en:e.target.value})} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"/>
        <div className="flex gap-2"><button onClick={saveForm} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm">저장</button><button onClick={()=>setForm(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm">취소</button></div>
      </div>}
      {tb.filter(t=>t.id!==form?.id).map((t,fi,fa)=>{
        const oi=tb.findIndex(x=>x.id===t.id);
        return(
        <div key={t.id} className="bg-white rounded-xl p-4 mb-2 border border-slate-200">
          <div className="flex justify-between items-start gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex gap-2 flex-wrap mb-1"><LvBadge lv={t.lv}/>{t.sl&&<span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Sejong {t.sl}</span>}</div>
              <p className="font-bold text-slate-800 text-sm">{t.title}</p>
              {t.desc&&<p className="text-xs text-slate-500 mt-1 whitespace-pre-wrap">{t.desc}</p>}
              <div className="flex gap-3 mt-2">
                {t.ko&&<a href={t.ko} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 flex items-center gap-1">🇰🇷 한국어판<ExternalLink className="w-3 h-3"/></a>}
                {t.en&&<a href={t.en} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 flex items-center gap-1">🇺🇸 English<ExternalLink className="w-3 h-3"/></a>}
              </div>
            </div>
            <div className="flex gap-0.5">
              <button onClick={()=>moveUp(oi)} disabled={fi===0} className="text-slate-300 hover:text-indigo-500 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUp className="w-3.5 h-3.5"/></button>
              <button onClick={()=>moveDown(oi)} disabled={fi===fa.length-1} className="text-slate-300 hover:text-indigo-500 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDown className="w-3.5 h-3.5"/></button>
              <button onClick={()=>setForm({id:t.id,title:t.title,sl:t.sl,lv:t.lv,desc:t.desc,ko:t.ko,en:t.en})} className="text-slate-400 hover:text-indigo-500 p-1.5 rounded-lg"><Edit3 className="w-4 h-4"/></button>
              <button onClick={()=>del(t.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}

function TeacherVoc({data,save}){
  const voc=data.voc;
  const [form,setForm]=useState(null);
  const [rows,setRows]=useState([{word:"",meaning:""}]);
  const [genModal,setGenModal]=useState(false);
  const [genName,setGenName]=useState("");
  const openAdd=()=>{setForm({id:null,name:""});setRows([{word:"",meaning:""}]);};
  const openEdit=s=>{setForm({id:s.id,name:s.name});setRows([...s.words.map(w=>({...w})),{word:"",meaning:""}]);};
  const updRow=(i,f,v)=>{const r=[...rows];r[i][f]=v;setRows(r);};
  const saveForm=async()=>{
    if(!form.name.trim())return;
    const words=rows.filter(r=>r.word.trim()&&r.meaning.trim());
    if(!words.length)return;
    const entry={id:form.id||Date.now()+"",name:form.name.trim(),words,createdAt:form.id?voc.find(v=>v.id===form.id)?.createdAt:new Date().toISOString()};
    const u=form.id?voc.map(v=>v.id===form.id?entry:v):[entry,...voc];
    await save("voc",u);setForm(null);
  };
  const del=async id=>{await save("voc",voc.filter(v=>v.id!==id));};
  const moveUp=async oi=>{if(oi===0)return;const a=[...voc];[a[oi-1],a[oi]]=[a[oi],a[oi-1]];await save("voc",a);};
  const moveDown=async oi=>{if(oi>=voc.length-1)return;const a=[...voc];[a[oi],a[oi+1]]=[a[oi+1],a[oi]];await save("voc",a);};
  const doAutoGen=async()=>{
    if(!genName.trim())return;
    const lower=genName.toLowerCase();
    const existingWords=new Set(voc.flatMap(s=>(s.words||[]).map(w=>w.word)));
    let matched=TOPIC_VOC.find(t=>t.keywords.some(k=>lower.includes(k.toLowerCase())));
    if(!matched) matched=TOPIC_VOC.find(t=>t.topic.toLowerCase().split(/[\/·]/).some(p=>lower.includes(p.trim())));
    const pool=(matched?matched.words:TOPIC_VOC.flatMap(t=>t.words)).filter(w=>!existingWords.has(w.word)).map(w=>({...w}));
    if(!pool.length){window.alert("이미 모든 관련 단어가 존재합니다. 다른 주제를 시도해보세요.");return;}
    await save("voc",[{id:Date.now()+"",name:genName.trim(),words:pool,createdAt:new Date().toISOString()},...voc]);
    setGenModal(false);setGenName("");
  };
  const delPractice=async()=>{
    const cnt=voc.filter(v=>v.practice).length;
    if(!cnt){window.alert("연습용 단어장이 없습니다.");return;}
    if(!window.confirm(`연습용 단어장 ${cnt}개를 모두 삭제합니다. 계속할까요?`))return;
    await save("voc",voc.filter(v=>!v.practice));
  };
  return(
    <div>
      <div className="flex justify-between items-center mb-3">
        <SectionTitle ko="단어장" en="Vocabulary"/>
        {!form&&<div className="flex gap-2">
          {voc.some(v=>v.practice)&&<button onClick={delPractice} className="bg-red-100 text-red-600 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Trash2 className="w-4 h-4"/>연습용 삭제</button>}
          <button onClick={()=>setGenModal(true)} className="bg-indigo-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Sparkles className="w-4 h-4"/>자동생성</button>
          <button onClick={openAdd} className="bg-purple-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Plus className="w-4 h-4"/>만들기</button>
        </div>}
      </div>
      {form&&<div className="bg-white rounded-xl p-4 mb-3 border-2 border-purple-200 space-y-2">
        <div className="text-xs font-bold text-purple-600">{form.id?"✏️ 수정":"➕ 새 단어장"}</div>
        <input placeholder="단어장 이름 / Set name" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none font-medium"/>
        <div className="rounded-lg border border-slate-200 overflow-hidden">
          <div className="grid grid-cols-[28px_1fr_1fr_28px] bg-slate-50 text-xs text-slate-500 px-2 py-2 gap-1"><span>#</span><span>단어</span><span>뜻 (English)</span><span></span></div>
          {rows.map((r,i)=>(
            <div key={i} className="grid grid-cols-[28px_1fr_1fr_28px] gap-1 px-2 py-1 border-t border-slate-100 items-center">
              <span className="text-xs text-slate-400">{i+1}</span>
              <input value={r.word} onChange={e=>updRow(i,"word",e.target.value)} placeholder="단어" className="px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:border-purple-400"/>
              <input value={r.meaning} onChange={e=>updRow(i,"meaning",e.target.value)} placeholder="meaning" className="px-2 py-1 rounded border border-slate-200 text-sm focus:outline-none focus:border-purple-400"/>
              <button onClick={()=>rows.length>1&&setRows(rows.filter((_,j)=>j!==i))} className="text-slate-300 hover:text-red-400 flex items-center justify-center"><Trash2 className="w-3.5 h-3.5"/></button>
            </div>
          ))}
        </div>
        <button onClick={()=>setRows([...rows,{word:"",meaning:""}])} className="text-purple-600 text-sm hover:underline">+ 단어 추가</button>
        <div className="flex gap-2"><button onClick={saveForm} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm">저장</button><button onClick={()=>setForm(null)} className="bg-slate-100 text-slate-600 px-4 py-2 rounded-lg text-sm">취소</button></div>
      </div>}
      {voc.length===0&&!form?<Empty ko="단어장이 없습니다" en="No vocabulary sets yet"/>:voc.map((s,fi,fa)=>{
        const oi=voc.findIndex(x=>x.id===s.id);
        return(
        <div key={s.id} className="bg-white rounded-xl p-4 mb-2 border border-slate-200 flex justify-between items-center">
          <div><p className="font-bold text-slate-800">{s.name}</p><p className="text-xs text-slate-500">{s.words.length}개 단어</p></div>
          <div className="flex gap-0.5">
            <button onClick={()=>moveUp(oi)} disabled={fi===0} className="text-slate-300 hover:text-indigo-500 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ArrowUp className="w-3.5 h-3.5"/></button>
            <button onClick={()=>moveDown(oi)} disabled={fi===fa.length-1} className="text-slate-300 hover:text-indigo-500 p-1.5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed"><ArrowDown className="w-3.5 h-3.5"/></button>
            <button onClick={()=>openEdit(s)} className="text-slate-400 hover:text-indigo-500 p-1.5 rounded-lg"><Edit3 className="w-4 h-4"/></button>
            <button onClick={()=>del(s.id)} className="text-slate-400 hover:text-red-500 p-1.5 rounded-lg"><Trash2 className="w-4 h-4"/></button>
          </div>
        </div>
        );
      })}
      {genModal&&<div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={()=>setGenModal(false)}>
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={e=>e.stopPropagation()}>
          <h3 className="font-bold text-slate-800 mb-1 flex items-center gap-2"><Sparkles className="w-5 h-5 text-indigo-500"/>단어장 자동생성</h3>
          <p className="text-xs text-slate-500 mb-4">단어장 이름(주제)을 입력하면 관련 단어를 자동으로 추가합니다.<br/>이미 업로드된 단어는 제외됩니다.</p>
          <input autoFocus placeholder="예: 식당 표현, 여행 어휘, K-pop 용어..." value={genName} onChange={e=>setGenName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doAutoGen()} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-400 focus:outline-none mb-3"/>
          <p className="text-[11px] text-slate-400 mb-4 leading-relaxed">추천 주제: 식당/외식 · 여행/관광 · 쇼핑/패션 · 연애/관계 · K-pop/연예 · 인터넷/SNS · 요리 · 집/생활 · 학교/교육 · 스포츠/운동</p>
          <div className="flex gap-2">
            <button onClick={()=>setGenModal(false)} className="flex-1 bg-slate-100 text-slate-600 py-2.5 rounded-xl text-sm">취소</button>
            <button onClick={doAutoGen} className="flex-1 bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1"><Sparkles className="w-4 h-4"/>생성하기</button>
          </div>
        </div>
      </div>}
    </div>
  );
}

const wordKey = w => `${w.word}|${w.meaning}`;
const shuffleArr = arr => {
  const a=[...arr];
  for(let i=a.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
};

function TeacherFlash(){
  const [multiMode,setMultiMode]=useState(false);
  const [selectedIds,setSelectedIds]=useState([]);
  const [session,setSession]=useState(null);
  const [idx,setIdx]=useState(0);
  const [flipped,setFlipped]=useState(false);
  const [checked,setChecked]=useState(()=>new Set());
  const [done,setDone]=useState(false);
  const toggleSel=id=>setSelectedIds(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id]);
  const openSingle=d=>{setSession({id:d.id,name:d.name,words:d.words});setIdx(0);setFlipped(false);setChecked(new Set());setDone(false);};
  const startMerged=()=>{
    const decks=FLASH_DECKS.filter(d=>selectedIds.includes(d.id));
    if(!decks.length)return;
    const words=decks.flatMap(d=>d.words);
    setSession({id:"merged",name:`선택한 ${decks.length}개 단어장`,words});
    setIdx(0);setFlipped(false);setChecked(new Set());setDone(false);
  };
  const back=()=>{setSession(null);setIdx(0);setFlipped(false);setMultiMode(false);setSelectedIds([]);setChecked(new Set());setDone(false);};
  const go=dir=>{
    if(dir===1&&idx===session.words.length-1){setDone(true);return;}
    setFlipped(false);
    setIdx(i=>(i+dir+session.words.length)%session.words.length);
  };
  const toggleCheck=w=>setChecked(prev=>{
    const next=new Set(prev);
    const key=wordKey(w);
    next.has(key)?next.delete(key):next.add(key);
    return next;
  });
  const reviewChecked=()=>{
    const words=session.words.filter(w=>checked.has(wordKey(w)));
    setSession(s=>({...s,words}));
    setIdx(0);setFlipped(false);setChecked(new Set());setDone(false);
  };
  const restart=()=>{setIdx(0);setFlipped(false);setChecked(new Set());setDone(false);};
  const shuffle=()=>{setSession(s=>({...s,words:shuffleArr(s.words)}));setIdx(0);setFlipped(false);};
  const stopHere=()=>setDone(true);

  if(!session){
    const selectedWordCount=FLASH_DECKS.filter(d=>selectedIds.includes(d.id)).reduce((s,d)=>s+d.words.length,0);
    return(
      <div className="pb-16">
        <SectionTitle ko="🎴 플래시카드" en="Flashcards"/>
        <p className="text-xs text-slate-500 mb-3">단어장을 선택하고 카드를 넘기며 학습하세요. (선생님 전용)</p>
        <button onClick={()=>{setMultiMode(m=>!m);setSelectedIds([]);}} className={`mb-3 px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1 ${multiMode?"bg-indigo-500 text-white":"bg-indigo-50 text-indigo-600"}`}>
          <Layers className="w-4 h-4"/>{multiMode?"덱 여러 개 선택 중 (탭하여 해제)":"여러 덱 합쳐서 길게 학습하기"}
        </button>
        {FLASH_DECKS.map(d=>{
          const checked=selectedIds.includes(d.id);
          return(
            <div key={d.id} onClick={()=>multiMode&&toggleSel(d.id)} className={`bg-white rounded-xl p-4 mb-2 border flex items-center justify-between ${multiMode?`cursor-pointer ${checked?"border-indigo-400 ring-2 ring-indigo-100":"border-slate-200"}`:"border-slate-200"}`}>
              <div><p className="font-bold text-slate-800">{d.name}</p><p className="text-xs text-slate-500">{d.words.length}개 단어</p></div>
              {multiMode?
                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${checked?"bg-indigo-500 border-indigo-500":"border-slate-300"}`}>{checked&&<CheckCircle className="w-4 h-4 text-white"/>}</div>
              :<button onClick={()=>openSingle(d)} className="bg-indigo-500 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1"><Layers className="w-4 h-4"/>시작</button>}
            </div>
          );
        })}
        {multiMode&&selectedIds.length>0&&
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-20">
            <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
              <span className="text-sm text-slate-600">선택 {selectedIds.length}개 · 총 {selectedWordCount}장</span>
              <button onClick={startMerged} className="bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-1"><Layers className="w-4 h-4"/>학습 시작</button>
            </div>
          </div>
        }
      </div>
    );
  }
  if(done){
    const checkedCount=session.words.filter(w=>checked.has(wordKey(w))).length;
    const reviewed=idx+1;
    return(
      <div>
        <button onClick={back} className="text-slate-500 text-sm mb-3 hover:underline">← 목록으로</button>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
          <p className="text-lg font-bold text-slate-800 mb-1">학습 완료! 🎉</p>
          <p className="text-sm text-slate-500 mb-5">{session.name} · {session.words.length}장 중 {reviewed}장 학습 · 체크 {checkedCount}개</p>
          <div className="flex flex-col gap-2">
            {checkedCount>0&&<button onClick={reviewChecked} className="bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4"/>체크한 {checkedCount}개 다시 보기</button>}
            <button onClick={restart} className="bg-indigo-50 text-indigo-600 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1"><RotateCcw className="w-4 h-4"/>처음부터 다시</button>
          </div>
        </div>
      </div>
    );
  }
  const w=session.words[idx];
  const isChecked=checked.has(wordKey(w));
  return(
    <div>
      <button onClick={back} className="text-slate-500 text-sm mb-3 hover:underline">← 목록으로</button>
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-slate-800 text-lg">{session.name}</h2>
        <span className="text-xs text-slate-400">{idx+1} / {session.words.length}{checked.size>0&&` · 체크 ${checked.size}개`}</span>
      </div>
      <div className="relative">
        <button onClick={()=>toggleCheck(w)} aria-label="체크" className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${isChecked?"bg-emerald-500 border-emerald-500 text-white":"bg-white/90 border-slate-200 text-slate-300"}`}>
          <CheckCircle className="w-4 h-4"/>
        </button>
        <div onClick={()=>setFlipped(f=>!f)} style={{perspective:"1000px"}} className="cursor-pointer select-none">
          <div style={{transformStyle:"preserve-3d",transition:"transform 0.5s",transform:flipped?"rotateY(180deg)":"none"}} className="relative h-64">
            <div style={{backfaceVisibility:"hidden"}} className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex flex-col items-center justify-center p-6 text-white shadow-lg">
              <span className="text-3xl font-bold text-center">{w.meaning}</span>
              <span className="text-xs mt-4 opacity-70">탭하여 한국어 보기 · Tap to flip</span>
            </div>
            <div style={{backfaceVisibility:"hidden",transform:"rotateY(180deg)"}} className="absolute inset-0 bg-white border-2 border-indigo-200 rounded-2xl flex flex-col items-center justify-center p-6 shadow-lg">
              <span className="text-3xl font-bold text-indigo-700 text-center">{w.word}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 mt-5">
        <button onClick={()=>go(-1)} className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm"><ArrowLeft className="w-5 h-5"/></button>
        <button onClick={()=>setFlipped(f=>!f)} className="px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 text-sm font-medium flex items-center gap-1"><RotateCcw className="w-4 h-4"/>뒤집기</button>
        <button onClick={()=>go(1)} className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shadow-sm"><ArrowRight className="w-5 h-5"/></button>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3">
        <button onClick={shuffle} className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"><Shuffle className="w-3.5 h-3.5"/>섞기</button>
        <button onClick={stopHere} className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1"><FlagTriangleRight className="w-3.5 h-3.5"/>여기까지 하기</button>
      </div>
    </div>
  );
}

function TeacherAnn({data,save}){
  const ann=data.ann;const[text,setText]=useState("");
  const post=async()=>{if(!text.trim())return;await save("ann",[{id:Date.now()+"",text:text.trim(),createdAt:new Date().toISOString()},...ann]);setText("");};
  const del=async id=>{await save("ann",ann.filter(a=>a.id!==id));};
  return(
    <div>
      <SectionTitle ko="공지사항" en="Announcements"/>
      <div className="bg-white rounded-xl p-4 mb-3 border border-slate-200 space-y-2">
        <textarea placeholder="학생들에게 공지할 내용..." value={text} onChange={e=>setText(e.target.value)} rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-purple-400 focus:outline-none"/>
        <button onClick={post} className="bg-purple-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"><Megaphone className="w-4 h-4"/>공지 올리기</button>
      </div>
      {ann.length===0?<Empty ko="아직 공지가 없습니다" en="No announcements yet"/>:ann.map(a=>(
        <div key={a.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
          <div className="flex justify-between gap-2"><p className="text-sm text-slate-700 whitespace-pre-wrap flex-1">{a.text}</p><button onClick={()=>del(a.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button></div>
          <p className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString("ko-KR")}</p>
        </div>
      ))}
    </div>
  );
}

function StudentAnn({ann}){
  return(<div><SectionTitle ko="📢 공지사항" en="Announcements"/>
    {ann.length===0?<Empty ko="공지가 없습니다" en="No announcements yet"/>:ann.map(a=>(
      <div key={a.id} className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-2">
        <p className="text-sm text-slate-700 whitespace-pre-wrap">{a.text}</p>
        <p className="text-xs text-slate-400 mt-2">{new Date(a.createdAt).toLocaleString("ko-KR")}</p>
      </div>
    ))}
  </div>);
}

function StudentMat({mat}){
  const [open,setOpen]=useState("");
  return(<div><SectionTitle ko="📚 학습 자료" en="Materials"/>
    {mat.length===0?<Empty ko="자료가 없습니다" en="No materials yet"/>:mat.map((m,idx)=>{
      const mid=m.id||String(idx);
      return(
        <div key={mid} className="bg-white rounded-xl mb-2 border border-slate-200">
          <button onClick={()=>setOpen(open===mid?"":mid)} className="w-full flex items-center justify-between px-4 py-3 text-left">
            <span className="font-medium text-slate-800 text-sm flex-1 min-w-0 truncate">{m.title}</span>
            {open===mid?<ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0"/>:<ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0"/>}
          </button>
          {open===mid&&<div className="px-4 pb-4 border-t border-slate-100 pt-3"><MatContent m={m}/></div>}
        </div>
      );
    })}
  </div>);
}

function StudentTB({tb}){
  const koUrl=t=>t.ko||t.koreanUrl||"";
  const enUrl=t=>t.en||t.englishUrl||"";
  return(<div><SectionTitle ko="📖 수업교재" en="Textbooks"/>
    <p className="text-xs text-slate-500 mb-3 italic">세종학당 교재를 다운받으세요 / View or download</p>
    {tb.map(t=>(
      <div key={t.id} className="bg-white rounded-xl p-4 mb-3 border border-slate-200">
        <div className="flex gap-2 flex-wrap mb-2"><LvBadge lv={t.lv||t.level}/>{(t.sl||t.sejongLevel)&&<span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">Sejong {t.sl||t.sejongLevel}</span>}</div>
        <p className="font-bold text-slate-800 mb-1">{t.title}</p>
        {(t.desc||t.description)&&<p className="text-xs text-slate-500 whitespace-pre-wrap mb-3">{t.desc||t.description}</p>}
        <div className="flex flex-col gap-2">
          {koUrl(t)&&<a href={koUrl(t)} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2">🇰🇷 한국어판 열기 <ExternalLink className="w-4 h-4"/></a>}
          {enUrl(t)&&<a href={enUrl(t)} target="_blank" rel="noopener noreferrer" className="w-full border-2 border-indigo-300 text-indigo-600 py-3 rounded-xl text-sm font-medium text-center flex items-center justify-center gap-2 bg-white">🇺🇸 English Version <ExternalLink className="w-4 h-4"/></a>}
        </div>
      </div>
    ))}
  </div>);
}

function StudentVoc({voc}){
  const [sel,setSel]=useState(null);const [mode,setMode]=useState(null);
  const [ans,setAns]=useState({});const [checked,setChecked]=useState(false);
  const back=()=>{setSel(null);setMode(null);setAns({});setChecked(false);};
  const printPDF=(s, isPractice=false)=>{
    const meanCell=w=>isPractice?'<td style="height:28px">&nbsp;</td>':`<td>${w.meaning}</td>`;
    const subtitle=isPractice?'<p style="font-size:11px;color:#94a3b8;margin-bottom:12px">연습용 워크시트 · 영어 뜻을 직접 적어보세요</p>':"";
    const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${s.name}</title><style>body{font-family:sans-serif;padding:24px;max-width:600px;margin:auto}h1{font-size:18px;color:#4338ca;border-bottom:2px solid #e0e7ff;padding-bottom:6px;margin-bottom:12px}table{width:100%;border-collapse:collapse}th{background:#f1f5f9;font-size:12px;padding:8px 10px;text-align:left;border:1px solid #e2e8f0}td{padding:8px 10px;border:1px solid #e2e8f0;font-size:13px}tr:nth-child(even){background:#f8fafc}</style></head><body><h1>📖 ${s.name}</h1>${subtitle}<p style="font-size:11px;color:#94a3b8;margin-bottom:12px">May's Korean Class · ${new Date().toLocaleDateString("ko-KR")}</p><table><thead><tr><th>#</th><th>단어</th><th>뜻</th></tr></thead><tbody>${s.words.map((w,i)=>`<tr><td>${i+1}</td><td>${w.word}</td>${meanCell(w)}</tr>`).join("")}</tbody></table></body></html>`;
    const blob=new Blob([html],{type:"text/html"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");a.href=url;a.download=`${s.name}.html`;
    document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);
  };
  if(!sel)return(<div><SectionTitle ko="📝 단어장" en="Vocabulary"/>
    {voc.length===0?<Empty ko="단어장이 없습니다" en="No vocabulary sets yet"/>:voc.map(s=>(
      <div key={s.id} className="bg-white rounded-xl p-4 mb-3 border border-slate-200">
        <div className="mb-3">
          <p className="font-bold text-slate-800">{s.name}</p>
          <p className="text-xs text-slate-500">{s.words.length}개 단어</p>
          <p className="text-xs text-slate-400 mt-1 truncate">{s.words.slice(0,4).map(w=>`${w.word} / ${w.meaning}`).join(" · ")}{s.words.length>4&&" ···"}</p>
        </div>
        <div className="flex gap-2 mb-2">
          <button onClick={()=>{setSel(s);setMode("view");}} className="flex-1 bg-indigo-500 text-white py-2.5 rounded-xl text-sm font-medium">📖 보기</button>
          <button onClick={()=>{setSel(s);setMode("practice");}} className="flex-1 border-2 border-indigo-200 text-indigo-600 py-2.5 rounded-xl text-sm font-medium">✏️ 연습</button>
        </div>
        <button onClick={()=>printPDF(s)} className="w-full bg-purple-50 border-2 border-purple-200 text-purple-700 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2"><Download className="w-4 h-4"/>PDF 다운로드</button>
      </div>
    ))}
  </div>);
  if(mode==="view")return(<div>
    <button onClick={back} className="text-slate-500 text-sm mb-3 hover:underline">← 목록으로</button>
    <div className="flex justify-between items-center mb-3">
      <h2 className="font-bold text-slate-800 text-lg">📖 {sel.name}</h2>
      <button onClick={()=>printPDF(sel)} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm"><Download className="w-3.5 h-3.5"/>PDF 다운로드</button>
    </div>
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full text-sm border-collapse">
        <thead><tr className="bg-slate-50 border-b border-slate-200">
          <th className="text-xs text-slate-400 font-medium px-2 py-2 text-left w-8">#</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">단어</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">뜻</th>
        </tr></thead>
        <tbody>{sel.words.map((w,i)=>(
          <tr key={i} className={`border-b border-slate-100 ${i%2===1?"bg-slate-50/50":""}`}>
            <td className="text-xs text-slate-400 px-2 py-2.5">{i+1}</td>
            <td className="font-medium text-slate-800 px-3 py-2.5">{w.word}</td>
            <td className="px-3 py-2.5 text-slate-600">{w.meaning}</td>
          </tr>
        ))}</tbody>
      </table>
    </div>
  </div>);
  const score=checked?sel.words.filter((w,i)=>ans[i]?.trim().toLowerCase()===w.meaning.trim().toLowerCase()).length:0;
  return(<div>
    <button onClick={back} className="text-slate-500 text-sm mb-3 hover:underline">← 목록으로</button>
    <div className="flex justify-between items-center mb-1">
      <h2 className="font-bold text-slate-800 text-lg">✏️ {sel.name}</h2>
      <button onClick={()=>printPDF(sel,true)} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1 shadow-sm"><Download className="w-3.5 h-3.5"/>PDF 다운로드</button>
    </div>
    <p className="text-xs text-slate-400 italic mb-3">뜻을 영어로 입력하세요 / Fill in the English meaning</p>
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4">
      <table className="w-full text-sm border-collapse">
        <thead><tr className="bg-slate-50 border-b border-slate-200">
          <th className="text-xs text-slate-400 font-medium px-2 py-2 text-left w-8">#</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">단어</th>
          <th className="text-xs text-slate-500 font-medium px-3 py-2 text-left">뜻</th>
        </tr></thead>
        <tbody>{sel.words.map((w,i)=>{
          const ua=ans[i]?.trim().toLowerCase()||"";const co=w.meaning.trim().toLowerCase();
          const ok=checked&&ua===co;const bad=checked&&ua!==co;
          return(<tr key={i} className={`border-b border-slate-100 ${ok?"bg-green-50":bad?"bg-red-50":i%2===1?"bg-slate-50/50":""}`}>
            <td className="text-xs text-slate-400 px-2 py-2">{i+1}</td>
            <td className="font-medium text-slate-800 px-3 py-2 whitespace-nowrap">{w.word}</td>
            <td className="px-2 py-1.5">
              <div className="flex items-center gap-1">
                <input value={ans[i]||""} onChange={e=>setAns({...ans,[i]:e.target.value})} disabled={checked} placeholder="meaning..." className={`w-full min-w-0 px-2 py-1 rounded border text-sm focus:outline-none ${ok?"border-green-400 text-green-700":bad?"border-red-300 text-red-700":"border-slate-200 focus:border-indigo-400"}`}/>
                {ok&&<CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0"/>}
                {bad&&<XCircle className="w-4 h-4 text-red-400 flex-shrink-0"/>}
              </div>
              {bad&&<p className="text-xs text-green-600 mt-0.5">✓ {w.meaning}</p>}
            </td>
          </tr>);
        })}</tbody>
      </table>
    </div>
    {!checked
      ?<button onClick={()=>setChecked(true)} className="bg-indigo-500 text-white px-6 py-2.5 rounded-xl font-medium w-full">채점하기 / Check</button>
      :<div className="space-y-2">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center"><span className="font-bold text-indigo-700 text-xl">{score}/{sel.words.length}</span><span className="text-slate-500 text-sm ml-2">정답</span></div>
        <button onClick={()=>{setAns({});setChecked(false);}} className="w-full bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-sm">다시 풀기 / Retry</button>
      </div>
    }
  </div>);
}

function AITutor(){
  const [msgs,setMsgs]=useState([{role:"assistant",content:"안녕하세요! 한국어 도우미입니다 😊\nHi! Ask me anything about Korean — in Korean or English!"}]);
  const [inp,setInp]=useState("");const [loading,setLoading]=useState(false);const endRef=useRef(null);
  useEffect(()=>endRef.current?.scrollIntoView({behavior:"smooth"}),[msgs]);
  const send=async()=>{
    if(!inp.trim()||loading)return;
    const um={role:"user",content:inp.trim()};const nm=[...msgs,um];setMsgs(nm);setInp("");setLoading(true);
    try{
      const apiKey=process.env.REACT_APP_ANTHROPIC_API_KEY;
      if(!apiKey){setMsgs([...nm,{role:"assistant",content:"API 키가 설정되지 않았습니다. Vercel 환경변수 REACT_APP_ANTHROPIC_API_KEY를 추가해주세요."}]);setLoading(false);return;}
      const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-haiku-4-5-20251001",max_tokens:1000,system:"You are a friendly Korean language tutor for beginners. Always answer bilingually: Korean first, then '---', then English explanation.",messages:nm.map(m=>({role:m.role,content:m.content}))})});
      const d=await r.json();
      setMsgs([...nm,{role:"assistant",content:d.content?.find(c=>c.type==="text")?.text||"다시 시도해주세요."}]);
    }catch{setMsgs([...nm,{role:"assistant",content:"오류가 발생했어요. / Error occurred."}]);}
    finally{setLoading(false);}
  };
  return(<div>
    <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center gap-2"><Sparkles className="w-5 h-5 text-purple-500"/>AI 한국어 도우미</h2>
    <p className="text-xs text-slate-500 mb-3 italic">Ask in Korean or English!</p>
    <div className="bg-white rounded-xl border border-slate-200 flex flex-col" style={{height:"60vh",minHeight:"300px"}}>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.map((m,i)=><div key={i} className={`flex ${m.role==="user"?"justify-end":"justify-start"}`}><div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${m.role==="user"?"bg-indigo-500 text-white":"bg-slate-100 text-slate-800"}`}>{m.content}</div></div>)}
        {loading&&<div className="flex justify-start"><div className="bg-slate-100 px-3 py-2 rounded-2xl"><Loader2 className="w-4 h-4 animate-spin text-slate-500"/></div></div>}
        <div ref={endRef}/>
      </div>
      <div className="border-t border-slate-200 p-2 flex gap-2">
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder="질문 입력... / Type here..." disabled={loading} className="flex-1 px-3 py-2 rounded-lg border border-slate-200 focus:border-indigo-400 focus:outline-none text-sm"/>
        <button onClick={send} disabled={loading||!inp.trim()} className="bg-indigo-500 text-white px-3 py-2 rounded-lg disabled:opacity-50"><Send className="w-4 h-4"/></button>
      </div>
    </div>
  </div>);
}
