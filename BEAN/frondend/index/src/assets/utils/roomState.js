import { reactive } from "vue";
import dayjs from "dayjs";
import { faHouseMedicalCircleExclamation } from "@fortawesome/free-solid-svg-icons";

const GAS_URL = import.meta.env.VITE_GAS_URL;

// 1. 定義預設狀態
const STATE_KEY = "my_app_room_info"; // localStorage 的鑰匙名稱
let reTestCnt = 0;

// 嘗試從 localStorage 讀取舊資料，沒有的話就用預設值
const getSavedState = () => {
  const saved = localStorage.getItem(STATE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const savedState = getSavedState();

// 2. 建立響應式物件 (這就是你的 Store)
export const roomState = reactive({
  search_date: savedState?.search_date ?? "", // 如果有 token 就代表已登入
  is_status: savedState?.is_status ?? true,
  timenumber: savedState?.timenumber ?? 0,
  data: savedState?.data ?? [],
});

// 3. 定義修改資料的方法 (Actions)

export const $room = {
  // 取得狀態 (唯讀用)
  state: roomState,

  async getRoom() {
    const params = new URLSearchParams({
      action: "room",
    });
    try {
      const urlWithParams = `${GAS_URL}?${params.toString()}`;
      const response = await fetch(urlWithParams, {
        method: "GET",
        redirect: "follow",
        headers: { "Content-Type": "text/plain" }
      }); 
      const data = await response.json();
      if (data.status == "success") {
        this.setRoom(data.data);
      } else {
        setTimeout(async () => {
          if (reTestCnt > 5) {
            reTestCnt = 0;
            const params2 = new URLSearchParams({
              action: "errRoomLog",
            });
            const urlWithParams2 = `${GAS_URL}?${params2.toString()}`;
            await fetch(urlWithParams2, {
              method: "GET",
              redirect: "follow",
              headers: { "Content-Type": "text/plain" }
            }); 
            return ;
          }
          reTestCnt += 1;
          this.getRoom();
        }, 5000);
      }
      
    } catch (error) {
      console.error(error);
    }
  },

  // 寫入：寫入資料並寫入 localStorage
  setRoom(data) {
    roomState.search_date = dayjs().toISOString();
    roomState.is_status = false;
    roomState.timenumber = dayjs().unix(); // 秒
    roomState.data = data;

    // 儲存到硬碟 (Local Storage)
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        search_date: roomState.search_date,
        is_status: roomState.is_status,
        timenumber: roomState.timenumber,
        data: roomState.data
      })
    );
  },

  // 檢查：檢查資料，若過期就更新
  checkRoom() {
    const now_sec = dayjs().unix(); // 秒
    const ba = now_sec - roomState.timenumber;
    if (ba >= 3600) {
      this.setRoom([]);
      this.getRoom();
    }
  },
  
  getStatus() {
    return roomState.is_status;
  },
  
  getRoomData() {
    return roomState.data;
  },


  // 清除：清除資料並移除 localStorage
  clearRoom() {
    roomState.search_date = "";
    roomState.is_status = true;
    roomState.timenumber = 0;
    roomState.data = [];

    localStorage.removeItem(STATE_KEY);
  },
};
