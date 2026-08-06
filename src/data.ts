import { ModelData } from './types';

export const MODELS: ModelData[] = [
  {
    id: 'roadster',
    name: 'roadster',
    subtitle: 'Autograph Edition',
    price: '£64,995',
    priceNum: 64995,
    specs: {
      acceleration: { label: '.0-62 MPH', value: '3.6', suffix: 'seconds*' },
      weight: { label: '.weight', value: '995', suffix: 'kg*' },
      range: { label: '.range', value: '280', suffix: 'WLTP*' },
      price: { label: '.price', value: '64,995', suffix: '£*' }
    },
    heroImage: 'https://cdn.prod.website-files.com/689c67bcc7193a0725e2aecf/68b54c73e45bf5c218603026_longbow-roadster.jpg',
    galleryMedia: [
      {
        type: 'video',
        src: 'https://e41e5de1dfec4f20b8f5f9df2754e51a.bj6.agentos-app.net/',
        poster: 'https://cdn.prod.website-files.com/689c67bcc7193a0725e2aecf/69946f2c15c8537fcbb8b701_Block-1-boomer-poster.webp'
      },
      {
        type: 'image',
        src: '/PICKUP0.jpg'
      },
      {
        type: 'image',
        src: 'https://cdn.prod.website-files.com/689c67bcc7193a0725e2aecf/68c8be2091458a9a527a29b3_longbow-roadster-image-3.jpg'
      }
    ],
    reservationOptions: [
      {
        id: 'roadster_autograph',
        title: 'Autograph Edition Reservation',
        description: 'Limited to 25 numbered examples globally',
        price: '£5,000',
        priceNum: 5000,
        badge: '.01'
      },
      {
        id: 'roadster_luminary',
        title: 'Luminary Edition Reservation',
        description: 'Limited to 150 bespoke Roadster examples',
        price: '£1,000',
        priceNum: 1000,
        badge: '.02'
      }
    ]
  },
  {
    id: 'speedster',
    name: 'speedster',
    subtitle: 'Limited Edition',
    price: '£85,000',
    priceNum: 85000,
    specs: {
      acceleration: { label: '.0-62 MPH', value: '3.2', suffix: 'seconds*' },
      weight: { label: '.weight', value: '950', suffix: 'kg*' },
      range: { label: '.range', value: '260', suffix: 'WLTP*' },
      price: { label: '.price', value: '85,000', suffix: '£*' }
    },
    heroImage: 'https://cdn.prod.website-files.com/689c67bcc7193a0725e2aecf/68b69e8f8dd1b2b2cb712fb3_longbow-speedster-poster.jpg',
    galleryMedia: [
      {
        type: 'video',
        src: '/video/speedster_boomerang.mp4',
        poster: 'https://cdn.prod.website-files.com/689c67bcc7193a0725e2aecf/68b69e8f8dd1b2b2cb712fb3_longbow-speedster-poster.jpg'
      },
      {
        type: 'video',
        src: '/video/speedster_track_block.mp4',
        poster: 'https://cdn.prod.website-files.com/689c67bcc7193a0725e2aecf/68c8b1f8976bb77317b3ab7c_longbow-speedster-poster-2.jpg'
      }
    ],
    reservationOptions: [
      {
        id: 'speedster_heritage',
        title: 'Heritage Autograph Reservation',
        description: 'Limited to 15 bespoke carbon composite examples',
        price: '£7,500',
        priceNum: 7500,
        badge: '.01'
      },
      {
        id: 'speedster_classic',
        title: 'Classic Speedster Reservation',
        description: 'Limited to 85 track-focused Speedsters',
        price: '£2,000',
        priceNum: 2000,
        badge: '.02'
      }
    ]
  }
];

export const COLORS = [
  { name: 'Liquid Silver', hex: '#8A9597', code: 'liquid_silver', previewStyle: 'bg-radial from-slate-300 to-slate-500' },
  { name: 'Racing Green', hex: '#004225', code: 'racing_green', previewStyle: 'bg-radial from-emerald-800 to-emerald-950' },
  { name: 'Monaco Red', hex: '#800020', code: 'monaco_red', previewStyle: 'bg-radial from-red-700 to-red-950' },
  { name: 'Carbon Black', hex: '#1C1C1C', code: 'carbon_black', previewStyle: 'bg-radial from-neutral-700 to-neutral-900' }
];

export const WHEELS = [
  { name: 'Autograph Aero 20"', code: 'aero', desc: 'Symmetrical blade aerodynamics in matte gray finish' },
  { name: 'Luminary Forged Multi-spoke 21"', code: 'multi_spoke', desc: 'Diamond-cut face with metallic silver pockets' },
  { name: 'Track Titanium Forged 20"', code: 'track_titanium', desc: 'Ultra-light high performance structural rim' }
];

export const INTERIORS = [
  { name: 'Obsidian & Matte Carbon', code: 'obsidian', desc: 'Premium deep charcoal Nappa leather with dry-carbon weave' },
  { name: 'Crimson Alcantara Sport', code: 'crimson', desc: 'Fiery racing trim with red stitching and microfiber inserts' },
  { name: 'English Heritage Tan Hide', code: 'tan_hide', desc: 'Hand-stitched full-grain tan leather with premium walnut accents' }
];

export const GALLERY_VIDEOS = {
  hover_bg: '/video/hmi_hover_interaction.mp4',
  footer_bg: '/video/footer_cockpit_motion.mp4',
};
