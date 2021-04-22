let nonEmptyImgLength = 0   //非空img总数初始化

function startScroll () {
  let y = 0
  let step = document.documentElement.clientHeight // 当前视窗的高度
  window.scroll(0, 0)

  function f() {
    if (y < document.body.scrollHeight) {
      y += step
      window.scroll({top: y, left: 0, behavior: 'smooth', onfinish: setFun()})
      setTimeout(f, 400)
    } else {
      console.log(y);
      window.scroll({top: 0, left: 0, behavior: 'smooth', onfinish: checkFun()})
    }
  }
  setTimeout(f, 1000)
}
startScroll()

function setFun() {
  console.count('滚动计数');
}


function checkFun() {
  let arr = document.querySelectorAll('img')
  let availableImgArr = Array(...arr).filter(n => n.getAttribute('src') !== '')
  console.log(availableImgArr)
  console.log('所有图片总数量为', availableImgArr.length)
  nonEmptyImgLength = availableImgArr.length
  resourceTiming()
}
function resourceTiming() {
  let resourceList = window.performance.getEntriesByType("resource");
  let imgResourceList = resourceList.filter(item => item.initiatorType === 'img').length
  console.log(resourceList);
  console.log('图片总数量为：' + imgResourceList)
  let successCount = 0
  for (let item of resourceList) {
    if (item.initiatorType === "img" && item.nextHopProtocol !== '') {
      successCount++;
      console.log("请求成功，时间为: " + (item.responseEnd) + '。计数为：' + successCount);
    }
    if(item.initiatorType === "img" && item.nextHopProtocol === ''){
      console.log('协议为空的item：',item)
    }
  }
  if(successCount < nonEmptyImgLength ){
    console.log('😑请求成功图片少与总数量，准备重新滚动')
    startScroll()
  }else{
    console.log('🐱‍🏍全部加载成功了老铁，可以进行截屏了')
  }
}
