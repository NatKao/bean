import { defineStore } from "pinia";

/* eslint-disable import/prefer-default-export */
export const navCollection = defineStore("navCollection", {
  state: () => ({
    nav: {},
    rule: {},
    authlvl: {}
  }),
  actions: {
    setNav(obj) {
      this.nav = obj;
      let tmpMainRoles = [];
      obj.menu.forEach(mainMenu => {
        if (mainMenu.roles && mainMenu.roles.length) {
          tmpMainRoles = mainMenu.roles;
          this.rule[mainMenu.id] = Object.assign([], tmpMainRoles);
          if (mainMenu.subMenu) {
            mainMenu.subMenu.forEach(subMenu => {
              if (subMenu.roles) {
                this.rule[subMenu.id] = Object.assign([], subMenu.roles);
              } else {
                this.rule[subMenu.id] = Object.assign([], tmpMainRoles);
              }
            });
          }
        }
        //TM 的 user_level
        if (mainMenu.lvls && mainMenu.lvls.length) {
          tmpMainLvls = mainMenu.lvls;
          this.authlvl[mainMenu.id] = Object.assign([], tmpMainLvls);
          if (mainMenu.subMenu) {
            mainMenu.subMenu.forEach(subMenu => {
              if (subMenu.lvls) {
                this.authlvl[subMenu.id] = Object.assign([], subMenu.lvls);
              } else {
                this.authlvl[subMenu.id] = Object.assign([], tmpMainLvls);
              }
            });
          }
        }
      });
    }
  }
});
