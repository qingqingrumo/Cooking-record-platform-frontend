<template>
  <div class="picture-search-form">
    <!-- Search form -->
    <a-form layout="inline" :model="searchParams" @finish="doSearch">
      <a-form-item label="Keyword" name="searchText">
        <a-input
          v-model:value="searchParams.searchText"
          placeholder="Search name and notes"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="Ingredients" name="category">
        <a-auto-complete
          v-model:value="searchParams.category"
          style="min-width: 180px"
          :options="categoryOptions"
          placeholder="Enter cuisine"
          allowClear
        />
      </a-form-item>
      <a-form-item label="Tags" name="tags">
        <a-select
          v-model:value="searchParams.tags"
          style="min-width: 180px"
          :options="tagOptions"
          mode="tags"
          placeholder="Enter tags"
          allowClear
        />
      </a-form-item>
      <a-form-item label="Date" name="">
        <a-range-picker
          style="width: 400px"
          show-time
          v-model:value="dateRange"
          :placeholder="['Start date', 'End date']"
          format="YYYY/MM/DD HH:mm:ss"
          :presets="rangePresets"
          @change="onRangeChange"
        />
      </a-form-item>
      <a-form-item label="Name" name="name">
        <a-input v-model:value="searchParams.name" placeholder="Enter name" allow-clear />
      </a-form-item>
      <a-form-item label="Notes" name="introduction">
        <a-input v-model:value="searchParams.introduction" placeholder="Enter notes" allow-clear />
      </a-form-item>
      <a-form-item label="Width" name="picWidth">
        <a-input-number v-model:value="searchParams.picWidth" />
      </a-form-item>
      <a-form-item label="Height" name="picHeight">
        <a-input-number v-model:value="searchParams.picHeight" />
      </a-form-item>
      <a-form-item label="Format" name="picFormat">
        <a-input v-model:value="searchParams.picFormat" placeholder="Enter format" allow-clear />
      </a-form-item>
      <a-form-item label="Color">
        <color-picker format="hex" @pureColorChange="onColorChange" />
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" style="width: 96px">Search</a-button>
          <a-button html-type="reset" @click="doClear">Reset</a-button>
        </a-space>
      </a-form-item>

    </a-form>
  </div>

</template>
<script lang="ts" setup>
import { message } from 'ant-design-vue'
import PictureQueryRequest = API.PictureQueryRequest
import { onMounted, reactive, ref } from 'vue'
import dayjs from 'dayjs'
import { listPictureTagCategoryUsingGet } from '@/api/pictureController'
import { ColorPicker } from 'vue3-colorpicker'
import "vue3-colorpicker/style.css"

interface Props {
  onSearch?: (searchParams: PictureQueryRequest) => void
}

const props = defineProps<Props>()

// Search params
const searchParams = reactive<API.PictureQueryRequest>({})

// Trigger search
const doSearch = () => {
  // console.log(searchParams);
  props.onSearch?.(searchParams)
}

const dateRange = ref<[]>([])

/**
 * Handle date range change
 * @param dates
 * @param dateStrings
 */
const onRangeChange = (dates: any[], dateStrings: string[]) => {
  if (dates.length < 2) {
    searchParams.startEditTime = undefined
    searchParams.endEditTime = undefined
  } else {
    searchParams.startEditTime = dates[0].toDate()
    searchParams.endEditTime = dates[1].toDate()
    // console.log(searchParams.startEditTime)
  }
}

const rangePresets = ref([
  { label: 'Last 7 days', value: [dayjs().add(-7, 'd'), dayjs()] },
  { label: 'Last 14 days', value: [dayjs().add(-14, 'd'), dayjs()] },
  { label: 'Last 30 days', value: [dayjs().add(-30, 'd'), dayjs()] },
  { label: 'Last 90 days', value: [dayjs().add(-90, 'd'), dayjs()] },
])


const categoryOptions = ref<string[]>([])
const tagOptions = ref<string[]>([])

// Fetch tag and category options
const getTagCategoryOptions = async () => {
  const res = await listPictureTagCategoryUsingGet()
  if (res.data.code === 0 && res.data.data) {
    // Map to select options
    tagOptions.value = (res.data.data.tagList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
    categoryOptions.value = (res.data.data.categoryList ?? []).map((data: string) => {
      return {
        value: data,
        label: data,
      }
    })
  } else {
    message.error('Failed to load options: ' + res.data.message + ' ' + res.data.description)
  }
}

// Reset
const doClear = () => {
  // Reset color first
  // searchParams.pictureColor = "#000000"
  // Clear all fields
  Object.keys(searchParams).forEach((key) => {
    searchParams[key] = undefined
  })
  dateRange.value = []
  props.onSearch?.(searchParams)
}


onMounted(() => {
  getTagCategoryOptions()
})

const onColorChange = (color: string) => {
  searchParams.pictureColor = color;
  // console.log(searchParams.pictureColor);

}


</script>

<style scoped>
.picture-search-form .ant-form-item {
  margin-top: 16px;
}

</style>
