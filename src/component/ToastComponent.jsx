import * as Toast from "@radix-ui/react-toast";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export const useToast = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { t } = useTranslation();

  const showToast = (msg) => {
    setMessage(msg);
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => setOpen(false), 2900); // Auto close in 3s
      return () => clearTimeout(timer);
    }
  }, [open]);

  return {
    ToastComponent: (
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          open={open}
          onOpenChange={setOpen}
          className="font-kanit animate-fadeOut fixed top-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                     bg-gray-900 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300"
        >
          <Toast.Title className="font-bold text-lg text-center">
            {t("alert")}
          </Toast.Title>
          <Toast.Description className="mt-1 text-center">
            {message}
          </Toast.Description>
          <Toast.Action asChild altText="Close notification">
            <button
              onClick={() => setOpen(false)}
              className="block mx-auto mt-2 text-sm text-red-400 hover:text-red-300"
            >
              {t("close")}
            </button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="fixed top-0 right-0 p-4 z-50 w-80" />
      </Toast.Provider>
    ),
    showToast,
  };
};
