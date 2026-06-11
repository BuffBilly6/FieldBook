import React from "react";
import { X } from "lucide-react";
import { S } from "../styles";

/* Reusable bottom sheet. */
export default function Sheet({ title, onClose, children, footer }) {
  return (
    <div style={S.sheetBg} onClick={onClose}>
      <div style={S.sheet} onClick={(e) => e.stopPropagation()} className="fb-sheet">
        <div style={S.sheetGrab} />
        <div style={S.sheetHead}>
          <h2 style={S.sheetTitle}>{title}</h2>
          <button style={S.sheetClose} onClick={onClose}><X size={20} /></button>
        </div>
        <div style={S.formScroll}>{children}</div>
        {footer}
      </div>
    </div>
  );
}
