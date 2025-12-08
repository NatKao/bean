const CONFIG = {
  SystemWeb: "TMPJWeb",

  System: "TMPJ",

  SystemDesc: "共用模板Template",

  API_URL: window.location.protocol + "//" + window.location.host,

  API_DISPATCHER: "/api",

  USER_URL: "/login",

  LOGOUT_URL: "/logout",

  NODE_ENV_DISPLAY: {
    DEV: "development",
    TEST: "testing",
    PROD: "production"
  },

  INIT() {
    if (import.meta.env.NODE_ENV == CONFIG.NODE_ENV_DISPLAY.DEV) {
      CONFIG.API_URL = "/static/data";
    } else {
      CONFIG.API_URL += "/" + CONFIG.SystemWeb + CONFIG.API_DISPATCHER;
    }

    // setting logout url.
    if (import.meta.env.VITE_API_HOST != "/") {
      CONFIG.LOGOUT_URL =
        import.meta.env.VITE_API_HOST + CONFIG.LOGOUT_URL + "/";
    }
  }
};

export default CONFIG;
