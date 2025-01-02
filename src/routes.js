import Login from './views/Login'
import Category from './views/Category'
import Tags from './views/Tags'
import Food from './views/Food'
import Profile from './views/VendorProfile'
import Orders from './views/Orders'
import Configuration from './views/Configuration'
import Users from './views/Users'
import RestaurantOnboard from './components/RestaurantOnboarding/RestaurantOnboard.jsx'
// import VendorPro from './components/VenorProfile/VendorPro.jsx'
import Vendors from './views/Vendors'
import RestaurantList from './views/RestaurantList'
import ResetPassword from './views/ForgotPassword'
import Options from './views/Options'
import Addons from './views/Addons'
import Dashboard from './views/Dashboard'
import Restaurant from './views/Restaurant'
import Ratings from './views/Rating'
import Timings from './views/Timings'
import Tipping from './views/Tipping'
import Zone from './views/Zone'
import Sections from './views/Sections'
import Commission from './views/Commission'
import DeliveryBoundsAndLocation from './views/DeliveryBoundsAndLocation'
import Finance from './components/Finance/Finance.jsx'
import AccountManager from './components/AccountManager/AccountManager.jsx'
import { ReactComponent as VendorIcon } from './assets/svg/vendor.svg'
import { ReactComponent as RestaurantIcon } from './assets/svg/restaurant.svg'
import { ReactComponent as CommissionsIcon } from './assets/svg/commission.svg'
import { ReactComponent as ConfigurationIcon } from './assets/svg/configuration.svg'
import { ReactComponent as CouponsIcon } from './assets/svg/coupons.svg'
import { ReactComponent as DeliveryIcon } from './assets/svg/delivery.svg'
import { ReactComponent as NotificationsIcon } from './assets/svg/notifications.svg'
import { ReactComponent as RequestIcon } from './assets/svg/request.svg'
import { ReactComponent as TippingsIcon } from './assets/svg/tipping.svg'
import { ReactComponent as UserIcon } from './assets/svg/user.svg'
import { ReactComponent as ZonesIcon } from './assets/svg/zones.svg'
import { ReactComponent as HomeIcon } from './assets/svg/home.svg'
import { ReactComponent as AddonsIcon } from './assets/svg/addons.svg'
import { ReactComponent as BackIcon } from './assets/svg/back.svg'
import { ReactComponent as CategoryIcon } from './assets/svg/category.svg'
import { ReactComponent as DashboardIcon } from './assets/svg/dashboard.svg'
import { ReactComponent as FoodIcon } from './assets/svg/food.svg'
import { ReactComponent as LocationIcon } from './assets/svg/location.svg'
import { ReactComponent as OptionIcon } from './assets/svg/option.svg'
import { ReactComponent as OrderIcon } from './assets/svg/order.svg'
import { ReactComponent as PaymentIcon } from './assets/svg/payment.svg'
import { ReactComponent as RatingIcon } from './assets/svg/rating.svg'
import { ReactComponent as TimingIcon } from './assets/svg/timings.svg'
import { ReactComponent as RestaurantSectionIcon } from './assets/svg/restSection.svg'
import { ReactComponent as Search } from './assets/svg/icons8-search.svg'
// import { ReactComponent as RiderIcon } from './assets/svg/riders.svg'
import SuperAdminDashboard from './views/SuperAdminDashboard'
import Cuisines from './views/Cuisines'
import Banners from './views/Banners'
// import SpAdmin from './views/SpAdmin'
import Banner from './components/banners/constants/BannerTemplate.jsx'
// import Banner from './components/Banner/Banner.jsx'
import ShrComponent from './components/ShrComponent/ShrComponent'
import SpRestaurant from './views/SpRestaurant'
// import DeliveryBoundsAndLocation from './views/DeliveryBoundsAndLocation'
// import DispatchRestaurant from './views/DispatchRestaurant'
// import WithdrawRequest from './views/WithdrawRequest'
// import Notifications from './views/Notifications'
// import Payment from './views/Payment'
// import Dispatch from './views/Dispatch'
// import Coupons from './views/Coupons'
// import Riders from './views/Riders'
// import DemoConfiguration from './views/Configuration1' //comment this for paid version
import OfferPage from "./components/OffersPage/OfferPage.js"

var routes = [
  {
    path: '/dashboard',
    name: 'Home',
    icon: HomeIcon,
    component: SuperAdminDashboard,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  {
    path: '/RestaurantOnboard',
    name: 'Restaurant Onboarding',
    icon: VendorIcon,
    component: RestaurantOnboard,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  // {
  //   path: '/VendorPro',
  //   name: 'Vendor Profile',
  //   icon: VendorIcon,
  //   component: VendorPro,
  //   layout: '/super_admin',
  //   appearInSidebar: true,
  //   admin: true
  // },
  {
    path: '/vendors',
    name: 'Vendors',
    icon: VendorIcon,
    component: Vendors,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  {
    path: '/restaurants',
    name: 'Restaurants',
    icon: RestaurantIcon,
    component: RestaurantList,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  {
    path: '/sections',
    name: 'Restaurant Sections',
    icon: RestaurantSectionIcon,
    component: Sections,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  {
    path: '/users',
    name: 'Users',
    icon: UserIcon,
    component: Users,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  // {
  //   path: '/riders',
  //   name: 'Riders',
  //   icon: RiderIcon,
  //   component: Riders,
  //   layout: '/super_admin',
  //   appearInSidebar: true,
  //   admin: true
  // },
  {
    path: '/configuration',
    name: 'Configuration',
    icon: ConfigurationIcon,
    component: Configuration,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  // {
  //   path: '/SpAdmin',
  //   name: 'Search Placeholder A',
  //   icon: ConfigurationIcon,
  //   component: Banners,
  //   layout: '/super_admin',
  //   appearInSidebar: true,
  //   admin: true
  // },

  // {
  //   path: '/coupons',
  //   name: 'Coupons',
  //   icon: CouponsIcon,
  //   component: Coupons,
  //   layout: '/super_admin',
  //   appearInSidebar: true,
  //   admin: true
  // },
  {
    path: '/cuisines',
    name: 'Cuisines',
    icon: CouponsIcon,
    component: Cuisines,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  {
    path: '/banner',
    name: 'Banners',
    icon: CouponsIcon,
    component: Banner,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  {
    path: '/tipping',
    name: 'Tipping',
    icon: TippingsIcon,
    component: Tipping,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  {
    path: '/zones',
    name: 'Zone',
    icon: ZonesIcon,
    component: Zone,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  // {
  //   path: '/dispatch',
  //   name: 'Dispatch',
  //   icon: DeliveryIcon,
  //   component: Dispatch,
  //   layout: '/super_admin',
  //   appearInSidebar: true,
  //   admin: true
  // },
  // {
  //   path: '/notifications',
  //   name: 'Notifications',
  //   icon: NotificationsIcon,
  //   component: Notifications,
  //   layout: '/super_admin',
  //   appearInSidebar: true,
  //   admin: true
  // },
  {
    path: '/commission',
    name: 'Commission Rates',
    icon: CommissionsIcon,
    component: Commission,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: true
  },
  // {
  //   path: '/withdraw/',
  //   name: 'Withdraw Requests',
  //   icon: RequestIcon,
  //   component: WithdrawRequest,
  //   layout: '/super_admin',
  //   appearInSidebar: true,
  //   admin: true
  // },
  {
    path: '/list',
    name: 'List',
    icon: 'ni ni-tv-2 text-primary',
    component: Restaurant,
    layout: '/restaurant',
    appearInSidebar: false,
    admin: false
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: DashboardIcon,
    component: Dashboard,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/profile',
    name: 'Profile',
    icon: UserIcon,
    component: Profile,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/food',
    name: 'Food',
    icon: FoodIcon,
    component: Food,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/category',
    name: 'Category',
    icon: CategoryIcon,
    component: Category,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  // {
  //   path: '/tags',
  //   name: 'Tags',
  //   icon: CategoryIcon,
  //   component: Tags,
  //   layout: '/admin',
  //   appearInSidebar: true,
  //   admin: false
  // },
  {
    path: '/orders',
    name: 'Orders',
    icon: OrderIcon,
    component: Orders,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },

  {
    path: '/option',
    name: 'Option',
    icon: OptionIcon,
    component: Options,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },

  {
    path: '/OfferPage',
    name: 'Offers',
    icon: RatingIcon,
    component: OfferPage,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/SpRestaurant',
    name: 'Quick Search Keywords',
    icon: RatingIcon,
    component: SpRestaurant,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/ratings',
    name: 'Ratings',
    icon: RatingIcon,
    component: Ratings,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/addons',
    name: 'Addons',
    icon: AddonsIcon,
    component: Addons,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/timings',
    name: 'Timings',
    icon: TimingIcon,
    component: Timings,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  // {
  //   path: '/payment',
  //   name: 'Payment',
  //   icon: PaymentIcon,
  //   component: Payment,
  //   layout: '/admin',
  //   appearInSidebar: true,
  //   admin: false
  // },
  {
    path: '/deliverybounds',
    name: 'Location',
    icon: LocationIcon,
    component: DeliveryBoundsAndLocation,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/finance',
    name: 'Finance',
    icon: CommissionsIcon,
    component: Finance,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },
  {
    path: '/accountManager',
    name: 'Account Manager',
    icon: UserIcon,
    component: AccountManager,
    layout: '/admin',
    appearInSidebar: true,
    admin: false
  },

  {
    path: '/login',
    name: 'Login',
    icon: 'ni ni-key-25 text-info',
    component: Login,
    layout: '/auth',
    appearInSidebar: false
  },
  {
    path: '/reset',
    name: 'ResetPassword',
    icon: 'ni ni-key-25 text-info',
    component: ResetPassword,
    layout: '/auth',
    appearInSidebar: false
  },
  // {
  //   path: '/dispatch/:id',
  //   name: 'Dispatch',
  //   icon: DeliveryIcon,
  //   component: DispatchRestaurant,
  //   layout: '/admin',
  //   appearInSidebar: true,
  //   admin: false
  // },
  {
    path: '/vendors',
    name: 'Back to Admin',
    icon: BackIcon,
    component: Vendors,
    layout: '/super_admin',
    appearInSidebar: true,
    admin: false
  }
]
export default routes
