"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { navLinks, site } from "@/data/site";
import { Logo } from "./Icons";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const toggleRef = useRef(null);
  const menuRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on navigation.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock scrolling + trap focus while the menu is open.
  useEffect(() => {
    if (!open) return;
    window.__lenis?.stop();
    const prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const focusables = () =>
      menuRef.current
        ? [...menuRef.current.querySelectorAll("a[href], button")]
        : [];
    focusables()[0]?.focus();

    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        toggleRef.current?.focus();
      }
      if (e.key === "Tab") {
        const els = [toggleRef.current, ...focusables()].filter(Boolean);
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prevOverflow;
      window.__lenis?.start();
    };
  }, [open, close]);

  const t = reduce ? { duration: 0 } : undefined;

  return (
    <>
      <header className="header">
        <div className="header__pill">
          <button
            ref={toggleRef}
            type="button"
            className="header__menu"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className={`burger ${open ? "is-open" : ""}`} aria-hidden="true">
              <i />
              <i />
            </span>
            <span className="header__menu-label">{open ? "Close" : "Menu"}</span>
          </button>

          <Link href="/" className="header__logo" aria-label={`${site.name} — home`}>
            <Logo />
            <span>{site.name}</span>
          </Link>

          <Link href="/contact" className="header__cta">
            Inquire
          </Link>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="site-menu"
            ref={menuRef}
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            initial={{ clipPath: "circle(0% at 50% 0%)" }}
            animate={{ clipPath: "circle(150% at 50% 0%)" }}
            exit={{ clipPath: "circle(0% at 50% 0%)" }}
            transition={t || { duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
          >
            <nav className="menu__inner" aria-label="Main">
              <ul className="menu__list">
                {navLinks.map((l, i) => (
                  <li key={l.href} className="menu__item">
                    <motion.div
                      initial={reduce ? false : { y: "110%" }}
                      animate={{ y: 0 }}
                      transition={t || { duration: 0.9, delay: 0.2 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <Link href={l.href} className="menu__link" onClick={close}>
                        <span className="menu__num">{String(i + 1).padStart(2, "0")}</span>
                        <span className="menu__text">{l.label}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
              <div className="menu__foot">
                <p>
                  <a href={site.phoneHref}>{site.phone}</a>
                  <br />
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </p>
                <p>{site.hours}</p>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
