import { useState } from 'react'
import './App.css'
import RandomQuoteGenerator from './pages/Random Quote Generator'
import DarkLightModeToggle from './pages/Dark Light Mode Toggle'
import Rough from './pages/Rough.tsx'
import HabitTrackerApp from './pages/new year special/Habit Tracker Web App.tsx'
import Portfolio from './pages/new year special/Portfoilo.tsx'
import NotesApp from './pages/new year special/Notes App.tsx'
import SkeletonLoaderForAPIData from './pages/Skeleton Loader for API Data .tsx'
import ProtectedRoutewithAuthState from './pages/Protected Route with Auth State.tsx'
import ToastNotificationSystem from './pages/Toast Notification System.tsx'
import ClientSidePaginationComponent from './pages/Client-Side Pagination Component.tsx'
import SearchFilterComponent from './pages/Search Filter Component.tsx'
import MultiStepForm from './pages/Multi-Step Form (Stepper).tsx'
import ReusableCardComponents from './pages/Reusable Card Component.tsx'
import RoleBasedUI from './pages/Role-Based UI Rendering.tsx'
import ResponsiveNavbarwithMobileMenu from './pages/Responsive Navbar with Mobile Menu.tsx'
import ReusableButtonComponentSystem from './pages/Reusable Button Component System.tsx'
import ResponsivePricingUi from "./pages/Responsive Pricing Cards UI.tsx"
import GlassmorphismCardHoverGallery from './pages/Glassmorphism Card Hover Gallery.tsx'
import QRCodeGenerator from './pages/QR Code Generator.tsx'
import AnimatedToastNotificationSystem from './pages/Animated Toast Notification System.tsx'
import DraggableKanbanBoard from './pages/Draggable Kanban Board.tsx'
import LiveMarkDownPreviewer from './pages/Live Markdown Previewer.tsx'
import StarRatingComponent from './pages/Star Rating Component.tsx'
import AccordionCollapsibleFAQ from './pages/Accordion Collapsible FAQ.tsx'
import Sidebar  from './pages/Sidebar.tsx'
import ProductGrid from './pages/Product Grid.tsx'
import MultiStepForm2 from './pages/Multi-Step Form.tsx'
import AnalyticsDashboard from './pages/Analytics Dashboard.tsx'
import DynamicTable from './pages/Dynamic Table.tsx'
import LightboxGallery from './pages/Lightbox Gallery.tsx'
import ExpenseTracker from './pages/Expense Tracker.tsx'
import FormValidator from './pages/Form Validator.tsx'
import PomodoroTimer from './pages/Pomodoro Timer.tsx'
import I18nSwitcher from './pages/i18n Switcher.tsx'
import CheckoutForm from './pages/Checkout Form.tsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <CheckoutForm />
        {/* <I18nSwitcher /> */}
        {/* <PomodoroTimer /> */}
        {/* <FormValidator /> */}
        {/* <ExpenseTracker /> */}
        {/* <LightboxGallery /> */}
        {/* <DynamicTable /> */}
        {/* <AnalyticsDashboard /> */}
        {/* <MultiStepForm2 /> */}
        {/* <ProductGrid /> */}
        {/* <Sidebar/> */}
        {/* <AccordionCollapsibleFAQ/> */}
        {/* <StarRatingComponent /> */}
        {/* <LiveMarkDownPreviewer/> */}
        {/* <DraggableKanbanBoard/> */}
        {/* <AnimatedToastNotificationSystem /> */}
        {/* <QRCodeGenerator/> */}
        {/* <GlassmorphismCardHoverGallery/> */}
        {/* <ResponsivePricingUi /> */}
        {/* <AnimationProgress /> */}
        {/* <ReusableButtonComponentSystem /> */}
        {/* <ResponsiveNavbarwithMobileMenu /> */}
        {/* <RoleBasedUI/> */}
        {/* <ReusableCardComponents /> */}
        {/* <MultiStepForm /> */}
        {/* <SearchFilterComponent /> */}
        {/* <ClientSidePaginationComponent /> */}
        {/* <ToastNotificationSystem /> */}
        {/* <ProtectedRoutewithAuthState/> */}
        {/* <SkeletonLoaderForAPIData/> */}
        {/* <NotesApp /> */}
        {/* <Portfolio /> */}
        {/* <HabitTrackerApp /> */}
        {/* <Rough /> */}
        {/* <DarkLightModeToggle/> */}
        {/* <RandomQuoteGenerator /> */}
      </div>
    </>
  )
}

export default App
