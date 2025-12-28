<!-- 
  File Name: RulesView.vue
  Author: huanyao
  Created Date: 2025-12-07
  Description: 
    此元件用於顯示訂房退房等各種項目的注意事項。
  Reviewed Date: 2025-12-14 huanyao
-->
<template>
  <section
    class="max-w-7xl mx-auto w-full p-4 md:p-8 flex items-center justify-center min-h-[calc(100vh-11rem)]"
  >
    <div
      class="w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col relative"
    >
      <div
        class="p-8 md:p-10 border-b border-gray-100 flex-none text-center bg-white z-10"
      >
        <h2 class="text-3xl font-bold text-dark">訂房須知</h2>
        <div class="w-16 h-1 bg-primary mx-auto mt-4 rounded-full"></div>
      </div>
      <div class="p-8 md:p-12">
        <div class="max-w-4xl mx-auto space-y-4">
          <div
            v-for="(rule, index) in rulesData"
            :key="index"
            class="border border-gray-200 rounded-xl overflow-hidden"
          >
            <button
              @click="rule.isOpen = !rule.isOpen"
              class="w-full flex justify-between p-5 bg-gray-50 hover:bg-gray-100 items-center"
            >
              <h3 class="text-lg font-bold text-dark flex items-center">
                <font-awesome-icon
                  :icon="rule.icon"
                  class="mr-3 text-primary"
                />
                {{ rule.title }}
              </h3>
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                :class="[
                  'text-gray-400 transition-transform',
                  rule.isOpen ? 'rotate-180' : ''
                ]"
              />
            </button>
            <transition name="accordion">
              <div
                v-if="rule.isOpen"
                class="bg-white p-5 border-t border-gray-100"
              >
                <ul class="space-y-2 text-sm ml-2">
                  <template v-for="(item, i) in rule.content">
                    <li
                      v-if="item.type === 'box'"
                      class="my-4"
                      :key="'box' + i"
                    >
                      <div
                        class="bg-red-50 border border-red-200 rounded-xl p-4"
                      >
                        <h4
                          v-if="item.title"
                          class="font-bold text-red-700 mb-2 flex items-center"
                        >
                          <font-awesome-icon
                            :icon="['fas', 'circle-exclamation']"
                            class="mr-2"
                          />
                          {{ item.title }}
                        </h4>
                        <ul
                          class="space-y-1 text-gray-700 list-disc list-inside ml-2"
                        >
                          <template v-for="(subItem, subIdx) in item.items">
                            <span
                              v-if="subItem.type === 'highlight'"
                              :class="getItemClass(subItem)"
                              :key="'sub' + subIdx"
                              >{{ getText(subItem) }}</span
                            >
                            <li v-else :key="subIdx">{{ subItem }}</li>
                          </template>
                        </ul>
                      </div>
                    </li>
                    <li v-else :class="getItemClass(item)" :key="i">
                      <span v-if="isListItem(item)" class="mr-2">•</span>
                      {{ getText(item) }}
                    </li>
                  </template>
                </ul>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

// 輔助函数：判断是否需要顯示圓點符號
const isListItem = item => {
  // 如果是纯字串，默認顯示
  if (typeof item === "string") return true;
  // 如果是 section-title 類型，不顯示
  return item.type !== "section-title";
};

// 輔助函数：獲取文字内容
const getText = item => {
  return typeof item === "string" ? item : item.text;
};

// 輔助函数：决定 CSS Class
const getItemClass = item => {
  // 基礎樣式
  let classes = "flex items-start "; // 使用 flex 让圆点和文字对齐
  if (typeof item === "string") {
    return classes + "text-gray-600"; // 默认灰色
  }
  // 根据类型添加样式
  switch (item.type) {
    case "highlight": // 强调 (红字 + 列表)
      return classes + "text-red-500 font-bold";
    case "section-title": // 区块标题 (红字 + 无符号 + 大一点)
      return "text-red-600 font-bold text-base mt-4 mb-1 block";
    case "warning": // 警告 (深红)
      return classes + "text-red-700 font-bold";
    default:
      return classes + "text-gray-600";
  }
};

const rulesData = ref([
  {
    title: "匯款資訊",
    icon: "fa-credit-card",
    isOpen: true,
    content: [
      "孩童收費標準：6歲以下的不佔床幼童，不列入入住人數計算，若有備品服務的需求，依照服務價格收費。",
      "電話聯繫訂房後，再另行轉知匯款資訊。",
      // 演示：红字强调
      {
        text: "訂房確認後，請於二日內晚上 21 點前預付房價50%訂金，逾期恕不保留客房，不便處請見諒。",
        type: "highlight"
      },
      "匯款完成後，煩請以電話告知：姓名、電話、帳號末五碼、金額、住宿日期、房型、人數，即完成訂房手續，謝謝。",
      "尾款請於入住當天付清。",
      {
        text: "預約除夕、農曆春節過年期間需預付房價全額，謝謝您。",
        type: "highlight"
      },
      {
        text: "海外旅客（持國外護照）依當地規定辦理，需預付房價全額費用。",
        type: "highlight"
      },
      "旺季期間(寒假、暑假、除夕、農曆春節期間、國定假日、連續假日、12/31)，訂房後，請於隔日中午12點以前完成匯款，即訂房成功。"
    ]
  },
  {
    title: "注意事項",
    icon: "fa-circle-exclamation",
    isOpen: false,
    content: [
      // 演示：區塊標題 (無符號 + 红字)
      { text: "平假日定義:", type: "section-title" },
      "平日：週一至週五",
      "假日： 週六、週日、國定假日、連續假日、旺季(寒假、暑假、12/31)",
      "國定假日僅提供包場",
      { text: "入退時間", type: "section-title" },
      "入住時間：15:00-18:00。非服務時間恕不提供入住登記服務。",
      "退房時間：11:00以前",
      "離園時間：12:00以前",
      "提早入園及逾時離開每小時酌收新台幣1,000元整",
      { text: "住宿須知", type: "section-title" },
      "電話訂房請於早上 10:00～晚上 10:00 聯絡。",
      {
        text: "水尾民宿無24小時服務人員，入住手續請於PM3:00~PM6:00前完成，若因個人原因晚於PM6:00，請先來訊告知。",
        type: "highlight"
      },
      "提供免費自助停車服務。",
      "為響應愛地球活動及尊重旅客隱私，續住僅提供更換毛巾不提供打掃服務。（毛巾會放置客廳提供領取）",
      // 演示：警告 (深红)
      {
        text: "為提供良好的住宿空間，民宿嚴禁於房內進行召妓、販毒、嗑藥、轟趴、易燃物、酗酒、破壞或偷竊民宿設施等非法行為，經發現，一律報警法辦。",
        type: "warning"
      },
      {
        text: "為維護住宿環境，全館無菸環境，室內禁止吸菸、嚼食檳榔（包含陽台、浴室），違者需加收新台幣5,000元清潔費，不便處請見諒。",
        type: "highlight"
      },
      "請旅客相互尊重住宿空間上的安寧，晚間22:00後禁止大聲喧嘩，晚間23:00後謝絕訪客，00:00過後則收新台幣600元/人",
      {
        text: "每日夜間22點後至翌日上午8點，禁止使用卡拉ok或烤肉區及喧嘩。若旅客違反上述規定，遭主管機關依發展觀光條例第55條第3項規定裁罰，須負擔新臺幣一萬元以上五萬元以下罰鍰。(經舉發請旅客自行負擔罰則)",
        type: "warning"
      },
      "為維護住宿安全，請勿使用非客房配置之電器用品及瓦斯器具，以免發生危險。",
      "提供中式早餐提供的早餐非吃到飽早餐提供中式素食稀飯buffet，早餐段：AM08:00~AM10:00[關於早餐:當入住人數不達10人或入住房間未滿5間的情況下轉而提供每人一份鹹油條或其他餐點當早餐]",
      "所有室內禁菸及電子菸，室內抽菸或電子菸者將加收新台幣5,000元清潔費用。 ",
      "可攜帶寵物，寵物不可單獨在房內及不可上床，發現加收新台幣1,500元清潔費。",
      "取消訂房的退款原則請看「改期與退訂」。 ",
      "本民宿禁止從事任何不法行為或吸食毒品，若發現有疑似行為或其他房客反應，立即取消交易，並報警處裡。 ",
      "鄉下田間寧靜，請勿大聲喧嘩及大聲播放音樂或電視。尤其晚間切勿喧囂打擾鄰房。若太過喧囂經制止仍繼續，為保障其他住客之權益，本民宿保有立即收回該房、取消交易之權力。 ",
      "本民宿位於自然環境中，各種生物、蟲類可能因季節增多。大部分蟲類無害，請儘量和平相處。",
      "為提供優質的客房服務，提醒旅客，請勿惡意破壞或毀損房內物品或整潔行為，退房時發現損壞或遺失，需照價賠償，若有需求可供代買，謝謝合作。",
      "為提供優質的環境，包棟旅客，廚房借用完畢後，請恢復原狀，並清潔乾淨。若未清理需加收新台幣3,000元清潔費用。",
      "個人貴重物品，請自行妥善保管、如有遺失，恕不負責，敬請見諒。",
      "我們已為您投保公共意外險/最高賠償新台幣4,800萬元/新光產物保險。"
    ]
  },
  {
    title: "改期與退訂",
    icon: "fa-calendar-xmark",
    isOpen: false,
    content: [
      "延期住宿：請於住宿前一週告知，將可辦理保留訂金三個月，並於期限內擇期住宿。",
      "如遇天災 (颱風、地震) 經宜蘭縣政府或旅客所在地政府發佈停止上班上課，將可辦理延期住宿，並將保留訂金三個月，並於期限內擇期住。",
      "取消訂房：前十五天全額退訂金，十五天內依觀光局規定扣訂金成數，住宿當日取消訂房，恕不退訂金，謝謝。",
      "因故取消訂單辦理退款或改期，需先扣除台幣100元手續費。",
      {
        type: "box",
        title: "定金退還比例規定", // 盒子的標題
        items: [
          {
            type: "highlight",
            text: "本民宿訂金之收取，依觀光局《定型化契約》規定，依法令規定比率進行取消訂房之扣款如下："
          },
          "旅客住宿日當日取消訂房扣預付訂金金額 100%",
          "旅客於住宿日前 1 日內取消訂房扣房價預付訂金金額 80%",
          "旅客於住宿日前 2-3 日內取消訂房扣房價預付訂金金額 70%",
          "旅客於住宿日前 4-6 日內取消訂房扣房價預付訂金金額 60%",
          "旅客於住宿日前 7-9 日內取消訂房扣房價預付訂金金額 50%",
          "旅客於住宿日前 10-13 日內取消訂房扣房價預付訂金金額 30%"
        ]
      }
    ]
  }
]);
</script>
