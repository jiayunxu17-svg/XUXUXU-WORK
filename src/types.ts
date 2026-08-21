export interface SpecItem {
  label: string;
  value: string;
  suffix: string;
}

export interface ModelData {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  specs: {
    acceleration: SpecItem;
    weight: SpecItem;
    range: SpecItem;
    price: SpecItem;
  };
  heroImage: string;
  galleryMedia: Array<{
    type: 'image' | 'video';
    src: string;
    poster?: string;
  }>;
  reservationOptions: Array<{
    id: string;
    title: string;
    description: string;
    price: string;
    priceNum: number;
    badge: string;
  }>;
}

export interface CustomizationState {
  color: string;
  wheels: string;
  interior: string;
}

export interface ReservationDetails {
  name: string;
  email: string;
  optionId: string;
  modelId: string;
  color: string;
  wheels: string;
  interior: string;
  vin: string;
  date: string;
}

export interface ProjectExtendedDetails {
  id: string;
  title: string;
  subtitle?: string;
  titleEn?: string;
  role?: string;
  category: string;
  year: string;
  imageSrc: string;
  subImageSrc: string;
  techs: string[];
  backgroundIntro: string;
  dimensions: { title: string; desc: string }[];
  breakthroughs: string[];
  designSystem: { title: string; detail: string; accent: string };
}

