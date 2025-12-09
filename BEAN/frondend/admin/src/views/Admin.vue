<template>

  <div v-if="!isLoggedIn" class="fullscreen login-bg flex flex-center q-pa-md" style="z-index: 9999;">
      <q-card style="width: 100%; max-width: 400px; border-radius: 16px;" class="shadow-24">
          <q-card-section class="bg-white q-pt-xl q-pb-lg text-center">
              <div class="text-h4 text-weight-bold text-primary q-mb-sm">AdminPro</div>
              <div class="text-grey-6">後台管理系統</div>
          </q-card-section>
          
          <q-card-section class="q-px-lg q-pt-none q-pb-xl">
              <q-form @submit="handleLogin" class="q-gutter-md">
                  <q-input 
                      filled 
                      v-model="loginForm.username" 
                      label="帳號" 
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || '請輸入帳號']"
                  >
                      <template v-slot:prepend><q-icon name="person" /></template>
                  </q-input>

                  <q-input 
                      filled 
                      type="password" 
                      v-model="loginForm.password" 
                      label="密碼" 
                      lazy-rules
                      :rules="[ val => val && val.length > 0 || '請輸入密碼']"
                  >
                      <template v-slot:prepend><q-icon name="lock" /></template>
                  </q-input>

                  <div class="row items-center justify-between q-mt-sm">
                      <q-checkbox v-model="loginForm.remember" label="記住我" dense color="primary" class="text-grey-8" size="sm"></q-checkbox>
                      <div class="text-grey-6 cursor-pointer text-caption hover:text-primary">忘記密碼?</div>
                  </div>

                  <q-btn label="登入系統" type="submit" color="primary" class="full-width q-mt-lg" size="lg" unelevated :loading="loginLoading"></q-btn>
              </q-form>
              
              <div class="text-center q-mt-md">
                  <div class="text-grey-5 text-caption">預設帳號: admin / 密碼: admin</div>
              </div>
          </q-card-section>
      </q-card>
  </div>
  <q-layout v-else view="hHh Lpr lff">
    <!-- 9) 頂部 Header -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat @click="drawer = !drawer" round dense icon="menu"></q-btn>

        <!-- 9) 左側顯示 Breadcrumbs -->
        <q-toolbar-title>
          <q-breadcrumbs active-color="white" style="font-size: 16px">
            <q-breadcrumbs-el label="後台管理" icon="home"></q-breadcrumbs-el>
            <!-- 當 Dashboard (總覽) 時不顯示第二層 -->
            <q-breadcrumbs-el
              v-if="currentView !== 'dashboard'"
              :label="currentTitle"
            ></q-breadcrumbs-el>
          </q-breadcrumbs>
        </q-toolbar-title>

        <!-- 9) 右側顯示登入者與登出 -->
        <div class="q-gutter-sm row items-center no-wrap">
          <q-chip
            v-if="userRole === 'dev'"
            color="red"
            text-color="white"
            icon="bug_report"
            >開發者模式 (個資遮蔽)</q-chip
          >
          <q-chip
            v-if="userRole === 'viewer'"
            color="orange"
            text-color="white"
            icon="visibility"
            >檢閱者模式 (唯讀)</q-chip
          >

          <!-- 新增: 通知鈴鐺 -->
          <q-btn round dense flat icon="notifications" class="q-mr-sm">
            <!-- 紅點: 當有未讀訊息時顯示 -->
            <q-badge
              v-if="unreadCount > 0"
              color="red"
              floating
              rounded
              style="width: 10px; height: 10px; padding: 0"
            ></q-badge>

            <q-menu>
              <q-list style="min-width: 350px; max-width: 400px">
                <q-item-label header class="text-h6">通知中心</q-item-label>

                <div v-if="notifications.length > 0">
                  <q-item
                    v-for="n in notifications"
                    :key="n.id"
                    clickable
                    v-ripple
                    :class="{ 'bg-blue-1': !n.read }"
                  >
                    <q-item-section avatar>
                      <q-avatar
                        :icon="n.icon"
                        :color="n.color"
                        text-color="white"
                        size="md"
                      />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>{{ n.title }}</q-item-label>
                      <q-item-label caption lines="2">{{
                        n.message
                      }}</q-item-label>
                    </q-item-section>
                    <q-item-section side top>
                      <q-item-label caption>{{ n.time }}</q-item-label>
                      <q-icon
                        v-if="!n.read"
                        name="fiber_manual_record"
                        color="primary"
                        size="xs"
                      ></q-icon>
                    </q-item-section>
                  </q-item>
                </div>
                <div v-else class="q-pa-md text-center text-grey">
                  暫無通知
                </div>

                <q-separator></q-separator>

                <!-- 全部已讀按鍵 -->
                <q-item
                  clickable
                  v-ripple
                  @click="markAllRead"
                  class="text-center text-primary q-py-md"
                >
                  <q-item-section>全部已讀</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>

          <q-btn-dropdown flat :label="currentUser.name" icon="person">
            <q-list>
              <q-item-label header>模擬切換權限</q-item-label>
              <q-item clickable v-close-popup @click="switchRole('admin')">
                <q-item-section>切換為最高權限 (Admin)</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="switchRole('dev')">
                <q-item-section>切換為開發者 (Developer)</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="switchRole('viewer')">
                <q-item-section>切換為檢閱者 (Viewer)</q-item-section>
              </q-item>
              <q-separator></q-separator>
              <q-item clickable v-close-popup @click="logout">
                <q-item-section class="text-negative">登出</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer
      v-model="drawer"
      show-if-above
      :mini="miniState"
      :width="250"
      :breakpoint="500"
      bordered
      class="bg-grey-1"
    >
      <q-scroll-area class="fit">
        <q-list padding>
          <template v-for="(item, index) in menuList">
            <q-separator
              v-if="item.separator"
              :key="'separ' + index"
            ></q-separator>
            <q-expansion-item
              v-else-if="item.children"
              :icon="item.icon"
              :label="item.label"
              :default-opened="false"
              header-class="text-grey-8"
              :key="'eitem' + index"
            >
              <q-list class="bg-grey-2">
                <q-item
                  v-for="sub in item.children"
                  :key="sub.id"
                  clickable
                  v-ripple
                  :active="currentView === sub.id"
                  @click="currentView = sub.id"
                  active-class="text-primary"
                  class="q-pl-lg"
                >
                  <q-item-section avatar
                    ><q-icon :name="sub.icon" size="xs"></q-icon
                  ></q-item-section>
                  <q-item-section>{{ sub.label }}</q-item-section>
                  <q-tooltip
                    v-if="miniState"
                    anchor="center right"
                    self="center left"
                    :offset="[10, 10]"
                    >{{ sub.label }}</q-tooltip
                  >
                </q-item>
              </q-list>
            </q-expansion-item>
            <q-item
              v-else
              clickable
              v-ripple
              :active="currentView === item.id"
              @click="currentView = item.id"
              class="text-grey-8"
              active-class="text-primary bg-blue-1"
              :key="'item' + index"
            >
              <q-item-section avatar
                ><q-icon :name="item.icon"></q-icon
              ></q-item-section>
              <q-item-section>{{ item.label }}</q-item-section>
              <q-tooltip
                v-if="miniState"
                anchor="center right"
                self="center left"
                :offset="[10, 10]"
                >{{ item.label }}</q-tooltip
              >
            </q-item>
          </template>
        </q-list>
      </q-scroll-area>
    </q-drawer>

    <!-- 主要內容區 -->
    <q-page-container>
      <q-page class="q-pa-md">
        <!-- Dashboard (新需求實作) -->
        <div v-show="currentView === 'dashboard'">
          <!-- 修改: 移除了 Dashboard 大標題 -->

          <!-- Top Cards Row -->
          <div class="row q-col-gutter-md q-mb-lg">
            <!-- 2. 本週 vs 上週訪客 -->
            <div class="col-12 col-md-6">
              <q-card class="my-card full-height">
                <q-card-section>
                  <div class="text-subtitle2 text-grey">本週累積瀏覽人數</div>
                  <div class="row items-baseline">
                    <div class="text-h3 text-primary q-mr-md">12,450</div>
                    <div class="text-subtitle1 text-positive">
                      <q-icon name="arrow_upward"></q-icon> 15%
                    </div>
                  </div>
                  <div class="text-caption text-grey q-mt-sm">
                    上週總人數: 10,820
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- 3. 裝置分佈 (修改：加入人數) -->
            <div class="col-12 col-md-6">
              <q-card class="my-card full-height">
                <q-card-section>
                  <div class="text-subtitle2 text-grey q-mb-sm"
                    >裝置瀏覽分佈</div
                  >
                  <div class="row items-center justify-around q-mt-md">
                    <div class="text-center">
                      <q-icon
                        name="smartphone"
                        size="md"
                        color="primary"
                      ></q-icon>
                      <div class="text-h5 text-weight-bold q-mt-xs">60%</div>
                      <div class="text-caption text-grey-8">7,470 人</div>
                      <div class="text-caption text-grey-6">手機</div>
                    </div>
                    <div class="text-center">
                      <q-icon
                        name="tablet_mac"
                        size="md"
                        color="orange"
                      ></q-icon>
                      <div class="text-h5 text-weight-bold q-mt-xs">10%</div>
                      <div class="text-caption text-grey-8">1,245 人</div>
                      <div class="text-caption text-grey-6">平板</div>
                    </div>
                    <div class="text-center">
                      <q-icon
                        name="computer"
                        size="md"
                        color="secondary"
                      ></q-icon>
                      <div class="text-h5 text-weight-bold q-mt-xs">30%</div>
                      <div class="text-caption text-grey-8">3,735 人</div>
                      <div class="text-caption text-grey-6">電腦</div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <!-- 1. 訪客趨勢圖表 -->
          <q-card class="q-mb-lg bg-indigo-1">
            <q-card-section>
              <div class="row items-center justify-between q-mb-md">
                <div class="text-h6 text-indigo-9">參觀人數統計摘要</div>
                <q-chip color="indigo" text-color="white" icon="analytics"
                  >週報表</q-chip
                >
              </div>
              <div class="row q-col-gutter-lg">
                <div class="col-12 col-sm-4 text-center">
                  <div class="text-h4 text-weight-bold text-indigo">2,500</div>
                  <div class="text-caption text-grey-8">單日最高</div>
                </div>
                <div class="col-12 col-sm-4 text-center">
                  <div class="text-h4 text-weight-bold text-indigo">1,850</div>
                  <div class="text-caption text-grey-8">平均每日</div>
                </div>
                <div class="col-12 col-sm-4 text-center">
                  <div class="text-h4 text-weight-bold text-indigo">12,950</div>
                  <div class="text-caption text-grey-8">本週總計</div>
                </div>
              </div>
            </q-card-section>
          </q-card>

          <!-- 4. 近期訂單 (修改：顯示人數與備註，隱藏金額) -->
          <q-card>
            <q-card-section>
              <div class="text-h6 q-mb-sm">近期訂單 (近兩週)</div>
              <q-table
                :rows="recentOrders"
                :columns="recentOrderColumns"
                row-key="id"
                flat
                hide-bottom
              >
                <!-- 狀態欄位 -->
                <template v-slot:body-cell-status="props">
                  <q-td :props="props">
                    <q-chip
                      :color="getStatusColor(props.value)"
                      text-color="white"
                      size="sm"
                      dense
                      >{{ props.value }}</q-chip
                    >
                  </q-td>
                </template>

                <!-- 備註欄位 (Tooltip 處理) -->
                <template v-slot:body-cell-notes="props">
                  <q-td :props="props" style="max-width: 200px">
                    <div class="ellipsis">
                      {{ props.value }}
                      <!-- 只有當內容有值時才顯示 Tooltip -->
                      <q-tooltip
                        v-if="props.value && props.value !== '無'"
                        anchor="top middle"
                        self="bottom middle"
                        max-width="300px"
                        class="bg-grey-9 text-body2"
                      >
                        {{ props.value }}
                      </q-tooltip>
                    </div>
                  </q-td>
                </template>
              </q-table>
            </q-card-section>
          </q-card>
        </div>

        <!-- 報表產生 (新頁面) -->
        <div v-if="currentView === 'report_generation'">
          <div class="text-h5 q-mb-md">報表產生</div>
          <div class="row q-col-gutter-lg justify-center q-mt-xl">
            <div class="col-12 col-md-5 text-center">
              <q-btn
                color="primary"
                class="full-width"
                size="xl"
                outline
                style="height: 150px"
                @click="
                  $q.notify({ message: '下載入住清單...', icon: 'download' })
                "
              >
                <div class="column items-center">
                  <q-icon name="hotel" size="4em" class="q-mb-sm"></q-icon>
                  <div>入住清單</div>
                  <div class="text-caption text-grey">(近一個月內入住訂單)</div>
                </div>
              </q-btn>
            </div>
            <div class="col-12 col-md-5 text-center">
              <q-btn
                color="secondary"
                class="full-width"
                size="xl"
                outline
                style="height: 150px"
                @click="$q.notify({ message: '下載財報...', icon: 'download' })"
              >
                <div class="column items-center">
                  <q-icon
                    name="attach_money"
                    size="4em"
                    class="q-mb-sm"
                  ></q-icon>
                  <div>收入金額財報</div>
                  <div class="text-caption text-grey">(財務統計與分析)</div>
                </div>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- 1) 首頁設定 -->
        <div v-if="currentView === 'home_settings'">
          <div class="row q-col-gutter-lg">
            <!-- 左側：編輯區 -->
            <div class="col-12 col-md-5">
              <q-card class="full-height">
                <q-card-section>
                  <div class="text-subtitle1 text-weight-bold q-mb-md">
                    <q-icon name="edit" color="primary" class="q-mr-sm"></q-icon
                    >基本資訊編輯
                  </div>
                  <q-input
                    v-model="homeData.description"
                    label="網站描述 / 歡迎詞"
                    type="textarea"
                    outlined
                    autogrow
                    :readonly="isViewer"
                    class="q-mb-md"
                  ></q-input>
                  <q-separator class="q-my-md"></q-separator>

                  <div class="text-subtitle2 q-mb-sm text-grey-8"
                    >輪播圖片管理</div
                  >
                  <div class="row q-col-gutter-sm">
                    <div
                      v-for="(img, idx) in homeData.images"
                      :key="idx"
                      class="col-6 relative-position img-card"
                    >
                      <q-img
                        :src="img"
                        :ratio="16 / 9"
                        class="rounded-borders shadow-1"
                      ></q-img>
                      <!-- 懸浮刪除遮罩 -->
                      <div
                        v-if="!isViewer"
                        class="img-hover-overlay rounded-borders cursor-pointer"
                        @click="removeHomeImage(idx)"
                      >
                        <q-icon name="delete" color="white" size="md"></q-icon>
                      </div>
                      <q-badge color="primary" floating size="xs">{{
                        idx + 1
                      }}</q-badge>
                    </div>

                    <!-- 新增圖片按鈕 -->
                    <div class="col-6" v-if="!isViewer">
                      <div
                        class="rounded-borders bg-grey-2 flex flex-center"
                        style="
                          height: 0;
                          padding-bottom: 56.25%;
                          position: relative;
                          cursor: pointer;
                          border: 2px dashed #bdbdbd;
                          transition: all 0.3s;
                        "
                        @click="addHomeImage"
                        onmouseover="this.style.borderColor='#1976d2'; this.style.backgroundColor='#e3f2fd'"
                        onmouseout="this.style.borderColor='#bdbdbd'; this.style.backgroundColor='#f5f5f5'"
                      >
                        <div
                          class="absolute-full flex flex-center column text-grey-7"
                        >
                          <q-icon name="add_photo_alternate" size="md"></q-icon>
                          <div class="text-caption q-mt-xs">上傳</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    v-if="homeData.images.length < 3"
                    class="text-negative text-caption q-mt-sm row items-center"
                  >
                    <q-icon name="warning" class="q-mr-xs"></q-icon>
                    建議至少上傳 3 張圖片以達最佳效果
                  </div>
                </q-card-section>
                <q-card-actions align="right" class="q-pa-md">
                  <q-btn
                    label="捨棄變更"
                    flat
                    color="grey"
                    :disable="isViewer"
                  ></q-btn>
                  <q-btn
                    label="儲存發布"
                    unelevated
                    color="primary"
                    :disable="isViewer"
                    icon="save"
                  ></q-btn>
                </q-card-actions>
              </q-card>
            </div>

            <!-- 右側：預覽區 (修改：僅顯示文字描敘，移除圖片預覽) -->
            <div class="col-12 col-md-7">
              <!-- 調整：置中內容，不需要 justify-between 了 -->
              <q-card
                class="full-height home-preview-card column justify-center"
              >
                <div
                  class="q-pa-lg relative-position text-center"
                  style="z-index: 2"
                >
                  <q-badge color="white" text-color="primary" class="q-mb-lg"
                    >網站首頁文字預覽</q-badge
                  >
                  <div class="text-h3 text-weight-bold q-mb-md"
                    >歡迎來到 AdminPro</div
                  >
                  <div
                    class="text-h6 text-weight-regular"
                    style="
                      white-space: pre-wrap;
                      opacity: 0.95;
                      line-height: 1.6;
                    "
                    >{{ homeData.description }}</div
                  >
                  <q-btn
                    outline
                    color="white"
                    label="立即預訂"
                    class="q-mt-xl"
                    size="lg"
                    padding="10px 40px"
                  ></q-btn>
                </div>

                <!-- 裝飾背景 (保持模糊或純色，不顯示輪播圖概念) -->
                <div
                  class="absolute-full"
                  style="
                    z-index: 1;
                    opacity: 0.1;
                    background-image: url('https://placehold.co/800x600/white/white');
                    background-size: cover;
                    filter: grayscale(100%);
                  "
                ></div>

                <!-- 移除了底部的輪播狀態 section -->
              </q-card>
            </div>
          </div>
        </div>

        <!-- 2) 介紹設定 (Tabs) -->
        <div v-if="currentView === 'intro_settings'">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5">介紹頁籤管理</div>
            <q-btn
              label="新增頁籤"
              color="primary"
              icon="add"
              :disable="isViewer"
              @click="openTabDialog()"
            ></q-btn>
          </div>

          <q-table
            :rows="introTabs"
            :columns="[
              {
                name: 'title',
                label: '頁籤標題',
                field: 'title',
                align: 'left'
              },
              {
                name: 'content',
                label: '內文摘要',
                field: 'content',
                align: 'left',
                format: val =>
                  val.length > 20 ? val.substring(0, 20) + '...' : val
              },
              {
                name: 'images',
                label: '圖片數',
                field: row => row.images.length,
                align: 'center'
              },
              { name: 'actions', label: '操作', align: 'right' }
            ]"
            row-key="id"
          >
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn
                  flat
                  round
                  icon="edit"
                  color="primary"
                  @click="openTabDialog(props.row)"
                ></q-btn>
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  :disable="isViewer"
                  @click="deleteTab(props.row.id)"
                ></q-btn>
              </q-td>
            </template>
          </q-table>

          <!-- Tab 編輯 Dialog -->
          <q-dialog v-model="tabDialog.show">
            <q-card style="min-width: 600px">
              <q-card-section>
                <div class="text-h6">{{
                  tabDialog.isEdit ? "編輯頁籤" : "新增頁籤"
                }}</div>
              </q-card-section>
              <q-card-section class="q-gutter-md">
                <q-input
                  v-model="tabDialog.data.title"
                  label="頁籤標題"
                  outlined
                ></q-input>
                <q-input
                  v-model="tabDialog.data.content"
                  label="內文"
                  type="textarea"
                  outlined
                ></q-input>
                <div class="text-subtitle2">圖片管理 (模擬)</div>
                <q-btn
                  size="sm"
                  color="secondary"
                  label="上傳圖片 (模擬)"
                  icon="cloud_upload"
                ></q-btn>
                <div>已選擇 {{ tabDialog.data.images.length }} 張圖片</div>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="取消" color="grey" v-close-popup></q-btn>
                <q-btn
                  flat
                  label="確認"
                  color="primary"
                  @click="saveTab"
                ></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <!-- 3) 訂房須知 -->
        <div v-if="currentView === 'notice_settings'">
          <div class="row items-center justify-between q-mb-md">
            <div class="text-h5">訂房須知設定</div>
            <q-btn
              label="新增須知"
              color="primary"
              icon="add"
              :disable="isViewer"
              @click="openNoticeDialog()"
            ></q-btn>
          </div>
          <div class="text-caption text-grey q-mb-sm">* 使用箭頭調整排序</div>

          <q-list bordered separator class="rounded-borders bg-white">
            <q-item v-for="(notice, index) in notices" :key="notice.id">
              <q-item-section avatar>
                <div class="column">
                  <q-btn
                    flat
                    dense
                    icon="keyboard_arrow_up"
                    size="sm"
                    :disable="index === 0 || isViewer"
                    @click="moveNotice(index, -1)"
                  ></q-btn>
                  <q-btn
                    flat
                    dense
                    icon="keyboard_arrow_down"
                    size="sm"
                    :disable="index === notices.length - 1 || isViewer"
                    @click="moveNotice(index, 1)"
                  ></q-btn>
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{
                  notice.title
                }}</q-item-label>
                <q-item-label caption lines="2">{{
                  notice.content
                }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <div class="row">
                  <q-btn
                    flat
                    round
                    icon="edit"
                    color="grey-7"
                    @click="openNoticeDialog(notice)"
                  ></q-btn>
                  <q-btn
                    flat
                    round
                    icon="delete"
                    color="negative"
                    :disable="isViewer"
                    @click="deleteNotice(index)"
                  ></q-btn>
                </div>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- 新增: 須知編輯視窗 -->
          <q-dialog v-model="noticeDialog.show">
            <q-card style="min-width: 500px">
              <q-card-section>
                <div class="text-h6">{{
                  noticeDialog.isEdit ? "編輯須知" : "新增須知"
                }}</div>
              </q-card-section>
              <q-card-section class="q-gutter-md">
                <q-input
                  v-model="noticeDialog.data.title"
                  label="標題"
                  outlined
                ></q-input>
                <q-input
                  v-model="noticeDialog.data.content"
                  label="內文"
                  type="textarea"
                  outlined
                ></q-input>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="取消" color="grey" v-close-popup></q-btn>
                <q-btn
                  flat
                  label="確認"
                  color="primary"
                  @click="saveNotice"
                ></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <!-- 4) 地理位置設定 -->
        <div v-if="currentView === 'location_settings'">
          <div class="text-h5 q-mb-md">地理位置與交通</div>
          <q-card flat bordered class="q-pa-md">
            <div class="text-h6 q-mb-sm">基本資訊</div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input
                  v-model="locationData.address"
                  label="地址"
                  outlined
                  :readonly="isViewer"
                ></q-input>
              </div>
              <div class="col-12 col-md-6">
                <q-input
                  v-model="locationData.mapUrl"
                  label="Google Maps 連結"
                  outlined
                  :readonly="isViewer"
                ></q-input>
              </div>
            </div>

            <q-separator class="q-my-md"></q-separator>

            <div class="row items-center justify-between q-mb-sm">
              <div class="text-h6">交通方式</div>
              <q-btn
                label="新增方式"
                size="sm"
                color="secondary"
                :disable="isViewer"
                @click="addTransport"
              ></q-btn>
            </div>

            <div
              v-for="(trans, idx) in locationData.transports"
              :key="idx"
              class="row q-col-gutter-sm q-mb-sm items-center bg-grey-2 q-pa-sm rounded-borders"
            >
              <div class="col-12 col-md-3">
                <q-input
                  v-model="trans.type"
                  dense
                  bg-color="white"
                  outlined
                  label="方式 (如: 高鐵)"
                  :readonly="isViewer"
                ></q-input>
              </div>
              <div class="col-12 col-md-8">
                <q-input
                  v-model="trans.desc"
                  dense
                  bg-color="white"
                  outlined
                  label="詳細說明"
                  :readonly="isViewer"
                ></q-input>
              </div>
              <div class="col-12 col-md-1 text-right">
                <q-btn
                  flat
                  round
                  icon="delete"
                  color="negative"
                  dense
                  :disable="isViewer"
                  @click="locationData.transports.splice(idx, 1)"
                ></q-btn>
              </div>
            </div>
          </q-card>
        </div>

        <!-- [NEW] 5) 前端頁面控制 (插入在異動訂單查詢之前) -->
        <div v-if="currentView === 'frontend_control'">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-subtitle1 text-primary q-mb-md text-weight-bold">
              <q-icon name="view_quilt" class="q-mr-sm"></q-icon
              >前端頁面顯示與排序
            </div>
            <div class="text-caption text-grey-7 q-mb-md"
              >控制前端選單的顯示狀態與排列順序 (首頁為固定顯示)。</div
            >

            <q-list bordered separator class="rounded-borders">
              <q-item
                v-for="(page, index) in frontendPages"
                :key="page.id"
                class="q-py-md"
              >
                <q-item-section avatar>
                  <q-icon name="drag_handle" color="grey-5"></q-icon>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold">{{
                    page.name
                  }}</q-item-label>
                  <q-item-label caption>ID: {{ page.id }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center q-gutter-md">
                    <div class="column">
                      <q-btn
                        flat
                        dense
                        icon="keyboard_arrow_up"
                        size="sm"
                        :disable="index === 0 || isViewer"
                        @click="moveFrontendPage(index, -1)"
                      ></q-btn>
                      <q-btn
                        flat
                        dense
                        icon="keyboard_arrow_down"
                        size="sm"
                        :disable="
                          index === frontendPages.length - 1 || isViewer
                        "
                        @click="moveFrontendPage(index, 1)"
                      ></q-btn>
                    </div>
                    <q-toggle
                      v-model="page.visible"
                      :disable="isViewer"
                      color="primary"
                      label="顯示"
                      left-label
                    ></q-toggle>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
            <div class="row justify-end q-mt-md">
              <q-btn
                label="儲存設定"
                color="primary"
                icon="save"
                :disable="isViewer"
                unelevated
              ></q-btn>
            </div>
          </q-card>
        </div>

        <!-- 6) 新增訂單查詢 (載入3個月) -->
        <div v-if="currentView === 'order_query'">
          <div class="text-h5 q-mb-md">訂單查詢</div>

          <!-- 查詢條件區 -->
          <q-card class="q-mb-md q-pa-md bg-grey-1" flat>
            <div class="row q-col-gutter-md items-center">
              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  v-model="orderQuery.dateRange"
                  label="查詢區間 (預設近3個月)"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="orderQuery.dateRange"
                          range
                          mask="YYYY/MM/DD"
                        >
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-3">
                <q-select
                  outlined
                  v-model="orderQuery.status"
                  :options="['全部', '已完成', '已取消', '待入住']"
                  label="訂單狀態"
                />
              </div>
              <div class="col-12 col-md-2">
                <q-btn
                  color="primary"
                  label="查詢"
                  icon="search"
                  class="full-width"
                  @click="searchOrders"
                ></q-btn>
              </div>
            </div>
          </q-card>

          <q-table
            :rows="orderList"
            :columns="orderColumns"
            row-key="id"
            flat
            bordered
          >
            <template v-slot:body-cell-amount="props">
              <q-td :props="props">
                <span v-if="userRole === 'dev'">$****</span>
                <span v-else>{{ formatCurrency(props.value) }}</span>
              </q-td>
            </template>
            <template v-slot:body-cell-phone="props">
              <q-td :props="props">
                <span v-if="userRole === 'dev'">09**-***-***</span>
                <span v-else>{{ props.value }}</span>
              </q-td>
            </template>
          </q-table>
        </div>

        <!-- 7) 會員與訂房查詢 -->
        <div v-if="currentView === 'member_query'">
          <div class="text-h5 q-mb-md">會員 / 訂房查詢</div>

          <!-- 修改 2: Tab 加入 inline-label 讓文字圖案同一排 -->
          <q-tabs
            v-model="queryTab"
            align="justify"
            class="text-primary q-mb-md"
            active-color="primary"
            indicator-color="primary"
            inline-label
          >
            <q-tab
              name="member"
              label="6-1 會員查詢"
              icon="person_search"
              class="custom-tab"
            ></q-tab>
            <q-tab
              name="booking"
              label="6-2 訂房單號查詢"
              icon="receipt_long"
              class="custom-tab"
            ></q-tab>
          </q-tabs>

          <q-tab-panels v-model="queryTab" animated>
            <!-- 6-1 會員查詢 (修改: 增加 q-pa-md 防止文字被切斷) -->
            <q-tab-panel name="member" class="q-pa-md">
              <div class="row q-gutter-md q-mb-md items-center">
                <div class="col-auto">
                  <q-btn-toggle
                    v-model="memberSearchType"
                    push
                    glossy
                    toggle-color="primary"
                    :options="[
                      { label: '電話/姓名', value: 'phone' },
                      { label: '日期區間', value: 'date' }
                    ]"
                  />
                </div>
                <div class="col-5">
                  <q-input
                    v-if="memberSearchType === 'phone'"
                    v-model="memberSearch"
                    outlined
                    dense
                    label="輸入會員電話或姓名查詢"
                  >
                    <template v-slot:append
                      ><q-btn
                        round
                        dense
                        flat
                        icon="search"
                        @click="doMemberSearch"
                    /></template>
                  </q-input>
                  <q-input
                    v-else
                    outlined
                    dense
                    v-model="memberSearchDateRange"
                    label="選擇查詢日期區間"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
                          <q-date
                            v-model="memberSearchDateRange"
                            range
                            mask="YYYY/MM/DD"
                          >
                            <div class="row items-center justify-end">
                              <q-btn
                                v-close-popup
                                label="Close"
                                color="primary"
                                flat
                              />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                    <template v-slot:after
                      ><q-btn
                        round
                        dense
                        flat
                        icon="search"
                        color="primary"
                        @click="doMemberSearch"
                    /></template>
                  </q-input>
                </div>
              </div>

              <!-- 上 Table: 會員列表 (僅在電話查詢模式顯示) -->
              <div
                v-if="
                  memberSearchType === 'phone' && displayMemberList.length > 0
                "
                class="q-mb-lg"
              >
                <div class="text-subtitle1 text-grey-8 q-mb-xs">
                  <q-icon name="list" /> 會員列表 (點擊查看訂房紀錄)
                </div>
                <q-table
                  :rows="displayMemberList"
                  :columns="memberColumns"
                  row-key="id"
                  flat
                  bordered
                  :pagination="{ rowsPerPage: 5 }"
                  @row-click="onMemberRowClick"
                  selection="single"
                  v-model:selected="selectedMembers"
                >
                  <template v-slot:body-cell-name="props">
                    <q-td :props="props">
                      {{ maskName(props.value) }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-phone="props">
                    <q-td :props="props">
                      <span v-if="userRole === 'dev'">09**-***-***</span>
                      <span v-else>{{ props.value }}</span>
                    </q-td>
                  </template>
                </q-table>
              </div>

              <!-- 下 Table: 訂房紀錄 -->
              <div
                v-if="
                  bottomTableData.length > 0 ||
                  (memberSearchType === 'date' && hasSearched)
                "
              >
                <q-separator
                  class="q-mb-md"
                  v-if="memberSearchType === 'phone'"
                ></q-separator>
                <div class="text-subtitle1 text-primary q-mb-xs">
                  <q-icon name="history" />
                  {{
                    memberSearchType === "phone"
                      ? selectedMembers.length > 0
                        ? selectedMembers[0].name + " 的訂房紀錄"
                        : "請選擇上方會員"
                      : "區間內所有訂房"
                  }}
                </div>
                <q-table
                  :rows="bottomTableData"
                  :columns="bookingHistoryColumns"
                  row-key="id"
                  flat
                  bordered
                >
                  <!-- 日期查詢模式下，多顯示會員姓名欄位 -->
                  <template v-slot:body-cell-memberName="props">
                    <q-td :props="props">
                      {{ maskName(props.value) }}
                    </q-td>
                  </template>
                  <template v-slot:body-cell-price="props">
                    <q-td :props="props">
                      <span v-if="userRole === 'dev'">$****</span>
                      <span v-else>{{ formatCurrency(props.value) }}</span>
                    </q-td>
                  </template>
                </q-table>
              </div>
              <div
                v-else-if="
                  memberSearchType === 'phone' &&
                  displayMemberList.length > 0 &&
                  selectedMembers.length === 0
                "
                class="text-grey q-pa-md text-center"
              >
                請點選上方會員列表以查看詳細資料
              </div>
              <div
                v-else-if="hasSearched"
                class="text-grey q-pa-md text-center"
              >
                查無相關資料
              </div>
            </q-tab-panel>

            <!-- 6-2 訂房單號查詢 -->
            <q-tab-panel name="booking" class="q-pa-none">
              <div class="row q-gutter-md q-mb-md">
                <q-input
                  v-model="bookingIdSearch"
                  outlined
                  dense
                  label="輸入訂房單號"
                  class="col-4"
                >
                  <template v-slot:append
                    ><q-btn round dense flat icon="search"
                  /></template>
                </q-input>
              </div>
              <q-card flat bordered v-if="foundBooking">
                <q-card-section>
                  <!-- 修改: 將狀態 Chip 移回右上角，與標題並排 -->
                  <div class="row items-center justify-between no-wrap">
                    <div class="text-h6">訂房單號: {{ foundBooking.id }}</div>
                    <!-- 修改點：加大狀態標籤 -->
                    <q-chip
                      :color="getStatusColor(foundBooking.status)"
                      text-color="white"
                      size="xl"
                      >{{ foundBooking.status }}</q-chip
                    >
                  </div>

                  <div class="q-mt-md">
                    <!-- 修改: 增加一個 row wrapper，並將內容限制在 col-md-8 (2/3 寬度) -->
                    <div class="row">
                      <div class="col-12 col-md-8">
                        <!-- 修改: 增加欄位間距 (gutter-x-xl) 並調整文字底部 padding (q-pb-xs) -->
                        <q-list separator>
                          <!-- Row 1: 訂房人 & 電話 -->
                          <q-item class="q-pt-md q-pb-xs">
                            <q-item-section>
                              <div class="row q-col-gutter-x-xl">
                                <div class="col-6">
                                  <div class="text-caption text-grey"
                                    >訂房人</div
                                  >
                                  <div
                                    v-if="userRole === 'dev'"
                                    class="text-body1"
                                    >{{ maskName(foundBooking.name) }} (Dev
                                    Hidden)</div
                                  >
                                  <div v-else class="text-body1">{{
                                    foundBooking.name
                                  }}</div>
                                </div>
                                <div class="col-6">
                                  <div class="text-caption text-grey">電話</div>
                                  <div
                                    v-if="userRole === 'dev'"
                                    class="text-body1"
                                    >09**-***-***</div
                                  >
                                  <div v-else class="text-body1">{{
                                    foundBooking.phone
                                  }}</div>
                                </div>
                              </div>
                            </q-item-section>
                          </q-item>

                          <!-- Row 2: 日期 & 人數 -->
                          <q-item class="q-pt-md q-pb-xs">
                            <q-item-section>
                              <div class="row q-col-gutter-x-xl">
                                <div class="col-6">
                                  <div class="text-caption text-grey"
                                    >入住 / 退房日期</div
                                  >
                                  <div class="text-body1"
                                    >{{ foundBooking.checkIn }} ~
                                    {{ foundBooking.checkOut }}</div
                                  >
                                </div>
                                <div class="col-6">
                                  <div class="text-caption text-grey">人數</div>
                                  <div class="text-body1">
                                    {{ foundBooking.pax.adults }} 位大人
                                    <span v-if="foundBooking.pax.children > 0"
                                      >,
                                      {{ foundBooking.pax.children }}
                                      位小孩</span
                                    >
                                  </div>
                                </div>
                              </div>
                            </q-item-section>
                          </q-item>

                          <!-- Row 3: 備註 -->
                          <q-item class="q-pt-md q-pb-xs">
                            <q-item-section>
                              <q-item-label caption>備註</q-item-label>
                              <q-item-label class="text-grey-8 text-body1">{{
                                foundBooking.notes
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                      <!-- 右側留空或可放其他資訊，達成 2/3 寬度效果 -->
                      <div class="col-12 col-md-4"></div>
                    </div>

                    <!-- 底部按鈕區 -->
                    <div class="row justify-end items-center q-mt-lg q-px-sm">
                      <div class="q-gutter-md">
                        <!-- 修改點：按鈕尺寸改為 md -->
                        <q-btn
                          label="修改狀態"
                          size="md"
                          outline
                          color="primary"
                          :disable="isViewer"
                          @click="openStatusDialog(foundBooking)"
                        ></q-btn>
                        <q-btn
                          label="取消訂單"
                          size="md"
                          outline
                          color="negative"
                          :disable="isViewer"
                          @click="cancelOrder(foundBooking)"
                        ></q-btn>
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
              <div v-else class="text-grey q-pa-md"
                >請輸入查詢單號 (試試: B001)</div
              >

              <q-dialog v-model="statusDialog.show">
                <q-card style="min-width: 400px">
                  <q-card-section>
                    <div class="text-h6">修改訂單狀態</div>
                  </q-card-section>
                  <q-card-section class="q-gutter-md">
                    <q-select
                      v-model="statusDialog.status"
                      :options="['已確認', '已入住', '已退房', '已取消']"
                      label="選擇新狀態"
                      outlined
                    ></q-select>
                    <q-input
                      v-model="statusDialog.reason"
                      label="變更理由"
                      type="textarea"
                      outlined
                    ></q-input>
                  </q-card-section>
                  <q-card-actions align="right">
                    <q-btn flat label="取消" color="grey" v-close-popup></q-btn>
                    <q-btn
                      flat
                      label="確認變更"
                      color="primary"
                      @click="confirmStatusChange"
                    ></q-btn>
                  </q-card-actions>
                </q-card>
              </q-dialog>
            </q-tab-panel>
          </q-tab-panels>
        </div>

        <!-- [NEW] 8) 預覽評價 (插入在會員查詢後面) -->
        <div v-if="currentView === 'review_preview'">
          <div class="text-subtitle1 text-primary q-mb-md text-weight-bold">
            <q-icon name="rate_review" class="q-mr-sm"></q-icon>顧客評價管理
          </div>

          <!-- 篩選器 -->
          <q-card class="q-pa-md bg-white q-mb-md" flat bordered>
            <div class="row q-gutter-md items-center">
              <div class="col-auto">
                <q-toggle
                  v-model="reviewFilter.unreadOnly"
                  label="僅顯示未讀評價"
                  color="orange"
                  icon="mark_email_unread"
                ></q-toggle>
              </div>
              <q-separator vertical class="q-mx-md"></q-separator>
              <div class="col-12 col-md-4">
                <q-input
                  outlined
                  dense
                  v-model="reviewFilter.dateRange"
                  label="查詢日期區間"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        cover
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date
                          v-model="reviewFilter.dateRange"
                          range
                          mask="YYYY/MM/DD"
                        >
                          <div class="row items-center justify-end"
                            ><q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                          /></div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-auto">
                <q-btn
                  color="primary"
                  icon="search"
                  label="查詢"
                  unelevated
                ></q-btn>
              </div>
            </div>
          </q-card>

          <!-- 評價列表 Table -->
          <q-table
            :rows="reviews"
            :columns="[
              {
                name: 'date',
                label: '日期',
                field: 'date',
                align: 'left',
                sortable: true
              },
              {
                name: 'customer',
                label: '顧客姓名',
                field: 'customer',
                align: 'left'
              },
              {
                name: 'rating',
                label: '評分',
                field: 'rating',
                align: 'center',
                sortable: true
              },
              {
                name: 'content',
                label: '評價內容',
                field: 'content',
                align: 'left',
                style: 'max-width: 300px'
              },
              {
                name: 'status',
                label: '狀態',
                field: 'status',
                align: 'center'
              },
              { name: 'action', label: '操作', align: 'center' }
            ]"
            row-key="id"
            flat
            bordered
            class="bg-white"
          >
            <!-- 自訂每一列的樣式: 未讀顯示黃色背景 -->
            <template v-slot:body="props">
              <q-tr
                :props="props"
                :class="{
                  'review-unread':
                    props.row.status === 'unread' &&
                    reviewFilter.unreadOnly === false
                }"
              >
                <q-td key="date" :props="props">{{ props.row.date }}</q-td>
                <q-td key="customer" :props="props">{{
                  userRole === "dev"
                    ? maskName(props.row.customer)
                    : props.row.customer
                }}</q-td>
                <q-td key="rating" :props="props">
                  <div class="text-orange">
                    <q-icon
                      v-for="n in 5"
                      :key="n"
                      :name="n <= props.row.rating ? 'star' : 'star_border'"
                    ></q-icon>
                  </div>
                </q-td>
                <q-td key="content" :props="props">
                  <div class="ellipsis">{{ props.row.content }}</div>
                </q-td>
                <q-td key="status" :props="props">
                  <q-badge
                    :color="props.row.status === 'unread' ? 'orange' : 'green'"
                    :label="props.row.status === 'unread' ? '未讀' : '已回覆'"
                  ></q-badge>
                </q-td>
                <q-td key="action" :props="props">
                  <q-btn
                    size="sm"
                    color="primary"
                    outline
                    label="查看/回覆"
                    @click="openReviewDialog(props.row)"
                  ></q-btn>
                </q-td>
              </q-tr>
            </template>
          </q-table>

          <!-- 回覆視窗 Dialog -->
          <q-dialog v-model="reviewDialog.show">
            <q-card style="min-width: 600px">
              <q-card-section>
                <div class="text-h6">評價詳情</div>
              </q-card-section>
              <q-card-section
                class="q-pt-none"
                v-if="reviewDialog.currentReview"
              >
                <div class="row q-mb-md">
                  <div class="col-6 text-grey-8"
                    >顧客：{{
                      userRole === "dev"
                        ? maskName(reviewDialog.currentReview.customer)
                        : reviewDialog.currentReview.customer
                    }}</div
                  >
                  <div class="col-6 text-right text-grey-6">{{
                    reviewDialog.currentReview.date
                  }}</div>
                </div>
                <div class="q-pa-md bg-grey-2 rounded-borders q-mb-md">
                  <div class="text-orange q-mb-xs">
                    評分: {{ reviewDialog.currentReview.rating }} 星
                  </div>
                  <div class="text-body1">{{
                    reviewDialog.currentReview.content
                  }}</div>
                </div>

                <q-input
                  v-model="reviewDialog.replyText"
                  type="textarea"
                  label="撰寫回覆"
                  outlined
                  rows="4"
                  :readonly="isViewer"
                  placeholder="感謝您的入住..."
                ></q-input>
              </q-card-section>
              <q-card-actions align="right">
                <q-btn flat label="關閉" color="grey" v-close-popup></q-btn>
                <q-btn
                  flat
                  label="送出回覆"
                  color="primary"
                  @click="submitReply"
                  :disable="isViewer"
                ></q-btn>
              </q-card-actions>
            </q-card>
          </q-dialog>
        </div>

        <!-- 9) 報表產生 -->
        <div v-if="currentView === 'report_generation'">
          <div class="row q-col-gutter-lg justify-center q-mt-xl">
            <div class="col-12 col-md-5 text-center">
              <q-btn
                color="primary"
                class="full-width"
                size="xl"
                outline
                style="height: 150px"
                @click="
                  $q.notify({ message: '下載入住清單...', icon: 'download' })
                "
              >
                <div class="column items-center">
                  <q-icon name="hotel" size="4em" class="q-mb-sm"></q-icon>
                  <div>入住清單</div>
                  <div class="text-caption text-grey">(近一個月內入住訂單)</div>
                </div>
              </q-btn>
            </div>
            <div class="col-12 col-md-5 text-center">
              <q-btn
                color="secondary"
                class="full-width"
                size="xl"
                outline
                style="height: 150px"
                @click="$q.notify({ message: '下載財報...', icon: 'download' })"
              >
                <div class="column items-center">
                  <q-icon
                    name="attach_money"
                    size="4em"
                    class="q-mb-sm"
                  ></q-icon>
                  <div>收入金額財報</div>
                  <div class="text-caption text-grey">(財務統計與分析)</div>
                </div>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- 10) 其他設定區塊 (移動到最後，包含社群與參數) -->
        <div v-if="currentView === 'social_settings'">
          <q-card flat bordered class="q-pa-md my-card">
            <q-input
              v-model="socialData.fb"
              label="Facebook Link"
              class="q-mb-md"
              :readonly="isViewer"
              outlined
            >
              <template v-slot:prepend
                ><q-icon name="facebook" color="blue-9"
              /></template>
            </q-input>
            <q-input
              v-model="socialData.ig"
              label="Instagram Link"
              :readonly="isViewer"
              outlined
            >
              <template v-slot:prepend
                ><q-icon name="camera_alt" color="purple"
              /></template>
            </q-input>
            <div class="row justify-end q-mt-md">
              <q-btn
                label="儲存設定"
                color="primary"
                :disable="isViewer"
                icon="save"
              ></q-btn>
            </div>
          </q-card>
        </div>

        <div v-if="currentView === 'params_settings'">
          <q-card flat bordered class="q-pa-md my-card">
            <q-toggle
              v-model="paramsData.maintenance"
              label="系統維護模式"
              color="red"
              :disable="isViewer"
            ></q-toggle>
            <q-separator class="q-my-md"></q-separator>
            <div class="text-subtitle2 q-mb-sm"
              >稅率設定 ({{ paramsData.taxRate }}%)</div
            >
            <q-slider
              v-model="paramsData.taxRate"
              :min="0"
              :max="15"
              label
              label-always
              color="primary"
              :disable="isViewer"
            ></q-slider>
            <div class="row justify-end q-mt-md">
              <q-btn
                label="儲存設定"
                color="primary"
                :disable="isViewer"
                icon="save"
              ></q-btn>
            </div>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";


const isLoggedIn = ref(false);
const loginLoading = ref(false);
const loginForm = reactive({
    username: '',
    password: '',
    remember: false
});

// 1. 導航與佈局狀態
const drawer = ref(true);
const miniState = ref(false);
const currentView = ref("dashboard");

const toggleLeftDrawer = () => {
  if ($q.screen.width > 500) {
    miniState.value = !miniState.value;
  } else {
    drawer.value = !drawer.value;
  }
};

const menuList = [
  { id: "dashboard", label: "總覽", icon: "dashboard" },
  { separator: true },
  { id: "home_settings", label: "首頁設定", icon: "home" },
  { id: "intro_settings", label: "介紹設定", icon: "info" },
  { id: "notice_settings", label: "訂房須知", icon: "notifications_active" },
  { id: "location_settings", label: "地理位置", icon: "place" },
  { separator: true },
  // [NEW 1] 前端頁面控制
  { id: "frontend_control", label: "前端頁面控制", icon: "view_quilt" },
  { id: "order_query", label: "異動訂單查詢", icon: "date_range" },
  { id: "member_query", label: "會員/訂房查詢", icon: "people" },
  // [NEW 2] 預覽評價
  { id: "review_preview", label: "預覽評價", icon: "rate_review" },
  { separator: true },
  { id: "report_generation", label: "報表產生", icon: "assessment" },
  // [Moved] 其他設定移到最後
  {
    id: "other_settings_root",
    label: "其他設定",
    icon: "settings",
    children: [
      { id: "social_settings", label: "社群設定", icon: "share" },
      { id: "params_settings", label: "參數設定", icon: "tune" }
    ]
  }
];

const currentTitle = computed(() => {
  const findLabel = (list, id) => {
    for (const item of list) {
      if (item.id === id) return item.label;
      if (item.children) {
        const found = findLabel(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  return findLabel(menuList, currentView.value) || "總覽";
});

const userRole = ref("admin");
const currentUser = reactive({ name: "Admin User", role: "admin" });
const isViewer = computed(() => userRole.value === "viewer");

const switchRole = role => {
  userRole.value = role;
  if (role === "admin") currentUser.name = "Super Admin";
  if (role === "dev") currentUser.name = "Developer";
  if (role === "viewer") currentUser.name = "Reviewer";
  $q.notify({ message: `已切換為 ${role} 模式`, color: "positive" });
};

// [Modified] 登出邏輯
const logout = () => {
    $q.loading.show({ message: '登出中...' });
    setTimeout(() => {
        $q.loading.hide();
        isLoggedIn.value = false;
        loginForm.username = '';
        loginForm.password = '';
        $q.notify({ message: '已登出系統', color: 'primary', icon: 'logout' });
    }, 500);
};

// [NEW] 登入邏輯
const handleLogin = () => {
    loginLoading.value = true;
    // 模擬 API 請求
    setTimeout(() => {
        loginLoading.value = false;
        isLoggedIn.value = true;
        // 簡單將使用者名稱設為輸入的帳號
        currentUser.name = loginForm.username;
        $q.notify({ message: `歡迎回來, ${loginForm.username}`, color: 'positive', icon: 'check' });
    }, 800);
};

const formatCurrency = val => {
  if (!val && val !== 0) return "";
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const notifications = ref([
  {
    id: 1,
    title: "新訂單",
    message: "王小明 預訂了雙人房 (2023-12-01)",
    time: "10分鐘前",
    read: false,
    icon: "bookmark_add",
    color: "green"
  },
  {
    id: 2,
    title: "訂單取消",
    message: "林志玲 取消了訂單 (O20231205)",
    time: "1小時前",
    read: false,
    icon: "bookmark_remove",
    color: "red"
  }
]);

const unreadCount = computed(
  () => notifications.value.filter(n => !n.read).length
);

const addNotification = (
  title,
  message,
  icon = "notifications",
  color = "primary"
) => {
  if (userRole.value === "dev") return;
  notifications.value.unshift({
    id: Date.now(),
    title,
    message,
    time: "剛剛",
    read: false,
    icon,
    color
  });
};

const markAllRead = () => {
  notifications.value.forEach(n => (n.read = true));
};

// Dashboard Data
const recentOrders = ref([
  {
    id: "O20231201",
    guest: "王小明",
    date: "2023-12-01",
    pax: "2大",
    notes: "無",
    status: "已入住"
  },
  {
    id: "O20231202",
    guest: "李小華",
    date: "2023-12-02",
    pax: "2大1小",
    notes: "需要嬰兒床、澡盆，盡量安排高樓層",
    status: "已確認"
  },
  {
    id: "O20231203",
    guest: "陳大文",
    date: "2023-12-03",
    pax: "4大",
    notes: "無",
    status: "已退房"
  },
  {
    id: "O20231204",
    guest: "張三",
    date: "2023-12-04",
    pax: "1大",
    notes: "延後入住",
    status: "待入住"
  },
  {
    id: "O20231205",
    guest: "林志玲",
    date: "2023-12-05",
    pax: "2大",
    notes: "取消原因：行程變更",
    status: "已取消"
  }
]);

const recentOrderColumns = [
  { name: "id", label: "訂單編號", field: "id", align: "left" },
  { name: "guest", label: "訂房人", field: "guest", align: "left" },
  { name: "date", label: "入住日期", field: "date", align: "left" },
  { name: "pax", label: "人數", field: "pax", align: "left" },
  {
    name: "notes",
    label: "備註",
    field: "notes",
    align: "left",
    style: "max-width: 200px"
  },
  { name: "status", label: "狀態", field: "status", align: "center" }
];

const homeData = reactive({
  description: "歡迎來到最棒的旅宿體驗...",
  images: [
    "https://placehold.co/600x400/orange/white?text=Slide+1",
    "https://placehold.co/600x400/blue/white?text=Slide+2",
    "https://placehold.co/600x400/green/white?text=Slide+3"
  ]
});
const addHomeImage = () =>
  homeData.images.push(
    `https://placehold.co/600x400/purple/white?text=New+Img`
  );
const removeHomeImage = idx => homeData.images.splice(idx, 1);

const introTabs = ref([
  {
    id: 1,
    title: "關於我們",
    content: "我們的故事始於...",
    images: ["img1.jpg"]
  },
  {
    id: 2,
    title: "房型介紹",
    content: "豪華雙人房...",
    images: ["img2.jpg", "img3.jpg"]
  }
]);
const tabDialog = reactive({
  show: false,
  isEdit: false,
  data: { title: "", content: "", images: [] }
});
const openTabDialog = (row = null) => {
  tabDialog.isEdit = !!row;
  tabDialog.data = row
    ? JSON.parse(JSON.stringify(row))
    : { id: Date.now(), title: "", content: "", images: [] };
  tabDialog.show = true;
};
const saveTab = () => {
  if (tabDialog.isEdit) {
    const idx = introTabs.value.findIndex(t => t.id === tabDialog.data.id);
    if (idx !== -1) introTabs.value[idx] = tabDialog.data;
  } else {
    introTabs.value.push(tabDialog.data);
  }
  tabDialog.show = false;
};
const deleteTab = id =>
  (introTabs.value = introTabs.value.filter(t => t.id !== id));

const notices = ref([
  { id: 1, title: "入住時間", content: "下午 15:00 後" },
  { id: 2, title: "退房時間", content: "上午 11:00 前" },
  { id: 3, title: "禁菸說明", content: "全館禁菸，違者罰款" }
]);
const noticeDialog = reactive({
  show: false,
  isEdit: false,
  data: { title: "", content: "" }
});
const moveNotice = (index, direction) => {
  const temp = notices.value[index];
  notices.value[index] = notices.value[index + direction];
  notices.value[index + direction] = temp;
};
const openNoticeDialog = (row = null) => {
  noticeDialog.isEdit = !!row;
  noticeDialog.data = row
    ? JSON.parse(JSON.stringify(row))
    : { id: Date.now(), title: "", content: "" };
  noticeDialog.show = true;
};
const saveNotice = () => {
  if (noticeDialog.isEdit) {
    const idx = notices.value.findIndex(n => n.id === noticeDialog.data.id);
    if (idx !== -1) notices.value[idx] = noticeDialog.data;
  } else {
    notices.value.push(noticeDialog.data);
  }
  noticeDialog.show = false;
};
const deleteNotice = index => notices.value.splice(index, 1);

const locationData = reactive({
  address: "台北市信義區測試路100號",
  mapUrl: "https://goo.gl/maps/example",
  transports: [
    { type: "捷運", desc: "搭乘藍線至市政府站 2號出口" },
    { type: "公車", desc: "212, 299 至聯合報大樓站" }
  ]
});
const addTransport = () => locationData.transports.push({ type: "", desc: "" });

const orderQuery = reactive({
  dateRange: { from: "2023/10/01", to: "2024/01/01" },
  status: "全部"
});
const orderList = ref([
  {
    id: "O20231001",
    date: "2023-10-01",
    name: "王小明",
    phone: "0912345678",
    amount: 3000,
    status: "已完成"
  },
  {
    id: "O20231115",
    date: "2023-11-15",
    name: "陳大文",
    phone: "0987654321",
    amount: 5000,
    status: "已取消"
  }
]);
const orderColumns = [
  { name: "id", label: "單號", field: "id", align: "left" },
  { name: "date", label: "日期", field: "date", align: "left" },
  { name: "name", label: "訂購人", field: "name", align: "left" },
  { name: "phone", label: "電話", field: "phone", align: "left" },
  { name: "amount", label: "金額", field: "amount", align: "right" },
  { name: "status", label: "狀態", field: "status", align: "center" }
];
const searchOrders = () => {
  $q.loading.show();
  setTimeout(() => $q.loading.hide(), 500);
};

const queryTab = ref("member");
const memberSearchType = ref("phone");
const memberSearch = ref("");
const memberSearchDateRange = ref({ from: "2023/01/01", to: "2023/12/31" });
const hasSearched = ref(false);

const memberList = ref([
  {
    id: 1,
    name: "王大明",
    phone: "0911222333",
    history: [
      {
        id: 101,
        date: "2023-09-01",
        roomType: "雙人房",
        price: 2000,
        status: "已完成"
      },
      {
        id: 102,
        date: "2023-08-15",
        roomType: "四人房",
        price: 4000,
        status: "已取消"
      },
      {
        id: 103,
        date: "2023-01-20",
        roomType: "雙人房",
        price: 2200,
        status: "已完成"
      }
    ]
  },
  {
    id: 2,
    name: "李四",
    phone: "0955666777",
    history: [
      {
        id: 201,
        date: "2023-10-10",
        roomType: "單人房",
        price: 1500,
        status: "待入住"
      }
    ]
  }
]);

const displayMemberList = ref([]);
const selectedMembers = ref([]);
const bottomTableData = ref([]);

const memberColumns = [
  { name: "name", label: "姓名", field: "name", align: "left" },
  { name: "phone", label: "電話", field: "phone", align: "left" },
  { name: "id", label: "會員編號", field: "id", align: "center" }
];

const bookingHistoryColumns = computed(() => {
  const cols = [
    { name: "date", label: "日期", field: "date", align: "left" },
    { name: "roomType", label: "房型", field: "roomType", align: "left" },
    { name: "status", label: "狀態", field: "status", align: "center" },
    { name: "price", label: "金額", field: "price", align: "right" }
  ];
  if (memberSearchType.value === "date") {
    cols.unshift({
      name: "memberName",
      label: "會員姓名",
      field: "memberName",
      align: "left"
    });
  }
  return cols;
});

const doMemberSearch = () => {
  $q.loading.show();
  hasSearched.value = true;
  selectedMembers.value = [];
  bottomTableData.value = [];

  setTimeout(() => {
    $q.loading.hide();
    if (memberSearchType.value === "phone") {
      if (!memberSearch.value) {
        displayMemberList.value = memberList.value;
      } else {
        const k = memberSearch.value;
        displayMemberList.value = memberList.value.filter(
          m => m.name.includes(k) || m.phone.includes(k)
        );
      }
    } else {
      let allHistory = [];
      memberList.value.forEach(m => {
        m.history.forEach(h => {
          allHistory.push({ ...h, memberName: m.name });
        });
      });
      bottomTableData.value = allHistory;
    }
  }, 500);
};

const onMemberRowClick = (evt, row) => {
  selectedMembers.value = [row];
  bottomTableData.value = row.history;
};

const maskName = name => {
  if (!name) return "";
  if (name.length === 2) return name[0] + "*";
  if (name.length >= 3)
    return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
  return name;
};

const bookingIdSearch = ref("");
const foundBooking = computed(() => {
  if (bookingIdSearch.value === "B001") {
    return {
      id: "B001",
      name: "張三豐",
      phone: "0999888777",
      status: "已確認",
      checkIn: "2023-12-25",
      checkOut: "2023-12-27",
      pax: { adults: 2, children: 1 },
      notes: "需要嬰兒澡盆，延後入住。"
    };
  }
  return null;
});
const getStatusColor = s =>
  s === "已確認"
    ? "green"
    : s === "已入住"
    ? "blue"
    : s === "已取消"
    ? "red"
    : "grey";

const statusDialog = reactive({
  show: false,
  status: "",
  reason: "",
  target: null
});
const openStatusDialog = booking => {
  statusDialog.target = booking;
  statusDialog.status = booking.status;
  statusDialog.reason = "";
  statusDialog.show = true;
};
const confirmStatusChange = () => {
  if (statusDialog.target) {
    statusDialog.target.status = statusDialog.status;
    addNotification(
      "訂單狀態更新",
      `訂單 ${statusDialog.target.id} 狀態已變更為 ${statusDialog.target.status}。備註: ${statusDialog.reason}`,
      "edit",
      "orange"
    );
  }
  statusDialog.show = false;
};
const cancelOrder = booking => {
  $q.dialog({
    title: "取消訂單",
    message: "確定要取消此訂單嗎？",
    cancel: true,
    persistent: true
  }).onOk(() => {
    booking.status = "已取消";
    addNotification(
      "訂單取消",
      `訂單 ${booking.id} 已被取消。`,
      "cancel",
      "red"
    );
  });
};

// --- [NEW] 前端頁面控制邏輯 ---
const frontendPages = ref([
  { id: "intro", name: "介紹", visible: true, order: 1 },
  { id: "rooms", name: "房型介紹", visible: true, order: 2 },
  { id: "notices", name: "訂房須知", visible: true, order: 3 },
  { id: "location", name: "地理位置", visible: true, order: 4 },
  { id: "news", name: "最新消息", visible: false, order: 5 }
]);
const moveFrontendPage = (index, direction) => {
  const temp = frontendPages.value[index];
  frontendPages.value[index] = frontendPages.value[index + direction];
  frontendPages.value[index + direction] = temp;
};

// --- [NEW] 預覽評價邏輯 ---
const reviews = ref([
  {
    id: 1,
    date: "2023-12-05",
    customer: "陳小美",
    rating: 5,
    content: "房間非常乾淨，服務也很棒！",
    status: "unread",
    reply: ""
  },
  {
    id: 2,
    date: "2023-12-04",
    customer: "林大山",
    rating: 3,
    content: "隔音稍微有點不好，但整體還可以。",
    status: "read",
    reply: "感謝您的反饋，我們會加強隔音設施。"
  },
  {
    id: 3,
    date: "2023-12-01",
    customer: "王阿明",
    rating: 4,
    content: "早餐很好吃，位置方便。",
    status: "unread",
    reply: ""
  }
]);
const reviewFilter = reactive({
  unreadOnly: false,
  dateRange: { from: "2023/01/01", to: "2023/12/31" }
});
const reviewDialog = reactive({
  show: false,
  currentReview: null,
  replyText: ""
});

const openReviewDialog = review => {
  reviewDialog.currentReview = review;
  reviewDialog.replyText = review.reply || "";
  reviewDialog.show = true;
  // 若是未讀，點擊後可自動標為已讀 (或是回覆後才標示，這邊示範點擊即標示)
  if (review.status === "unread") review.status = "read";
};
const submitReply = () => {
  if (reviewDialog.currentReview) {
    reviewDialog.currentReview.reply = reviewDialog.replyText;
    reviewDialog.currentReview.status = "replied"; // 假設有已回覆狀態
    $q.notify({ message: "回覆已送出", color: "positive" });
  }
  reviewDialog.show = false;
};

const socialData = reactive({
  fb: "https://fb.com",
  ig: "https://instagram.com"
});
const paramsData = reactive({ maintenance: false, taxRate: 5 });
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.my-card {
  width: 100%;
}
/* Home Settings Redesign Styles */
.home-preview-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
}
.img-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}
.img-card:hover .img-hover-overlay {
  opacity: 1;
}
.custom-tab {
  min-width: 150px;
  font-size: 1.1em;
}
.upload-placeholder {
  border: 2px dashed #ddd;
  border-radius: 8px;
  transition: all 0.3s ease;
  color: #999;
}
.upload-placeholder:hover {
  border-color: #1976d2;
  color: #1976d2;
  background-color: #f0f9ff;
}
/* 評價表格樣式 */
.review-unread {
  background-color: #fef3c7; /* 淺黃色背景標示未讀 */
  font-weight: 500;
}
.login-bg {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}
@keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
</style>
