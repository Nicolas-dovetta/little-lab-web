import { redirect } from "next/navigation";

/** Merch lives on Engineerdadcoffee — keep URL for old links. */
export default function MerchRedirect() {
  redirect("https://www.etsy.com/shop/Engineerdadcoffee");
}
