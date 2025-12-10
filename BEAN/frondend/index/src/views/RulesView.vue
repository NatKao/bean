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

// 辅助函数：判断是否需要显示圆点符号
const isListItem = item => {
  // 如果是纯字串，默认显示
  if (typeof item === "string") return true;
  // 如果是 section-title 类型，不显示
  return item.type !== "section-title";
};

// 辅助函数：获取文字内容
const getText = item => {
  return typeof item === "string" ? item : item.text;
};

// 辅助函数：决定 CSS Class
const getItemClass = item => {
  // 基础样式
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
      "電話聯繫訂房後，再另行轉知匯款資訊。",
      // 演示：红字强调
      {
        text: "訂房確認後，請於二日內晚上 21 點前預付房價50%訂金，逾期恕不保留客房，不便處請見諒。",
        type: "highlight"
      },
      "匯款完成後，煩請以電話告知：姓名、電話、帳號末五碼、金額、住宿日期、房型、人數，即完成訂房手續，謝謝。",
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
      // 演示：区块标题 (无符号 + 红字)
      { text: "平假日定義:", type: "section-title" },
      "平日：週日至週五",
      "假日： 週六、國定假日、連續假日、旺季(寒假、暑假、12/31)",
      "定價：除夕、農曆春節期間(初一～初五)",

      { text: "入退時間", type: "section-title" },
      "入住時間：15:00-18:00。非服務時間恕不提供入住登記服務。",
      "退房時間：11:00以前",

      { text: "住宿須知", type: "section-title" },
      "電話訂房請於早上 9:00～晚上 10:00 聯絡，遇緊急不在此限。",
      "請在抵達飯店的 24 小時前聯絡住宿，以安排入住事宜，旅客必須聯絡住宿方以取得入住相關資訊",
      "住宿當日客房保留到晚上9點，如會晚到請事先通知，我們會為您保留房間。",

      // 演示：一般红字强调
      {
        text: "入住時請記得出示您的證件，依規定辦理入住登記，同時也請您將住宿費一併繳交。未配合者我們無法提供入住即不予退費服務。",
        type: "highlight"
      },

      "提供免費自助停車服務；特斯拉車主入住享免費充電。",
      "為維護住宿品質，請依房型人數進住，如需加人，請事先告知。",
      "為響應愛地球活動及尊重旅客隱私，續住不更換備品及不提供打掃服務。",

      // 演示：警告 (深红)
      {
        text: "為提供良好的住宿空間，民宿嚴禁於房內進行召妓、販毒、嗑藥、轟趴、易燃物、酗酒、破壞或偷竊民宿設施等非法行為，經發現，一律報警法辦。",
        type: "warning"
      },

      {
        text: "為維護住宿環境，全館無菸環境，室內禁止吸菸、嚼食檳榔（包含陽台、浴室），違者需加收台幣1,000元清潔費，不便處請見諒。",
        type: "highlight"
      },
      "請旅客相互尊重住宿空間上的安寧，晚間22:00後禁止大聲喧嘩，晚間23:00後謝絕訪客，00:00過後則收台幣600元/人",
      {
        text: "每日夜間22點後至翌日上午8點，禁止使用卡拉ok或烤肉及喧嘩。若旅客違反上述規定，遭主管機關依發展觀光條例第55條第3項規定裁罰，須負擔新臺幣一萬元以上五萬元以下罰鍰。(經舉發請旅客自行負擔罰則)",
        type: "warning"
      },
      "為維護住宿安全，請勿使用非客房配置之電器用品及瓦斯器具，以免發生危險。",
      {
        text: "為維護住宿品質，我們目前暫婉拒寵物入住(允許攜帶服務性動物)，請勿私自攜帶寵物，經發現需加收台幣1,000元清潔費，敬請配合。",
        type: "highlight"
      },
      "為提供優質的客房服務，提醒旅客，請勿惡意破壞或毀損房內物品或整潔行為，退房時發現損壞或遺失，需照價賠償，若有需求可供代買，謝謝合作。",
      "提醒入住之旅客，請勿在民宿內外周遭施放煙火、沖天炮等製造噪音之物品，宜蘭縣政府已針對此加強取締，如造成相關法令及罰則，請自行負責。",
      "為提供優質的環境，包棟旅客，廚房借用完畢後，請恢復原狀，並清潔乾淨。若未清理需加收台幣3,000元清潔費用。",
      "個人貴重物品，請自行妥善保管、如有遺失，恕不負責，敬請見諒。",
      "我們已為您投保公共意外險/最高賠償台幣4,800萬元/新光產物保險。"
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
  },
  {
    title: "清潔安全",
    icon: "fa-shield-halved",
    isOpen: false,
    content: [
      { text: "加強清潔措施", type: "section-title" },
      "住宿使用消毒劑進行清潔。",
      "經常接觸的表面會定期清潔和消毒。",
      "床單和毛巾會以攝氏 60/華式 140 度以上的水溫清洗。",

      { text: "安全措施", type: "section-title" },
      "員工皆穿戴個人防護裝備。",
      "定期為員工測量體溫。",
      "可為旅客測量體溫。",
      "提供手部清潔用品。"
    ]
  }
]);
</script>
