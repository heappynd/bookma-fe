<template>
  <div class="p-8">
    <div class="mb-2">
      <ElButton @click="checkRepeat">检查重复书签</ElButton>
    </div>

    <ElTabs v-model="activeName" type="card" class="demo-tabs">
      <ElTabPane label="常用库" name="0"></ElTabPane>
      <ElTabPane label="工程化" name="1"></ElTabPane>
      <ElTabPane label="很有用的库" name="2"></ElTabPane>
      <ElTabPane label="收藏库、很少用" name="3"></ElTabPane>
      <ElTabPane label="写后端" name="4"></ElTabPane>
      <ElTabPane label="脚手架" name="5"></ElTabPane>
      <ElTabPane label="其他" name="6"></ElTabPane>
      <ElTabPane label="Vue" name="7"></ElTabPane>
      <ElTabPane label="React" name="8"></ElTabPane>
    </ElTabs>

    <div class="grid grid-cols-4 gap-4">
      <div
        class="border h-[180px] p-4 bg-white flex items-center justify-center cursor-pointer"
        @click="handleAdd"
      >
        Add
      </div>

      <div
        v-for="item in bookmarks"
        :key="item.github"
        class="group border h-[180px] p-4 bg-white hover:border-blue-500 cursor-pointer relative flex justify-center"
        @click="linkTo(item.url, item.github)"
      >
        <img
          class="h-full object-contain"
          :src="
            !item.logo_is_icon && item.logo
              ? item.logo
              : getSocialifyImage(item.github, item.logo)
          "
          :alt="item.github"
        />

        <div class="flex items-center gap-2 absolute bottom-2 right-2">
          <div
            class="i-bi-github group-hover:block hidden w-6 h-6"
            @click.stop="linkToGithub(item.github)"
          ></div>
        </div>
      </div>
    </div>

    <div class="flex justify-end mt-4 bg-white">
      <ElPagination :total="bookmarks ? bookmarks.length : 0" layout="total" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { computed } from "vue";
import data from "./data";
import { ElMessage } from "element-plus";

const handleAdd = () => {};
const linkTo = (url: string, github: string) => {
  if (url) {
    window.open(url, "_blank");
  } else {
    linkToGithub(github);
  }
};
const handleDelete = (id: string) => {};
const linkToGithub = (repo: string) => {
  window.open(`https://github.com/${repo}`, "_blank");
};

const activeName = useStorage("active-name", "0");

const bookmarks = computed(() => {
  return data.get(activeName.value);
});

const getSocialifyImage = (repo: string, logo?: string) => {
  const [owner, name] = repo.split("/");
  const url = new URL("", `https://socialify.git.ci/${repo}/image`);
  url.searchParams.set("description", "1");
  url.searchParams.set("language", "1");
  url.searchParams.set("name", "1");
  url.searchParams.set("stargazers", "1");
  url.searchParams.set("theme", "Auto");

  if (owner !== name) {
    url.searchParams.set("owner", "1");
  }
  if (logo) {
    url.searchParams.set("logo", logo);
    url.searchParams.delete("language");
  }
  // console.log("url", url);
  return url.href;
};

const checkRepeat = () => {
  const map = new Map<string, number>([]);
  const repeatData: string[] = [];
  for (const value of data.values()) {
    value.forEach((item) => {
      const count = map.get(item.github);
      if (count) {
        map.set(item.github, count + 1);
        repeatData.push(item.github);
      } else {
        map.set(item.github, 1);
      }
    });
  }
  if (repeatData.length) {
    ElMessage.warning("存在重复：" + repeatData.toString());
  } else {
    ElMessage.success("无重复");
  }
};
</script>

<style scoped></style>
