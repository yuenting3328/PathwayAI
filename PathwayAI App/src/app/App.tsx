import { BrowserRouter, Routes, Route } from 'react-router';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import LoginScreen from './screens/LoginScreen';
import HomeDashboardScreen from './screens/HomeDashboardScreen';
import OutcomesDashboardScreen from './screens/OutcomesDashboardScreen';
import JobsDiscoveryScreen from './screens/JobsDiscoveryScreen';
import JobDetailScreen from './screens/JobDetailScreen';
import CareerCoachScreen from './screens/CareerCoachScreen';
import ProfileAndCvScreen from './screens/ProfileAndCvScreen';
import ProfileDetailsScreen from './screens/ProfileDetailsScreen';
import BasicInfoScreen from './screens/profile/BasicInfoScreen';
import EducationScreen from './screens/profile/EducationScreen';
import ExperienceAndProjectsScreen from './screens/profile/ExperienceAndProjectsScreen';
import SkillsAndInterestsScreen from './screens/profile/SkillsAndInterestsScreen';
import PersonalityAndGoalsScreen from './screens/profile/PersonalityAndGoalsScreen';
import CvAndVisibilityScreen from './screens/profile/CvAndVisibilityScreen';
import CvEditorScreen from './screens/CvEditorScreen';
import AnalyticsScreen from './screens/AnalyticsScreen';
import SkillsNavigatorScreen from './screens/SkillsNavigatorScreen';
import SkillDetailScreen from './screens/SkillDetailScreen';
import PlanTimelineScreen from './screens/PlanTimelineScreen';
import MarketRadarScreen from './screens/MarketRadarScreen';
import MarketSignalDetailScreen from './screens/MarketSignalDetailScreen';
import ProgrammesScreen from './screens/ProgrammesScreen';
import AlumniPathsScreen from './screens/AlumniPathsScreen';
import CredentialsWalletScreen from './screens/CredentialsWalletScreen';
import ApplicationsScreen from './screens/ApplicationsScreen';
import InterviewsScreen from './screens/InterviewsScreen';
import InterviewSessionSetupScreen from './screens/InterviewSessionSetupScreen';
import InterviewPracticeScreen from './screens/InterviewPracticeScreen';
import InterviewSummaryScreen from './screens/InterviewSummaryScreen';
import NotificationsScreen from './screens/NotificationsScreen';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <HomeDashboardScreen />
                </Layout>
              }
            />
            <Route
              path="/outcomes"
              element={
                <Layout>
                  <OutcomesDashboardScreen />
                </Layout>
              }
            />
            <Route
              path="/jobs"
              element={
                <Layout>
                  <JobsDiscoveryScreen />
                </Layout>
              }
            />
            <Route
              path="/jobs/:jobId"
              element={
                <Layout>
                  <JobDetailScreen />
                </Layout>
              }
            />
            <Route
              path="/coach"
              element={
                <Layout>
                  <CareerCoachScreen />
                </Layout>
              }
            />
            <Route
              path="/profile"
              element={
                <Layout>
                  <ProfileAndCvScreen />
                </Layout>
              }
            />
            <Route
              path="/profile/details"
              element={
                <Layout>
                  <ProfileDetailsScreen />
                </Layout>
              }
            />
            <Route
              path="/profile/basic-info"
              element={
                <Layout>
                  <BasicInfoScreen />
                </Layout>
              }
            />
            <Route
              path="/profile/education"
              element={
                <Layout>
                  <EducationScreen />
                </Layout>
              }
            />
            <Route
              path="/profile/experience"
              element={
                <Layout>
                  <ExperienceAndProjectsScreen />
                </Layout>
              }
            />
            <Route
              path="/profile/skills-interests"
              element={
                <Layout>
                  <SkillsAndInterestsScreen />
                </Layout>
              }
            />
            <Route
              path="/profile/personality-goals"
              element={
                <Layout>
                  <PersonalityAndGoalsScreen />
                </Layout>
              }
            />
            <Route
              path="/profile/cv-visibility"
              element={
                <Layout>
                  <CvAndVisibilityScreen />
                </Layout>
              }
            />
            <Route
              path="/cv-editor"
              element={
                <Layout>
                  <CvEditorScreen />
                </Layout>
              }
            />
            <Route
              path="/analytics"
              element={
                <Layout>
                  <AnalyticsScreen />
                </Layout>
              }
            />
            <Route
              path="/skills"
              element={
                <Layout>
                  <SkillsNavigatorScreen />
                </Layout>
              }
            />
            <Route
              path="/skills/:skillId"
              element={
                <Layout>
                  <SkillDetailScreen />
                </Layout>
              }
            />
            <Route
              path="/plan-timeline"
              element={
                <Layout>
                  <PlanTimelineScreen />
                </Layout>
              }
            />
            <Route
              path="/market-radar"
              element={
                <Layout>
                  <MarketRadarScreen />
                </Layout>
              }
            />
            <Route
              path="/market-radar/signal/:signalId"
              element={
                <Layout>
                  <MarketSignalDetailScreen />
                </Layout>
              }
            />
            <Route
              path="/programmes"
              element={
                <Layout>
                  <ProgrammesScreen />
                </Layout>
              }
            />
            <Route
              path="/alumni-paths"
              element={
                <Layout>
                  <AlumniPathsScreen />
                </Layout>
              }
            />
            <Route
              path="/credentials"
              element={
                <Layout>
                  <CredentialsWalletScreen />
                </Layout>
              }
            />
            <Route
              path="/applications"
              element={
                <Layout>
                  <ApplicationsScreen />
                </Layout>
              }
            />
            <Route
              path="/interviews"
              element={
                <Layout>
                  <InterviewsScreen />
                </Layout>
              }
            />
            <Route
              path="/interview/setup"
              element={
                <Layout>
                  <InterviewSessionSetupScreen />
                </Layout>
              }
            />
            <Route
              path="/interview/practice"
              element={
                <Layout>
                  <InterviewPracticeScreen />
                </Layout>
              }
            />
            <Route
              path="/interview/summary"
              element={
                <Layout>
                  <InterviewSummaryScreen />
                </Layout>
              }
            />
            <Route
              path="/notifications"
              element={
                <Layout>
                  <NotificationsScreen />
                </Layout>
              }
            />
    </Routes>
  );
}

export default function App() {
  return (
    <div className="dark h-screen w-full max-w-[393px] mx-auto overflow-hidden flex flex-col">
      <AuthProvider>
        <LanguageProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LanguageProvider>
      </AuthProvider>
    </div>
  );
}