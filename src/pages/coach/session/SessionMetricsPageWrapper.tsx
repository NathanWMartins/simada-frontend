import React from "react";
import { useParams } from "react-router-dom";
import SessionInsightsPage from "./SessionInsightsPage";

const SessionMetricsPageWrapper: React.FC = () => {
    const { sessionId } = useParams<{ sessionId: string }>();
    if (!sessionId) return <div>Session not found</div>;
    return <SessionInsightsPage sessionId={parseInt(sessionId, 10)} />;
};

export default SessionMetricsPageWrapper;