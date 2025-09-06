import { Route, Routes } from 'react-router-dom'
import MainPage from '../pages/MainPage'
import LoginPageCoach from '../pages/coach/auth/LoginPageCoach'
import RegisterPageCoach from '../pages/coach/auth/RegisterPageCoach'
import HomeCoach from '../pages/coach/HomeCoach'
import LoginPageAthlete from '../pages/athlete/auth/LoginPageAthlete'
import SessionsCoach from '../pages/coach/session/SessionsCoach'
import MyAthletes from '../pages/coach/athlete/MyAthletes'
import NewSession from '../pages/coach/session/NewSession'
import EditAthlete from '../pages/coach/athlete/EditAthlete'
import InviteSignup from '../pages/athlete/auth/InviteSignup'
import PsychoFormPage from '../pages/athlete/PsychoFormPage'
import PsychoAnswers from '../pages/coach/psychoEmocional/PsychoAnswers'

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainPage />} />

            {/*Coach Routes*/}
            <Route path="/coach-login" element={<LoginPageCoach />} />
            <Route path="/coach-register" element={<RegisterPageCoach />} />
            <Route path="/coach-home" element={<HomeCoach />} />
            <Route path="/coach-sessions" element={<SessionsCoach />} />
            <Route path="/coach-new-session" element={<NewSession />} />
            <Route path="/coach-athletes" element={<MyAthletes />} />
            <Route path="/athletes/:id/edit" element={<EditAthlete />} />
            <Route path="/coach/psy-form/${s.id}/answers" element={<PsychoAnswers />} />

            {/*Athlete Routes*/}
            <Route path="/athlete-login" element={<LoginPageAthlete />} />
            <Route path="/signup" element={<InviteSignup />} />
            <Route path="/psycho-form/:token" element={<PsychoFormPage />} />

        </Routes>
    )
}

export default AppRoutes
