"use client";
import { useCallback, useEffect, useRef, } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./ProductGroupRail.module.css";
import OrganicProductShape from "@/components/brands/goly-rozh/OrganicProductShape";
function pickLang(obj, lang) {
    if (!obj)
        return "";
    if (lang === "ar") {
        return obj.ar || obj.en || "";
    }
    if (lang === "ku") {
        return obj.ku || obj.en || "";
    }
    return obj.en || "";
}
function prettySlug(slug = "") {
    return String(slug)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
function titleCase(text = "") {
    return String(text)
        .toLowerCase()
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
export default function ProductGroupRail({ brand, panelSlug, safeLang, isRTL, items, active, sectionRef, railRegistryRef, }) {
   const railRef = useRef(null);

const railOffsetRef = useRef(0);
const railRenderOffsetRef = useRef(0);
const railStartOffsetRef = useRef(0);
const railAnimationRef = useRef(null);

const leftArrowRef = useRef(null);
const rightArrowRef = useRef(null);

const arrowMoveRef = useRef(null);
    const setRailNode = useCallback((node) => {
        const registry = railRegistryRef?.current;
        const previousNode = railRef.current;
        if (!node) {
            if (registry?.get(panelSlug) ===
                previousNode) {
                registry.delete(panelSlug);
            }
            railRef.current = null;
            return;
        }
        railRef.current = node;
        registry?.set(panelSlug, node);
    }, [
        panelSlug,
        railRegistryRef,
    ]);
    useEffect(() => {
        if (!active) {
            return;
        }
        const section = sectionRef?.current;
        const rail = railRef.current;
        if (!section || !rail) {
            return;
        }
        railOffsetRef.current = 0;
        railRenderOffsetRef.current =
            0;
        railStartOffsetRef.current =
            0;
        rail.style.transform =
            "translate3d(0, 0, 0)";
       const largeMonitor = window.matchMedia("(min-width: 1280px) and (min-height: 900px) and (orientation: landscape), (min-width: 1024px) and (max-height: 899px) and (orientation: landscape)");

const touchRail = window.matchMedia(
  "(hover: none) and (pointer: coarse)"
);

let touchDragging = false;
let touchPointerId = null;
let touchStartX = 0;
let touchStartOffset = 0;
let touchMoved = false;

const TOUCH_DRAG_SPEED = 1.65;

function getViewport() {
  return rail.parentElement;
}
        function getStartOffset() {
            const viewport = getViewport();
            if (!viewport ||
                rail.children.length <= 2) {
                return 0;
            }
            const firstCard = rail.children[0];
            const thirdCard = rail.children[Math.min(2, rail.children.length - 1)];
            if (!firstCard ||
                !thirdCard) {
                return 0;
            }
            const groupLeft = firstCard.offsetLeft;
            const groupRight = thirdCard.offsetLeft +
                thirdCard.offsetWidth;
            const groupCenter = (groupLeft + groupRight) /
                2;
            const viewportCenter = viewport.clientWidth / 2;
            const totalMaxOffset = Math.max(0, rail.scrollWidth -
                viewport.clientWidth);
            return Math.max(0, Math.min(totalMaxOffset, groupCenter -
                viewportCenter));
        }
        function getMaxOffset() {
  const viewport = getViewport();

  if (!viewport) {
    return 0;
  }

  if (touchRail.matches) {
    const cards = rail.children;

    if (cards.length <= 2) {
      return 0;
    }

    const lastCard = cards[cards.length - 1];

    if (!lastCard) {
      return 0;
    }

    const contentRight =
      lastCard.offsetLeft + lastCard.offsetWidth;

    const totalMaxOffset = Math.max(
      0,
      contentRight - viewport.clientWidth
    );

    return Math.max(
      0,
      totalMaxOffset - railStartOffsetRef.current
    );
  }

  const totalMaxOffset = Math.max(
    0,
    rail.scrollWidth - viewport.clientWidth
  );

  return Math.max(
    0,
    totalMaxOffset - railStartOffsetRef.current
  );
}
     function updateArrowVisibility() {
  const maxOffset = getMaxOffset();

  const currentOffset =
    railOffsetRef.current;

  const canMoveLeft =
    currentOffset > 1;

  const canMoveRight =
    maxOffset > 1 &&
    currentOffset < maxOffset - 1;


  if (leftArrowRef.current) {
    leftArrowRef.current.disabled =
      !canMoveLeft;

    leftArrowRef.current.classList.toggle(
      styles.railNavArrowVisible,
      canMoveLeft
    );
  }


  if (rightArrowRef.current) {
    rightArrowRef.current.disabled =
      !canMoveRight;

    rightArrowRef.current.classList.toggle(
      styles.railNavArrowVisible,
      canMoveRight
    );
  }
}


function moveRailByArrow(direction) {
  const maxOffset = getMaxOffset();
  if (maxOffset <= 0) {
    updateArrowVisibility();
    return;
  }


  const firstCard =
    rail.children[0];

  if (!firstCard) {
    return;
  }


  /*
   * حرکت دقیقاً به اندازه یک ProductGroup
   */
  const step =
    firstCard.offsetWidth;


  const currentOffset =
    railOffsetRef.current;


  const nextOffset = Math.max(
    0,
    Math.min(
      maxOffset,
      currentOffset +
        direction * step
    )
  );


  if (
    Math.abs(
      nextOffset - currentOffset
    ) < 1
  ) {
    updateArrowVisibility();
    return;
  }


  railOffsetRef.current =
    nextOffset;

  updateArrowVisibility();

  startRailAnimation();
}


arrowMoveRef.current =
  moveRailByArrow; 
  function applyRailTransform(offset) {
            rail.style.transform =
                `translate3d(${-(railStartOffsetRef.current +
                    offset)}px, 0, 0)`;
        }
        function animateRail() {
            const target = railOffsetRef.current;
            const current = railRenderOffsetRef.current;
            const next = current +
                (target - current) *
                    0.075;
            railRenderOffsetRef.current =
                next;
            applyRailTransform(next);
            if (Math.abs(target - next) < 0.2) {
                railRenderOffsetRef.current =
                    target;
                applyRailTransform(target);
                railAnimationRef.current =
                    null;
                return;
            }
            railAnimationRef.current =
                requestAnimationFrame(animateRail);
        }
        function startRailAnimation() {
            if (railAnimationRef.current) {
                return;
            }
            railAnimationRef.current =
                requestAnimationFrame(animateRail);
        }
        function applyPosition() {
            const startOffset = getStartOffset();
            railStartOffsetRef.current =
                startOffset;
            const maxOffset = getMaxOffset();
            const currentOffset = Math.min(railOffsetRef.current, maxOffset);
            railOffsetRef.current =
                currentOffset;
            railRenderOffsetRef.current =
                currentOffset;
            applyRailTransform(currentOffset);
        }
        function handleWheel(event) {
            if (!largeMonitor.matches) {
                return;
            }
            const maxOffset = getMaxOffset();
            if (maxOffset <= 0) {
                return;
            }
            const delta = Math.abs(event.deltaX) >
                Math.abs(event.deltaY)
                ? event.deltaX
                : event.deltaY;
            if (delta === 0) {
                return;
            }
            const currentOffset = railOffsetRef.current;
            const nextOffset = Math.max(0, Math.min(maxOffset, currentOffset +
                delta));
            if (nextOffset ===
                currentOffset) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            railOffsetRef.current =
  nextOffset;

updateArrowVisibility();

startRailAnimation();
}

function handlePointerDown(event) {
  if (
    !touchRail.matches ||
    event.pointerType === "mouse"
  ) {
    return;
  }

  if (getMaxOffset() <= 0) {
    return;
  }

  if (railAnimationRef.current) {
    cancelAnimationFrame(railAnimationRef.current);
    railAnimationRef.current = null;
  }

  touchDragging = true;
  touchMoved = false;
  touchPointerId = event.pointerId;
  touchStartX = event.clientX;
  touchStartOffset = railOffsetRef.current;

  rail.setPointerCapture?.(event.pointerId);
}

function handlePointerMove(event) {
  if (
    !touchDragging ||
    event.pointerId !== touchPointerId ||
    !touchRail.matches
  ) {
    return;
  }

  const dx = event.clientX - touchStartX;

if (Math.abs(dx) < 2) {
  return;
}

  touchMoved = true;

  event.preventDefault();
  event.stopPropagation();

  const maxOffset = getMaxOffset();

 const nextOffset = Math.max(
  0,
  Math.min(
    maxOffset,
    touchStartOffset - dx * TOUCH_DRAG_SPEED
  )
);

  railOffsetRef.current = nextOffset;
railRenderOffsetRef.current = nextOffset;

applyRailTransform(nextOffset);

updateArrowVisibility();
}

function handlePointerEnd(event) {
  if (
    !touchDragging ||
    event.pointerId !== touchPointerId
  ) {
    return;
  }

  touchDragging = false;
  touchPointerId = null;

  if (rail.hasPointerCapture?.(event.pointerId)) {
    rail.releasePointerCapture?.(event.pointerId);
  }
}

function handleClickCapture(event) {
  if (!touchMoved) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();

  touchMoved = false;
}

function handleResize() {
  if (!largeMonitor.matches) {
    railOffsetRef.current = 0;
    railStartOffsetRef.current = 0;

    rail.style.transform =
      "translate3d(0, 0, 0)";

    updateArrowVisibility();

    return;
  }

  applyPosition();

  updateArrowVisibility();
}
updateArrowVisibility();
        window.addEventListener("wheel", handleWheel, {
  passive: false,
  capture: true,
});

rail.addEventListener("pointerdown", handlePointerDown);
rail.addEventListener("pointermove", handlePointerMove, {
  passive: false,
});
rail.addEventListener("pointerup", handlePointerEnd);
rail.addEventListener("pointercancel", handlePointerEnd);
rail.addEventListener("click", handleClickCapture, true);

window.addEventListener("resize", handleResize);

return () => {
            if (railAnimationRef.current) {
  cancelAnimationFrame(railAnimationRef.current);
  railAnimationRef.current =
    null;
}

rail.removeEventListener("pointerdown", handlePointerDown);
rail.removeEventListener("pointermove", handlePointerMove);
rail.removeEventListener("pointerup", handlePointerEnd);
rail.removeEventListener("pointercancel", handlePointerEnd);
rail.removeEventListener("click", handleClickCapture, true);

window.removeEventListener("wheel", handleWheel, true);
window.removeEventListener("resize", handleResize);
        };
    }, [
        active,
        safeLang,
        items,
        panelSlug,
        sectionRef,
    ]);
    return (
  <div
    className={styles.productRailViewport}
    dir="ltr"
  >
   <button
  ref={leftArrowRef}
  type="button"
  className={`${styles.railNavArrow} ${styles.railNavArrowLeft}`}
  aria-label="Scroll product groups left"
  onClick={() => {
    arrowMoveRef.current?.(-1);
  }}
>
  <span
    className={styles.railNavChevron}
    aria-hidden="true"
  />
</button>

<button
  ref={rightArrowRef}
  type="button"
  className={`${styles.railNavArrow} ${styles.railNavArrowRight}`}
  aria-label="Scroll product groups right"
  onClick={() => {
    arrowMoveRef.current?.(1);
  }}
>
  <span
    className={styles.railNavChevron}
    aria-hidden="true"
  />
</button>


    <div
      ref={setRailNode}
      className={styles.grid}
      data-count={items.length}
    >
        {items.map((item, index) => {
            const rawLabel = pickLang(item.title, safeLang) ||
                prettySlug(item.slug);
            const label = safeLang === "en"
                ? titleCase(rawLabel)
                : rawLabel;
            return (<Link key={item._id ||
                    item.slug} href={`/brand/${brand}/products/${panelSlug}/${item.slug}?lang=${safeLang}&page=1`} className={`${styles.card} ${index === 0
                    ? styles.cardLarge
                    : ""}`}>
                <div className={styles.imageWrap}>
                  <OrganicProductShape index={index} seed={panelSlug} className={styles.shapeArt}/>

                  <Image src={item.image ||
                    "/fallback.png"} alt={label} fill sizes="(max-width: 768px) 100vw, 33vw" className={styles.image} loading="eager" draggable={false}/>
                </div>


                <div className={styles.cardContent} dir={isRTL
                    ? "rtl"
                    : "ltr"}>
                  <h3>
                    {safeLang === "en"
                    ? label.replace(/\s+/, "\n")
                    : label}
                  </h3>

                  <span>
                    {safeLang === "ar"
                    ? "عرض المنتجات"
                    : safeLang ===
                        "ku"
                        ? "بینینی بەرهەمەکان"
                        : "View Products"}
                  </span>
                </div>
              </Link>);
        })}
      </div>
    </div>);
}
