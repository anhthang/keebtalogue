<template>
  <a-list item-layout="horizontal" :data-source="guides">
    <template #renderItem="{ item }">
      <a-list-item>
        <a-list-item-meta :description="item.summary">
          <template #title>
            <a :href="item.url" target="_blank">{{ item.title }}</a>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<script setup>
const guides = [
  {
    title: "Start Here: Collecting Roadmap",
    summary:
      "An overview of the Artisan Collector guides and recommended reading sequence for newcomers",
    url: "https://artisancollector.com/guides/start/",
  },
  {
    title: "What are Artisan Keycaps?",
    summary:
      "The fundamentals of artisan keycaps, the various stems, profiles, types, how they are typically made, and where to learn more",
    url: "https://artisancollector.com/guides/what-are-artisan-keycaps/",
  },
  {
    title: "Collecting Artisans: Retail Sales",
    summary:
      "The various artisan sale types, how they work, platforms on which the sales are run, and notification methods that require monitoring.",
    url: "https://artisancollector.com/guides/collecting-artisans-retail/",
  },
  {
    title: "The Three Artisan Collector Resources",
    summary:
      "The three main resources that impact your ability to collect artisans, and the relationship between them",
    url: "https://artisancollector.com/guides/3-artisan-collecting-resources/",
  },
];
</script>