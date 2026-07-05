import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircleUser,
  faHouse,
  faImage,
  faUser,
  faMapLocationDot,
  faCheck,
  faXmark,
  faList,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import {
  faLine,
  faFacebook,
  faGoogle
} from "@fortawesome/free-brands-svg-icons";
// import {} from "@fortawesome/free-regular-svg-icons";

/* https://fontawesome.com/v6/search?o=r&ic=free&s=solid&ip=classic */
library.add(
  faLine,
  faFacebook,
  faGoogle,
  faCircleUser,
  faHouse,
  faImage,
  faUser,
  faMapLocationDot,
  faCheck,
  faXmark,faList,faAngleDown);

export default FontAwesomeIcon;

/**
 * <font-awesome-icon :icon="['fab', 'line']" />
 * 
 * <font-awesome-icon :icon="['fab', 'facebook']" />
 * 
 * <font-awesome-icon :icon="['fab', 'google']" />
 * 
 * 預設大頭照
 * <font-awesome-icon :icon="['fas', 'circle-user']" />
 * 
 * <font-awesome-icon :icon="['fas', 'house']" />
 * 
 * <font-awesome-icon :icon="['fas', 'image']" />
 * 
 * <font-awesome-icon :icon="['fas', 'user']" />
 * 
 * <font-awesome-icon :icon="['fas', 'map-location-dot']" />
 * 
 * <font-awesome-icon :icon="['fas', 'check']" />
 * 
 * <font-awesome-icon :icon="['fas', 'xmark']" />
 * 
 * Alert
 * background-image
 * certificate
 * Solid
 * <FontAwesomeIcon icon={faCertificate} />
 * <font-awesome-icon :icon="['fas', 'certificate']" />
 * 
 * Success Alert
 * color-success-50 dark:color-success-500/15 #ecfdf3
 * color-success-600 dark:color-success-500 #039855
 * circle-check
 * Regular
 * <FontAwesomeIcon icon={faCircleCheck} />
 * <font-awesome-icon :icon="['far', 'circle-check']" />
 * 
 * 
 * Info Alert
 * color-blue-light-50 dark:color-blue-light-500/15 #f0f9ff
 * color-blue-light-500 dark:color-blue-light-500 #0ba5ec
 * info
 * Regular
 * <FontAwesomeIcon icon={faInfo} />
 * <font-awesome-icon :icon="['fas', 'info']" />
 * 
 * Warning Alert 
 * color-warning-50 dark:color-warning-500/15 #fffaeb
 * color-warning-600 dark:color-orange-400 #dc6803
 * exclamation
 * Regular
 * <FontAwesomeIcon icon={faExclamation} />
 * <font-awesome-icon :icon="['fas', 'exclamation']" />
 * 
 * Danger Alert
 * color-error-50 dark:color-error-500/15 #fef3f2
 * color-error-600 dark:color-error-500 #d92d20
 * circle-xmark
 * Regular
 * <FontAwesomeIcon icon={faCircleXmark} />
 * <font-awesome-icon :icon="['far', 'circle-xmark']" />
 * 
 * 
 * 
 * relative flex items-center justify-center z-1 mb-7
 * svg
 * absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2
 * svg
 */