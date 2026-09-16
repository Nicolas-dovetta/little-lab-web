import { permanentRedirect } from "next/navigation";

export default function FaqRedirect() {
  permanentRedirect("/about");
}
