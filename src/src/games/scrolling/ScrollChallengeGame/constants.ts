import { ScrollChallengeLevel } from './types';

export const SCROLL_CHALLENGE_STAR_LEVELS: ScrollChallengeLevel[] = [
  {
    level: 1,
    target: 3, // Number of targets to hit
    minTargetPosition: 25,
    maxTargetPosition: 775,
    targetZoneSize: 80,
    scrollSensitivity: 10,
    description: 'Align 5 targets by scrolling',
  },
  {
    level: 2,
    target: 4,
    minTargetPosition: 25,
    maxTargetPosition: 775,
    targetZoneSize: 70,
    scrollSensitivity: 8,
    description: 'Align 8 targets by scrolling',
  },
  {
    level: 3,
    target: 5,
    minTargetPosition: 25,
    maxTargetPosition: 775,
    targetZoneSize: 60,
    scrollSensitivity: 5,
    description: 'Align 10 targets by scrolling',
  },
  {
    level: 4,
    target: 6,
    minTargetPosition: 25,
    maxTargetPosition: 775,
    targetZoneSize: 50,
    scrollSensitivity: 3,
    description: 'Align 12 targets by scrolling',
  },
  {
    level: 5,
    target: 7,
    minTargetPosition: 25,
    maxTargetPosition: 775,
    targetZoneSize: 40,
    scrollSensitivity: 1,
    description: 'Align 15 targets by scrolling',
  },
];

export const TRACK_WIDTH = 800; // Width of the track for alignment
export const SLIDER_SIZE = 50; // Size of the player's slider