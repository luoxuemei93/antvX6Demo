// 比较2个数组的差异
const arrayDifference = (arr1, arr2) => {
  return arr1.filter(item => !arr2.includes(item))
}

// 生成并导出json文件
const downloadBlob = (blob, fileName = 'data.json') => {
  // 创建一个下载链接
  let downloadLink = document.createElement('a')
  downloadLink.href = URL.createObjectURL(blob)
  downloadLink.download = fileName // 设置文件名
  downloadLink.click()
  downloadLink = null
}

export {
  arrayDifference,
  downloadBlob
}
