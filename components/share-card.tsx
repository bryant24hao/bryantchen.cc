"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { generateShareCard, type ShareCardData } from "@/lib/share-canvas";

interface ShareCardProps extends ShareCardData {
  onClose: () => void;
}

export function ShareCard(props: ShareCardProps) {
  const { onClose, type, content, title, description, date, url } = props;
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const scrollYRef = useRef(0);

  // Generate the card image
  useEffect(() => {
    try {
      const src = generateShareCard({ type, content, title, description, date, url });
      setImageSrc(src);
    } catch {
      // Canvas generation failed silently
    }
  }, [type, content, title, description, date, url]);

  // Check Web Share API support
  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.canShare) {
      // Test with a dummy file to see if file sharing is supported
      try {
        const testBlob = new Blob(["test"], { type: "image/png" });
        const testFile = new File([testBlob], "test.png", { type: "image/png" });
        setCanShare(navigator.canShare({ files: [testFile] }));
      } catch {
        setCanShare(false);
      }
    }
  }, []);

  // Scroll lock
  useEffect(() => {
    scrollYRef.current = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollYRef.current}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    };
  }, []);

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus dialog on mount
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  const handleShare = useCallback(async () => {
    if (!imageSrc) return;
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const file = new File([blob], "share.png", { type: "image/png" });
      await navigator.share({ files: [file] });
    } catch {
      // User cancelled or share failed
    }
  }, [imageSrc]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        overscrollBehavior: "contain",
      }}
    >
      {/* Close button */}
      <button
        aria-label="Close"
        onClick={onClose}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          width: 40,
          height: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "none",
          border: "none",
          color: "#ffffff",
          fontSize: 24,
          cursor: "pointer",
          zIndex: 10000,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Hint text */}
      <p
        style={{
          color: "rgba(255, 255, 255, 0.8)",
          fontSize: 14,
          marginBottom: 16,
          userSelect: "none",
        }}
      >
        长按图片保存
      </p>

      {/* Card image — intentionally using <img> for mobile long-press save support */}
      {imageSrc && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageSrc}
          alt="Share card"
          style={{
            width: "calc(100vw - 48px)",
            maxWidth: 360,
            maxHeight: "70vh",
            objectFit: "contain",
            borderRadius: 12,
            boxShadow: "0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            imageRendering: "crisp-edges",
          }}
        />
      )}

      {/* Web Share API button (progressive enhancement) */}
      {canShare && imageSrc && (
        <button
          onClick={handleShare}
          style={{
            marginTop: 16,
            padding: "10px 24px",
            background: "#ffffff",
            color: "#1a1a1a",
            border: "none",
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          分享
        </button>
      )}
    </div>
  );
}
