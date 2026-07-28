import { toast } from "react-hot-toast";

export const notify = {
  success: (msg: string) => toast.success(msg),

  error: (msg: string) => toast.error(msg),

  warning: (msg: string) =>
    toast(msg, {
      icon: "⚠️",
      className:
        "bg-yellow-50 text-yellow-900 border border-yellow-300",
    }),
};
