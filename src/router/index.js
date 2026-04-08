import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import EventInformationView from "@/views/EventInformationView.vue";
import ScoreStatisticsAndRankingQueryView from "@/views/ScoreStatisticsAndRankingQueryView.vue";
import AthletesView from "@/views/AthletesView.vue";
import NotFound from "@/views/NotFound.vue";
import AthletesDetailedView from "@/views/AthletesDetailedView.vue";
import TeamView from "@/views/TeamView.vue";
import TeamDetail from "@/views/TeamDetail.vue";

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path:'/AthletesDetailed/:id',
    name:'AthletesDetailed',
    component: AthletesDetailedView
  },
  {
    path: '/Login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/Register',
    name: 'Register',
    component: RegisterView
  },
  {
    path: '/Athletes',
    name: 'Athletes',
    component: AthletesView
  },
  {
    path: '/EventInformation',
    name: 'EventInformation',
    component: EventInformationView
  },
  {
    path: '/ScoreStatisticsAndRankingQuery',
    name: 'ScoreStatisticsAndRankingQuery',
    component: ScoreStatisticsAndRankingQueryView
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  },
  {
    path: '/TeamDetail/:teamId',
    name: 'TeamDetail',
    component: TeamDetail
  },
  {
    path: '/TeamInformation',
    name: 'TeamInformation',
    component: TeamView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect :'/404'
  },
  {
    path: '/catchAll(.*)',
    redirect: "/404/",
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
