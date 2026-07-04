"use client";

import dynamic from "next/dynamic";

export const CartMount = dynamic(() => import("./CartDrawer").then((module) => module.CartDrawer), {
  ssr: false
});
