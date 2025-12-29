// Импортируем медиа (фото и видео)
// Убедитесь, что пути совпадают с вашими файлами в папке assets/media
import media1 from './assets/media/1.mp4';
import media2 from './assets/media/2.jpg';
import media3 from './assets/media/3.jpg';
import media4 from './assets/media/4.jpg';
import media5 from './assets/media/5.jpg';
import media6 from './assets/media/6.mp4';
import media7 from './assets/media/7.jpg';
import media8 from './assets/media/8.jpg';
import media9 from './assets/media/9.jpg';
import media10 from './assets/media/10.jpg';
import media11 from './assets/media/11.jpg';

export interface FamilyMember {
  name: string;
  telegram: string;
}

export type LayoutType = 'bottom-left' | 'top-right' | 'centered-float' | 'side-strip';
export type AnimationStyle = 'frost' | 'bloom' | 'slide-3d' | 'stack' | 'drift' | 'glitch-soft' | 'kaleidoscope' | 'reveal-circle' | 'flip-gold' | 'whirl';

export type MediaType = 'image' | 'video';

export interface Memory {
  id: number;
  source: string;       // Переименовали image -> source
  type: MediaType;      // Добавили тип контента
  title: string;
  description: string;
  animationType: AnimationStyle;
  layout: LayoutType;
}

export const FAMILY_MEMBERS: FamilyMember[] = [
  { name: 'Мама', telegram: 'your_mom' },
  { name: 'Папа', telegram: 'your_dad' },
  { name: 'Сестра', telegram: 'your_sister' },
  { name: 'Брат', telegram: 'your_brother' },
];

export const MEMORIES: Memory[] = [
  {
    id: 1,
    source: media1,
    type: 'video',
    title: 'Заряд энергии на Год',
    description: 'Год начинался экстримально! (Даже слишком 😱)',
    animationType: 'frost',
    layout: 'bottom-left'
  },
  {
    id: 2,
    source: media2,
    type: 'video', // Указываем, что это ВИДЕО
    title: 'Работа, Работа, и еще раз Работа',
    description: 'А тут один родственник стал на взрослую дорогу, и нашел  себе первую официальную работу (Похвастался чуток 😊)',
    animationType: 'bloom',
    layout: 'top-right'
  },
  {
    id: 3,
    source: media3,
    type: 'image',
    title: 'Главное предательство года',
    description: 'А вот тут кого то оставили в Иваново, а сами уехали на моря 😠',
    animationType: 'slide-3d',
    layout: 'side-strip'
  },
  {
    id: 4,
    source: media4,
    type: 'image',
    title: 'День Рождения Вани',
    description: 'Наконец вся семья смогла собраться за столом 🥳',
    animationType: 'stack',
    layout: 'centered-float'
  },
  {
    id: 5,
    source: media5,
    type: 'image', // Еще одно видео
    title: 'До скорых встреч!',
    description: 'Провожаем одного из близких людей',
    animationType: 'drift',
    layout: 'bottom-left'
  },
  {
    id: 6,
    source: media6,
    type: 'video',
    title: 'Подростающее поколение',
    description: 'Тяну Сашку за уши чтоб рос быстрее 😁',
    animationType: 'reveal-circle',
    layout: 'top-right'
  },
  {
    id: 7,
    source: media7,
    type: 'image',
    title: 'Золотой отпуск',
    description: 'Пережили неприятную ситуацию и уехал в незапланированный отпуск',
    animationType: 'flip-gold',
    layout: 'side-strip'
  },
  {
    id: 8,
    source: media8,
    type: 'image',
    title: 'Назад в Будущее',
    description: 'После главных событий года, решил почуствовать себя ребенком в кругу близких людей',
    animationType: 'glitch-soft',
    layout: 'centered-float'
  },
  {
    id: 9,
    source: media9,
    type: 'image',
    title: 'Я знаю ты далеко, между нами города, города',
    description: 'Ровно 21 час 1 минута 2 секунды, проболтал с любимой Мамой, почти целые сутки без остановки!',
    animationType: 'whirl',
    layout: 'bottom-left'
  },
  {
    id: 10,
    source: media10,
    type: 'image',
    title: 'Я знаю ты далеко, между нами города, города',
    description: 'С отцом я общался 1 час 21 минута 50 секунд. Сразу видно, оба занятые люди 😎',
    animationType: 'kaleidoscope',
    layout: 'top-right'
  },
  {
    id: 11,
    source: media11,
    type: 'image',
    title: 'Я знаю ты далеко, между нами города, города',
    description: 'С любимой Бульбулей мы наобщались целых 1 час 29 минут 18 секунд',
    animationType: 'bloom',
    layout: 'top-right'
  },
];

export const FINAL_WISH = "Дорогие мои! Здесь можно написать самые теплые слова для нашей семьи...";