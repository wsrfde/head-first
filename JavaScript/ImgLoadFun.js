let nonEmptyImgLength = 0   //非空img总数初始化
let isDetect = false      // 是否在滚动一步后监测图片是否完成
let lastCount = {count: 0} // 最后一次计数
let copyCount = {}
let y = 0     // 滚动距离
let step = document.documentElement.clientHeight // 当前视窗的高度
let clearTime = null

function startScroll() {
  window.scroll(0, 0)
  // 等待时间
  setTimeout(f, 1000)
}

function f() {
  if (y < document.body.scrollHeight) {
    y += step
    window.scroll({top: y, left: 0, behavior: 'smooth', onfinish: setFun()})
    if (isDetect) resourceTiming()
    // 滚动等待时间
    clearTime = setTimeout(f, 500)
  } else {
    console.log(y);
    window.scroll({top: 0, left: 0, behavior: 'smooth', onfinish: checkFun()})
  }
}

function setFun() {
  lastCount.count++
  console.log('滚动计数', lastCount.count);
}

function checkFun() {
  let arr = document.querySelectorAll('img')
  let availableImgArr = Array(...arr).filter(n => n.getAttribute('src') !== '')
  // console.log(availableImgArr)
  console.log('所有图片总数量为', availableImgArr.length)
  nonEmptyImgLength = availableImgArr.length
  resourceTiming()
}

function resourceTiming() {
  let resourceList = window.performance.getEntriesByType("resource");
  // let imgResourceList = resourceList.filter(item => item.initiatorType === 'img').length
  let imgResourceList = resourceList.filter(item => item.initiatorType === 'img' && item.nextHopProtocol !== '').length
  // console.log(resourceList);
  console.log('有效图片加载数量为：' + imgResourceList)
  let successCount = 0
  for (let item of resourceList) {
    if (item.initiatorType === "img" && item.nextHopProtocol !== '') {
      successCount++;
      // console.log("请求成功，时间为: " + (item.responseEnd) + '。计数为：' + successCount);
    }
    // if (item.initiatorType === "img" && item.nextHopProtocol === '') {
    //   console.log('协议为空的item：', item)
    // }
  }
  if (isDetect) console.log('已开启每步监测')
  if (copyCount !== {} && lastCount.count === copyCount.count) isDetect = false
  if (successCount < nonEmptyImgLength && isDetect === false) {
    console.log(`😑请求成功图片${successCount}少于总数量${nonEmptyImgLength}，准备重新滚动`)
    copyCount = {...lastCount}
    lastCount.count = 0
    y = 0
    isDetect = true
    clearTimeout(clearTime)
    clearTime = null
    startScroll()
  } else if (successCount >= nonEmptyImgLength) {
    console.log(`🐱‍🏍成功数${successCount}大于等于${nonEmptyImgLength}张图片全部加载成功了老铁，可以进行截屏了`)
    clearTimeout(clearTime)
    clearTime = null
    y += document.body.scrollHeight   // 单步监测成功后防止滚动
    return
  }
  console.log('successCount:', successCount, 'nonEmptyImgLength:', nonEmptyImgLength,
      'copyCount:', copyCount, 'lastCount:', lastCount, 'isDetect:', isDetect, 'y' + y)
}

window.onload = function () {
  console.log('--------')
  startScroll()
}
