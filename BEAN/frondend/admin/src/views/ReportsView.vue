<template>
  <div>
    <div class="text-h5 q-mb-md">報表產生</div>
    <div class="row q-col-gutter-lg justify-center q-mt-xl">
      <div class="col-12 col-md-5 text-center">
        <q-btn
          color="primary"
          class="full-width"
          size="xl"
          outline
          style="height: 150px"
          @click="$q.notify({ message: '下載入住清單...', icon: 'download' })"
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
            <q-icon name="attach_money" size="4em" class="q-mb-sm"></q-icon>
            <div>收入金額財報</div>
            <div class="text-caption text-grey">(財務統計與分析)</div>
          </div>
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
</script>
