import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faMapMarkerAlt,
  faArrowsAltH,
  faStopwatch,
  faCircleNotch
} from '@fortawesome/free-solid-svg-icons';
import {
  faCalendarAlt,
  faClock
} from '@fortawesome/free-regular-svg-icons';
import {
  faGithub
} from '@fortawesome/free-brands-svg-icons';

library.add(
  // solid
  faMapMarkerAlt,
  faArrowsAltH,
  faStopwatch,
  faCircleNotch,
  // regular
  faCalendarAlt,
  faClock,
  // brand
  faGithub
);

Vue.component('font-awesome-icon', FontAwesomeIcon);
