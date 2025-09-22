import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../contexts/UserContext";

type Props = { redirectTo: string };

export default function RequireAuth({ redirectTo }: Props) {
    const { token, user } = useUserContext();
    const location = useLocation();

    const isAuthenticated = Boolean(token || user);

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace state={{ from: location }} />;
    }
    return <Outlet />;
}
