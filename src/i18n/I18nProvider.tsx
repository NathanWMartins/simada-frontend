import React, { createContext, useContext, useMemo, useEffect, useState } from "react";
import { mainTranslations } from "./translations/MainTranslations";
import { registerTranslations } from "./translations/RegisterTranslation";
import { supportPrivacyDialogTranslations } from "./translations/SupportPrivacyDialogTranslation";
import { loginTranslations } from "./translations/LoginTranslation";
import { headerTranslations } from "./translations/HeadersTranslation";

export type Lang = "pt" | "en";

const MESSAGES = {
    en: {
       ...mainTranslations.en,
       ...registerTranslations.en,
       ...supportPrivacyDialogTranslations.en,
       ...loginTranslations.en,
       ...headerTranslations.en,
    },
    pt: {
        ...mainTranslations.pt,
        ...registerTranslations.pt,
        ...supportPrivacyDialogTranslations.pt,
        ...loginTranslations.pt,
        ...headerTranslations.pt,
    },
} as const;

type I18nCtx = {
    lang: Lang;
    setLang: (l: Lang) => void;
    t: (key: keyof typeof MESSAGES["en"]) => string;
};

const I18nContext = createContext<I18nCtx | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [lang, setLang] = useState<Lang>(() => (localStorage.getItem("lang") as Lang) || "en");

    useEffect(() => {
        localStorage.setItem("lang", lang);
    }, [lang]);

    const t = useMemo(() => {
        const dict = MESSAGES[lang];
        return (key: keyof typeof MESSAGES["en"]) => dict[key] ?? key;
    }, [lang]);

    return <I18nContext.Provider value={{ lang, setLang, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
    const ctx = useContext(I18nContext);
    if (!ctx) throw new Error("useI18n must be used within I18nProvider");
    return ctx;
};
