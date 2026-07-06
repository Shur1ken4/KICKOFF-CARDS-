import { Routes, Route, Navigate } from "react-router-dom";
import Onboarding from "./pages/Onboarding.jsx";
import League from "./pages/League.jsx";
import Match from "./pages/Match.jsx";
import Collection from "./pages/Collection.jsx";
import Live from "./pages/Live.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Onboarding />} />
      <Route path="/live" element={<Live />} />
      <Route path="/league/:id" element={<League />} />
      <Route path="/match/:matchId" element={<Match />} />
      <Route path="/collection" element={<Collection />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
