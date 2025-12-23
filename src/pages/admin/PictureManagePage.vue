<template>
  <div id="pictureManagePage">
    <a-flex justify="space-between">
      <h2>Menu Assets</h2>
      <a-space>
        <a-button type="primary" href="/picture/addPicture" target="_blank">+ Create menu</a-button>
        <a-button type="primary" href="/picture/addPicture/batch" target="_blank" ghost
          >+ Batch create</a-button
        >
      </a-space>
    </a-flex>
    <div style="margin-bottom: 16px" />
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="Keyword" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="Search name and notes"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="Cuisine" name="category">
        <a-input v-model:value="searchParams.category" placeholder="Enter cuisine" allow-clear />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit">Search</a-button>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data-source="dataList"
      :pagination="pagination"
      @change="doTableChange"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'url'">
          <a-image :src="record.thumbnailUrl ?? record.url" :width="120" />
        </template>
        <!-- Picture info -->
        <template v-if="column.dataIndex === 'picInfo'">
          <div>Format: {{ record.pictureFormat }}</div>
          <div>Width: {{ record.pictureWidth }}</div>
          <div>Height: {{ record.pictureHeight }}</div>
          <div>Size: {{ (record.pictureSize / (1024 * 1024)).toFixed(2) }}MB</div>
        </template>
        <template v-else-if="column.dataIndex === 'editTime'">
          {{ dayjs(record.editTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </template>
    </a-table>
  </div>
</template>
<script setup lang="ts">
import {
  deletePictureUsingPost,
  doPictureReviewUsingPost,
  listPictureByPageUsingPost,
} from '@/api/pictureController'
import { computed, onMounted, reactive, ref } from 'vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
import { PIC_REVIEW_STATUS_ENUM } from '../../constants/picture'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    width: 80,
  },
  {
    title: 'Image',
    dataIndex: 'url',
    width: 150,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    width: 10,
  },
  {
    title: 'Notes',
    dataIndex: 'introduction',
    width: 150,
    // ellipsis: true,
  },
  {
    title: 'Cuisine',
    dataIndex: 'category',
    width: 100,
  },
  {
    title: 'Tags',
    dataIndex: 'tags',
    width: 150,
  },
  {
    title: 'Image info',
    dataIndex: 'picInfo',
    width: 190,
  },
  {
    title: 'User id',
    dataIndex: 'userId',
    width: 180,
  },
  {
    title: 'Review info',
    dataIndex: 'reviewMessage',
  },
  {
    title: 'Created at',
    dataIndex: 'createTime',
    width: 200,
  },
  {
    title: 'Updated at',
    dataIndex: 'editTime',
    width: 200,
  },
  {
    title: 'Actions',
    key: 'action',
  },
]

// Data
const dataList = ref([])
const total = ref(0)

// Search params
const searchParams = reactive<API.PictureQueryRequest>({
  current: 1,
  pageSize: 10,
})

// Fetch data
const fetchData = async () => {
  const res = await listPictureByPageUsingPost({
    ...searchParams,
  })
  if (res.data.data) {
    dataList.value = res.data.data.records ?? []
    total.value = res.data.data.total ?? 0
  } else {
    message.error('Failed to load data: ' + res.data.message + ' ' + res.data.description)
  }
}

// Pagination
const pagination = computed(() => {
  return {
    current: searchParams.current ?? 1,
    pageSize: searchParams.pageSize ?? 10,
    total: total.value,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total}`,
  }
})

// Table change
const doTableChange = (page: any) => {
  searchParams.current = page.current
  searchParams.pageSize = page.pageSize
  fetchData()
}
// Trigger search
const doSearch = () => {
  // Reset page
  searchParams.current = 1
  fetchData()
}

// Delete record
const doDelete = async (id: string) => {
  if (!id) {
    return
  }
  const res = await deletePictureUsingPost({ id })
  if (res.data.code === 0) {
    message.success('Deleted')
    // Refresh data
    await fetchData()
  } else {
    message.error('Delete failed')
  }
}

const router = useRouter()

// Edit picture
const doUpdate = (id: string) => {
  router
    .push({
      path: '/picture/addPicture',
      query: {
        id: id,
      },
    })
    .then(() => {
      // console.log('Navigation successful')
    })
    .catch((err) => {
      // console.error('Navigation failed', err)
    })
}

const handleReview = async (record: API.Picture, reviewStatus: number) => {
  const reviewMessage =
    reviewStatus === PIC_REVIEW_STATUS_ENUM.PASS ? 'Approved by admin' : 'Rejected by admin'
  const res = await doPictureReviewUsingPost({
    id: record.id,
    reviewStatus,
    reviewMessage,
  })
  if (res.data.code === 0) {
    message.success('Review updated')
    // Refresh list
    fetchData()
  } else {
    message.error('Review failed: ' + res.data.message + ' ' + res.data.description)
  }
}

// Fetch once on mount
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
