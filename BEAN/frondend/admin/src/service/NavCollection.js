const nav = {
  menu: [
    {
      id: "admin",
      name: "總部人員管理",
      desc: "總部人員管理",
      realURL: true,
      target: "_self",
      url: "/admin",
      class: "cl-menu-header"
    },
    {
      id: "hs_project",
      name: "1. 民宿管理",
      desc: "1. 民宿管理",
      class: "cl-menu-group",
      subMenu: [
        {
          id: "Dashboard",
          name: "Dashboar儀表板",
          desc: "儀表板",
          url: "/hs_project",
          class: "cl-menu-grid",
          display: true
        },
      ]
    }
  ]
};

export default nav;
