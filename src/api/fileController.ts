// @ts-ignore
/* eslint-disable */
import request from '@/plugins/myAxios'

/** testDownloadFile GET /api/picture/test/download/ */
export async function testDownloadFileUsingGet(
  // Param type (non-body params from swagger)
  params: API.testDownloadFileUsingGETParams,
  options?: { [key: string]: any },
) {
  return request<any>('/api/picture/test/download/', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  })
}

/** testUploadFile POST /api/picture/test/upload */
export async function testUploadFileUsingPost(
  body: {},
  file?: File,
  options?: { [key: string]: any },
) {
  const formData = new FormData()

  if (file) {
    formData.append('file', file)
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele]

    if (item !== undefined && item !== null) {
      if (typeof item === 'object' && !(item instanceof File)) {
        if (item instanceof Array) {
          item.forEach((f) => formData.append(ele, f || ''))
        } else {
          formData.append(ele, JSON.stringify(item))
        }
      } else {
        formData.append(ele, item)
      }
    }
  })

  return request<API.BaseResponseString_>('/api/picture/test/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  })
}
