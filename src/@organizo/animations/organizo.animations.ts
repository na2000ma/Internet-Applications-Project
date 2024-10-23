import {expandCollapse} from '@organizo/animations/expand-collapse';
import {shake} from '@organizo/animations/shake';
import {zoomIn, zoomOut} from '@organizo/animations/zoom';
import {
  fadeIn,
  fadeInBottom,
  fadeInLeft,
  fadeInRight,
  fadeInTop,
  fadeOut,
  fadeOutBottom,
  fadeOutLeft,
  fadeOutRight,
  fadeOutTop
} from '@organizo/animations/fade';
import {
  slideInBottom,
  slideInLeft,
  slideInRight,
  slideInTop,
  slideOutBottom,
  slideOutLeft,
  slideOutRight,
  slideOutTop
} from '@organizo/animations/slide';

export const organizoAnimations = [
  expandCollapse,
  fadeIn, fadeInTop, fadeInBottom, fadeInLeft, fadeInRight,
  fadeOut, fadeOutTop, fadeOutBottom, fadeOutLeft, fadeOutRight,
  shake,
  slideInTop, slideInBottom, slideInLeft, slideInRight,
  slideOutTop, slideOutBottom, slideOutLeft, slideOutRight,
  zoomIn, zoomOut,
];
