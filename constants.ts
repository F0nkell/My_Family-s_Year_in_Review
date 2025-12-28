// Импортируем медиа (фото и видео)
// Убедитесь, что пути совпадают с вашими файлами в папке assets/media
import media1 from './assets/media/1.mp4';
import media2 from './assets/media/2.mp4'; // Пример видео
import media3 from './assets/media/3.jpg';
import media4 from './assets/media/4.jpg';
import media5 from './assets/media/5.mp4'; // Пример видео
import media6 from './assets/media/6.jpg';
import media7 from './assets/media/7.jpg';
import media8 from './assets/media/8.jpg';
import media9 from './assets/media/9.jpg';
import media10 from './assets/media/10.jpg';

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
    title: 'Весеннее Тепло',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Живые моменты нашей весны.',
    animationType: 'bloom',
    layout: 'top-right'
  },
  {
    id: 3,
    source: media3,
    type: 'image',
    title: 'Золотые Каникулы',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Самые яркие закаты этого лета.',
    animationType: 'slide-3d',
    layout: 'side-strip'
  },
  {
    id: 4,
    source: media4,
    type: 'image',
    title: 'Осенний Уют',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Шум дождя за окном и тепло нашего дома.',
    animationType: 'stack',
    layout: 'centered-float'
  },
  {
    id: 5,
    source: media5,
    type: 'video', // Еще одно видео
    title: 'Наши Традиции',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Как мы готовили тот самый ужин.',
    animationType: 'drift',
    layout: 'bottom-left'
  },
  {
    id: 6,
    source: media6,
    type: 'image',
    title: 'Моменты Счастья',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Взгляд, улыбка, поддержка.',
    animationType: 'reveal-circle',
    layout: 'top-right'
  },
  {
    id: 7,
    source: media7,
    type: 'image',
    title: 'Маленькие Победы',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Мы гордимся успехами друг друга.',
    animationType: 'flip-gold',
    layout: 'side-strip'
  },
  {
    id: 8,
    source: media8,
    type: 'image',
    title: 'Вечерние Разговоры',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Когда можно быть собой.',
    animationType: 'glitch-soft',
    layout: 'centered-float'
  },
  {
    id: 9,
    source: media9,
    type: 'image',
    title: 'Вдохновение',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Новые мечты.',
    animationType: 'whirl',
    layout: 'bottom-left'
  },
  {
    id: 10,
    source: media10,
    type: 'image',
    title: 'На Пороге Чуда',
    description: 'ВСТАВЬ СЮДА ТЕКСТ - Мы завершаем этот круг.',
    animationType: 'kaleidoscope',
    layout: 'top-right'
  }
];

export const FINAL_WISH = "Дорогие мои, пусть этот конверт откроется в самую волшебную минуту года. Желаю нам в 2026-м сохранить ту искру, которая делает нас семьей. Пусть каждый день будет полон любви, здоровья и новых совместных открытий. С Новым Годом!";