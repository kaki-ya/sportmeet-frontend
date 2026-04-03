<template>
  <ContentBase>
    <div class="container mt-4">
      <div class="row">
        <!-- 左侧：分数规则卡片（固定高度） -->
        <div class="col-md-4 mb-3">
          <div class="card" style="height: 350px;">
            <div class="card-header">规则</div>
            <div class="card-body text-center d-flex flex-column justify-content-center">
              <h5 class="card-title">分数规则</h5>
              <p class="card-text">第一名: +10分</p>
              <p class="card-text">第二名: +8分</p>
              <p class="card-text">第三名: +5分</p>
              <p class="card-text">其余: +1分</p>
            </div>
          </div>
        </div>

        <!-- 右侧：固定大小轮播图（和卡片同高） -->
        <div class="col-md-8 mb-3">
          <div id="carouselFixedSize" data-bs-ride="carousel" data-bs-interval="3000" class="carousel slide" style="height: 350px; border-radius: 0.375rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.12);">
            <!-- 轮播指示器 -->
            <div class="carousel-indicators">
              <button type="button" data-bs-target="#carouselFixedSize" data-bs-slide-to="0" class="active"></button>
              <button type="button" data-bs-target="#carouselFixedSize" data-bs-slide-to="1"></button>
              <button type="button" data-bs-target="#carouselFixedSize" data-bs-slide-to="2"></button>
              <button type="button" data-bs-target="#carouselFixedSize" data-bs-slide-to="3"></button>
              <button type="button" data-bs-target="#carouselFixedSize" data-bs-slide-to="4"></button>
            </div>

            <!-- 轮播内容区（固定高度） -->
            <div class="carousel-inner h-100">
              <div class="carousel-item active h-100">
                <img src="https://ts1.tc.mm.bing.net/th/id/R-C.d55d21d9e3c46410c68ac200d181a6f7?rik=7dvH4ti4mC4YzQ&riu=http%3a%2f%2fctdsb.clouddiffuse.xyz%2f63493c56-20b6-4352-b482-d1a51e1c9d0a&ehk=OoXfVyCxdN6iomZgJfzAtJ1wQXddWWmVftrN%2bOfccuU%3d&risl=&pid=ImgRaw&r=0" class="d-block w-100 h-100 object-fit-cover" alt="运动会图片1">
              </div>
              <div class="carousel-item h-100">
                <img src="https://img.olympics.com/images/image/private/t_16-9_760/f_auto/v1538355600/primary/ank2vnsdi4smttzsshwc" class="d-block w-100 h-100 object-fit-cover" alt="运动会图片2">
              </div>
              <div class="carousel-item h-100">
                <img src="https://static.wildto.com/news/20246/1721493135370" class="d-block w-100 h-100 object-fit-cover" alt="运动会图片3">
              </div>
              <div class="carousel-item h-100">
                <img src="https://vpic-cover.puui.qpic.cn/j4100nkew4o/j4100nkew4o_1741922509_hz.jpg/1280" class="d-block w-100 h-100 object-fit-cover" alt="运动会图片2">
              </div>
              <div class="carousel-item h-100">
                <img src="https://ts1.tc.mm.bing.net/th/id/R-C.5ea676ee9280a76d3ffd58bfffa5aaf1?rik=JGYpX1bYiNYACA&riu=http%3a%2f%2fd.ifengimg.com%2fq100%2fimg1.ugc.ifeng.com%2fnewugc%2f20171031%2f8%2fwemedia%2f77ae2ec162b0fe2396ed9773953af29e58e70166_size266_w1920_h1079.jpg&ehk=MmpEOckWhYlH48I35ORidazWJ27gzpEJhEos%2fMmjA5g%3d&risl=&pid=ImgRaw&r=0" class="d-block w-100 h-100 object-fit-cover" alt="运动会图片2">
              </div>
            </div>

            <!-- 左右切换按钮 -->
            <button class="carousel-control-prev" type="button" data-bs-target="#carouselFixedSize" data-bs-slide="prev">
              <span class="carousel-control-prev-icon"></span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#carouselFixedSize" data-bs-slide="next">
              <span class="carousel-control-next-icon"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </ContentBase>
</template>

<script>
import ContentBase from '../components/ContentBase';

export default {
  name: "HomeView",
  components: {
    ContentBase,
  }
}
</script>

<style scoped>
/* 确保图片不变形 */
.object-fit-cover {
  object-fit: cover;
}

</style>