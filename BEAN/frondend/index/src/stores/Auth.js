import { defineStore } from "pinia";

/* eslint-disable import/prefer-default-export */
export const auth = defineStore("auth", {
  state: () => ({
    AccessNo: "",
    EmpName: "",
    EmpID: "",
    user_level: "SUPERVISOR", // 自身權限
    Roles: ["ALL_ROLE"], // 目錄權限
  }),
  actions: {
  }
});
