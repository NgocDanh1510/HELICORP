"use client";

import dynamic from "next/dynamic";

export const WishlistMount = dynamic(() => import("./WishlistDrawer").then((module) => module.WishlistDrawer), {
  ssr: false
});
