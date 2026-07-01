import Image from "next/image";
import { TI_IMAGES } from "./images";

export default function PhotoBreak() {
  return (
    <figure className="ti-photo-break">
      <Image
        src={TI_IMAGES.volunteerComfortingDog.src}
        alt={TI_IMAGES.volunteerComfortingDog.alt}
        fill
        sizes="100vw"
        className="ti-photo-break__img"
        priority={false}
      />
      <div className="ti-photo-break__veil" aria-hidden />
    </figure>
  );
}
