// screens.jsx — the 8 iOS screens for the Core flow row.
//
// Each screen returns the inner content of an iPhone frame (status bar
// included as a small block). The host wraps it in IOSDevice via the
// design canvas.

const { useState } = React;

// ─── shared chrome ──────────────────────────────────────────

function IPhoneShell({ children, dark = false, time = '9:41' }) {
  const fg = dark ? '#fff' : '#1a1a1a';
  return (
    <div style={{
      width: '100%', height: '100%',
      background: dark ? '#0a0a0a' : CW.bg,
      color: fg, position: 'relative', overflow: 'hidden',
      fontFamily: CW.sans,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* status bar */}
      <div style={{
        flex: '0 0 auto', height: 47, padding: '0 26px', display: 'flex',
        alignItems: 'flex-end', justifyContent: 'space-between',
        fontSize: 15, fontWeight: 600, paddingBottom: 12,
      }}>
        <span style={{ minWidth: 60 }}>{time}</span>
        {/* dynamic island */}
        <div style={{
          position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)',
          width: 110, height: 34, borderRadius: 999, background: '#000',
        }} />
        <span style={{ display: 'flex', gap: 5, alignItems: 'center', minWidth: 60, justifyContent: 'flex-end' }}>
          <svg width="16" height="11"><path d="M1 8h2v2H1zM5 6h2v4H5zM9 4h2v6H9zM13 1h2v9h-2z" fill={fg}/></svg>
          <svg width="22" height="11"><rect x="0.5" y="0.5" width="18" height="10" rx="2.5" stroke={fg} fill="none" opacity="0.45"/><rect x="2" y="2" width="15" height="7" rx="1.5" fill={fg}/></svg>
        </span>
      </div>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>{children}</div>
      {/* home indicator */}
      <div style={{
        flex: '0 0 auto', height: 26, display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: 8,
      }}>
        <div style={{
          width: 134, height: 5, borderRadius: 999,
          background: dark ? 'rgba(255,255,255,0.85)' : '#1a1a1a',
        }} />
      </div>
    </div>
  );
}

function NavChip({ children, dark, style }) {
  return (
    <div style={{
      height: 36, minWidth: 36, padding: '0 12px', borderRadius: 999,
      background: dark ? 'rgba(40,40,40,0.6)' : 'rgba(255,255,255,0.62)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      boxShadow: dark
        ? '0 1px 2px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.12)'
        : '0 1px 2px rgba(0,0,0,0.05), inset 0 0 0 0.5px rgba(0,0,0,0.05)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      fontSize: 14, fontWeight: 500, color: dark ? '#fff' : '#1a1a1a',
      ...style,
    }}>{children}</div>
  );
}

// ─── 1. UPLOAD / LAUNCH ─────────────────────────────────────

function UploadScreen() {
  const [mode, setMode] = useState('single');
  return (
    <IPhoneShell>
      {/* top nav */}
      <div style={{ position: 'absolute', top: 8, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
        <NavChip>▦</NavChip>
        <NavChip>⚙</NavChip>
      </div>

      {/* hero */}
      <div style={{ position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', padding: '0 28px' }}>
        <div style={{
          fontFamily: CW.display, fontStyle: 'italic', fontSize: 38, lineHeight: 1.05,
          color: CW.ink, fontWeight: 500,
        }}>Turn a photo<br/>into a color</div>
        <div style={{ marginTop: 10, fontSize: 13, color: CW.secondary, letterSpacing: '0.02em' }}>
          A photo, a color, a day.
        </div>
      </div>

      {/* CTA */}
      <div style={{ position: 'absolute', top: 220, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          padding: '14px 32px', background: '#1a1a1a', color: '#fafaf7',
          borderRadius: 999, fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
        }}>
          <span style={{ fontSize: 16 }}>＋</span> Choose a photo
        </div>
      </div>

      {/* mode tabs */}
      <div style={{ position: 'absolute', top: 290, left: 16, right: 16, display: 'flex', gap: 6, justifyContent: 'center' }}>
        {MODES.map(m => (
          <div key={m.id} onClick={() => setMode(m.id)} style={{
            flex: 1, padding: '8px 0', borderRadius: 10, textAlign: 'center',
            fontSize: 12, fontWeight: 600,
            background: mode === m.id ? '#1a1a1a' : 'transparent',
            color: mode === m.id ? '#fafaf7' : CW.inkSoft,
            border: mode === m.id ? 'none' : `1px solid ${CW.hairline}`,
          }}>{m.icon} {m.label}</div>
        ))}
      </div>

      {/* recent grid */}
      <div style={{ position: 'absolute', top: 340, left: 16, right: 16, bottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <span style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 18 }}>Recent</span>
          <span style={{ fontSize: 11, color: CW.secondary, letterSpacing: '0.04em' }}>SEE ALL</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {RECENT_GRID.slice(0, 12).map((p, i) => (
            <div key={i} style={{
              aspectRatio: '1/1', borderRadius: 4, overflow: 'hidden', position: 'relative',
            }}>
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{
                position: 'absolute', bottom: 4, left: 4, width: 8, height: 8, borderRadius: 2,
                background: p.dominant, boxShadow: '0 0 0 1.5px rgba(255,255,255,0.85)',
              }} />
            </div>
          ))}
        </div>
      </div>
    </IPhoneShell>
  );
}

// ─── 2. EDITOR ────────────────────────────────────────────────

function EditorScreen({ photo = PHOTOS[0], color, font, caption, variant = 'classic', activeTool = 'layout' }) {
  color = color || photo.palette[0];
  font = font || FONTS[1];
  caption = caption || 'tulip season';
  return (
    <IPhoneShell>
      {/* nav pill */}
      <div style={{
        position: 'absolute', top: 4, left: 0, right: 0, display: 'flex',
        justifyContent: 'space-between', padding: '0 14px', zIndex: 5,
      }}>
        <NavChip><span style={{ fontSize: 16 }}>‹</span></NavChip>
        <NavChip><span style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 15 }}>Color Walk</span></NavChip>
        <NavChip><span style={{ fontWeight: 600 }}>Export</span></NavChip>
      </div>

      {/* preview 3:4 */}
      <div style={{
        position: 'absolute', top: 60, left: 28, right: 28, bottom: 130,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          aspectRatio: '3/4', maxWidth: '100%', maxHeight: '100%',
          boxShadow: '0 12px 36px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)',
          borderRadius: 6, overflow: 'hidden',
        }}>
          <CWCard variant={variant} photo={photo} color={color} font={font} caption={caption} split={0.5}
                  size={{ w: 252, h: 336 }} />
        </div>
      </div>

      {/* tool shelf */}
      <div style={{
        position: 'absolute', bottom: 38, left: 14, right: 14,
        background: 'rgba(255,255,255,0.78)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderRadius: 22, padding: '12px 6px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08), inset 0 0 0 0.5px rgba(0,0,0,0.05)',
        display: 'flex', justifyContent: 'space-around',
      }}>
        {EDITOR_TOOLS.map(t => (
          <div key={t.id} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 10,
            background: activeTool === t.id ? CW.ink : 'transparent',
            color: activeTool === t.id ? CW.bg : CW.ink,
            minWidth: 44,
          }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>{t.glyph}</span>
            <span style={{ fontSize: 10, fontWeight: 500 }}>{t.label}</span>
          </div>
        ))}
      </div>
    </IPhoneShell>
  );
}

// ─── 3. COLOR SHEET ────────────────────────────────────────

function ColorSheetScreen({ photo = PHOTOS[2] }) {
  return (
    <IPhoneShell>
      {/* dimmed editor behind */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <EditorScreenInner photo={photo} variant="classic" caption="dusk in joshua tree" />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />

      {/* sheet */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 360,
        background: CW.bg, borderRadius: '24px 24px 0 0',
        padding: '12px 18px 28px',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.18)',
      }}>
        <div style={{ width: 38, height: 4, background: '#d8d4cb', borderRadius: 2, margin: '4px auto 14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 22 }}>Color</span>
          <span style={{ fontSize: 12, color: CW.secondary }}>From your photo</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8, marginBottom: 22 }}>
          {photo.palette.map((c, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{
                aspectRatio: '1/1', background: c, borderRadius: 8,
                border: i === 0 ? `2px solid ${CW.ink}` : '1px solid rgba(0,0,0,0.06)',
                boxShadow: i === 0 ? '0 2px 8px rgba(0,0,0,0.12)' : 'none',
              }} />
              <div style={{ fontSize: 9, fontFamily: CW.mono, color: CW.inkSoft, textAlign: 'center' }}>
                {c.toUpperCase().slice(1)}
              </div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 12, fontWeight: 600, color: CW.inkSoft, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          Mood palettes
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {MOOD_PALETTES.slice(0, 4).map(p => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '6px 10px', background: '#fff', borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.04)',
            }}>
              <div style={{ display: 'flex', gap: 0, borderRadius: 4, overflow: 'hidden' }}>
                {p.colors.map((c, i) => (
                  <div key={i} style={{ width: 26, height: 22, background: c }} />
                ))}
              </div>
              <span style={{ fontSize: 13, fontFamily: CW.display, fontStyle: 'italic' }}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </IPhoneShell>
  );
}

// helper — bare editor body without shell, used as backdrop in sheets
function EditorScreenInner({ photo, color, variant, caption }) {
  color = color || photo.palette[0];
  return (
    <div style={{ position: 'absolute', inset: 0, background: CW.bg }}>
      <div style={{ position: 'absolute', top: 60, left: 28, right: 28, bottom: 130 }}>
        <div style={{
          aspectRatio: '3/4', maxWidth: '100%', maxHeight: '100%',
          margin: '0 auto', borderRadius: 6, overflow: 'hidden',
        }}>
          <CWCard variant={variant} photo={photo} color={color} font={FONTS[1]} caption={caption} split={0.5}
                  size={{ w: 252, h: 336 }} />
        </div>
      </div>
    </div>
  );
}

// ─── 4. FONT SHEET ─────────────────────────────────────────

function FontSheetScreen({ photo = PHOTOS[1] }) {
  return (
    <IPhoneShell>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <EditorScreenInner photo={photo} variant="classic" caption="willow days" />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 420,
        background: CW.bg, borderRadius: '24px 24px 0 0', padding: '12px 14px 28px',
      }}>
        <div style={{ width: 38, height: 4, background: '#d8d4cb', borderRadius: 2, margin: '4px auto 14px' }} />
        <div style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 22, marginBottom: 14, paddingLeft: 4 }}>Font</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, overflowY: 'hidden' }}>
          {FONTS.slice(0, 7).map((f, i) => (
            <div key={f.id} style={{
              padding: '11px 14px', background: i === 1 ? '#fff' : 'transparent',
              borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              border: i === 1 ? `1px solid ${CW.hairline}` : '1px solid transparent',
            }}>
              <div style={{
                fontFamily: f.cssFamily, fontWeight: f.weight,
                fontStyle: f.italic ? 'italic' : 'normal',
                fontSize: 18, color: CW.ink,
              }}>{f.sample}</div>
              <div style={{ fontSize: 10, color: CW.secondary, fontFamily: CW.mono, textAlign: 'right' }}>{f.name}</div>
            </div>
          ))}
        </div>
      </div>
    </IPhoneShell>
  );
}

// ─── 5. LAYOUT SHEET ───────────────────────────────────────

function LayoutSheetScreen({ photo = PHOTOS[0] }) {
  return (
    <IPhoneShell>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <EditorScreenInner photo={photo} variant="classic" caption="tulip season" />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 280,
        background: CW.bg, borderRadius: '24px 24px 0 0', padding: '12px 0 28px',
      }}>
        <div style={{ width: 38, height: 4, background: '#d8d4cb', borderRadius: 2, margin: '4px auto 14px' }} />
        <div style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 22, padding: '0 18px', marginBottom: 14 }}>Layout</div>

        <div style={{
          display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 18px 8px',
        }}>
          {LAYOUTS.map((l, i) => (
            <div key={l.id} style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'center' }}>
              <div style={{
                width: 96, height: 128, borderRadius: 6, overflow: 'hidden',
                border: i === 0 ? `2px solid ${CW.ink}` : '1px solid rgba(0,0,0,0.08)',
                boxShadow: i === 0 ? '0 4px 12px rgba(0,0,0,0.12)' : 'none',
              }}>
                <CWCard variant={l.id} photo={photo} color={photo.palette[0]} font={FONTS[1]}
                        caption="·" split={0.5} size={{ w: 96, h: 128 }} />
              </div>
              <div style={{ fontSize: 10, color: CW.inkSoft }}>{l.name}</div>
            </div>
          ))}
        </div>
      </div>
    </IPhoneShell>
  );
}

// ─── 6. TEXT EDIT ──────────────────────────────────────────

function TextEditScreen({ photo = PHOTOS[2] }) {
  const chips = EXIF_CHIPS(photo);
  return (
    <IPhoneShell>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.4 }}>
        <EditorScreenInner photo={photo} variant="classic" caption="a long sunset" />
      </div>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />

      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 340,
        background: CW.bg, borderRadius: '24px 24px 0 0', padding: '12px 18px 28px',
      }}>
        <div style={{ width: 38, height: 4, background: '#d8d4cb', borderRadius: 2, margin: '4px auto 14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
          <span style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 22 }}>Text</span>
          <span style={{ fontSize: 12, color: CW.secondary }}>3 / 80</span>
        </div>

        <div style={{
          padding: '14px 14px', background: '#fff', borderRadius: 12,
          border: `1px solid ${CW.hairline}`,
          fontFamily: CW.display, fontStyle: 'italic', fontSize: 22, color: CW.ink,
          minHeight: 80,
        }}>
          a long sunset<span style={{
            display: 'inline-block', width: 2, height: 22, background: CW.ink,
            marginLeft: 2, verticalAlign: 'text-bottom', animation: 'blink 1s infinite',
          }} />
        </div>

        <div style={{ marginTop: 14, fontSize: 11, color: CW.inkSoft, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 8 }}>
          Suggested · from photo
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {chips.map((c, i) => (
            <div key={i} style={{
              padding: '6px 10px', background: i === 1 ? CW.hint : '#fff',
              borderRadius: 999, fontSize: 12, color: CW.ink,
              border: i === 1 ? '1px solid rgba(0,0,0,0.06)' : `1px solid ${CW.hairline}`,
              display: 'inline-flex', gap: 5, alignItems: 'center',
            }}>{c.label}</div>
          ))}
        </div>
      </div>
    </IPhoneShell>
  );
}

// ─── 7. EXPORT ─────────────────────────────────────────────

function ExportScreen({ photo = PHOTOS[2] }) {
  return (
    <IPhoneShell dark>
      <div style={{ position: 'absolute', top: 6, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 14px', zIndex: 5 }}>
        <NavChip dark><span style={{ fontSize: 16 }}>×</span></NavChip>
        <NavChip dark><span style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 15 }}>Share</span></NavChip>
        <NavChip dark><span>⤓</span></NavChip>
      </div>

      <div style={{ position: 'absolute', top: 56, left: 36, right: 36, height: 220, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          aspectRatio: '3/4', maxHeight: '100%',
          boxShadow: '0 18px 60px rgba(0,0,0,0.5)', borderRadius: 6, overflow: 'hidden',
        }}>
          <CWCard variant="classic" photo={photo} color={photo.palette[0]} font={FONTS[1]}
                  caption="a photo, a color, a day" split={0.5} size={{ w: 165, h: 220 }} />
        </div>
      </div>

      <div style={{ position: 'absolute', top: 290, left: 16, right: 16, display: 'flex', gap: 6, justifyContent: 'center' }}>
        {EXPORT_FORMATS.map((f, i) => (
          <div key={f.id} style={{
            padding: '7px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600,
            background: i === 0 ? '#fafaf7' : 'transparent',
            color: i === 0 ? '#0a0a0a' : 'rgba(255,255,255,0.78)',
            border: i === 0 ? 'none' : '1px solid rgba(255,255,255,0.18)',
          }}>{f.label}</div>
        ))}
      </div>

      <div style={{ position: 'absolute', top: 340, left: 18, right: 18, bottom: 70 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
          Share to
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {SHARE_TARGETS.map(t => (
            <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 50, height: 50, borderRadius: 14, background: t.bg,
                color: t.fg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700,
                border: t.border ? '1px solid rgba(255,255,255,0.14)' : 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              }}>{t.label.slice(0, 2)}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.78)' }}>{t.label}</div>
            </div>
          ))}
        </div>
      </div>
    </IPhoneShell>
  );
}

// ─── 8. GALLERY ────────────────────────────────────────────

function GalleryScreen() {
  // 2-col masonry of sample cards in a mix of layouts
  const items = [
    { photo: PHOTOS[0], variant: 'classic',  h: 220, caption: 'tulip season' },
    { photo: PHOTOS[2], variant: 'gradient', h: 260, caption: 'a long sunset' },
    { photo: PHOTOS[1], variant: 'magazine', h: 200, caption: '柳色' },
    { photo: PHOTOS[3], variant: 'polaroid', h: 270, caption: 'slow morning' },
    { photo: PHOTOS[4], variant: 'window',   h: 200, caption: 'big sur' },
    { photo: PHOTOS[5], variant: 'palette',  h: 240, caption: '哲学の道' },
    { photo: PHOTOS[2], variant: 'tape',     h: 220, caption: 'joshua tree' },
    { photo: PHOTOS[4], variant: 'film',     h: 260, caption: 'highway 1' },
  ];
  const colA = items.filter((_, i) => i % 2 === 0);
  const colB = items.filter((_, i) => i % 2 === 1);
  return (
    <IPhoneShell>
      <div style={{ position: 'absolute', top: 4, left: 16, right: 16, display: 'flex', justifyContent: 'space-between', zIndex: 5 }}>
        <NavChip><span style={{ fontSize: 16 }}>‹</span></NavChip>
        <NavChip><span style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 15 }}>Library</span></NavChip>
        <NavChip>⌕</NavChip>
      </div>

      <div style={{ position: 'absolute', top: 50, left: 16, right: 16, bottom: 4, overflow: 'hidden' }}>
        <div style={{ fontFamily: CW.display, fontStyle: 'italic', fontSize: 28, marginBottom: 4 }}>32 days</div>
        <div style={{ fontSize: 12, color: CW.secondary, marginBottom: 14 }}>32 days · 32 colors</div>

        <div style={{ display: 'flex', gap: 8 }}>
          {[colA, colB].map((col, ci) => (
            <div key={ci} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {col.map((it, i) => (
                <div key={i} style={{
                  width: '100%', height: it.h, borderRadius: 6, overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}>
                  <CWCard variant={it.variant} photo={it.photo} color={it.photo.palette[0]}
                          font={FONTS[1]} caption={it.caption} split={0.5}
                          size={{ w: 152, h: it.h }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </IPhoneShell>
  );
}

Object.assign(window, {
  IPhoneShell, NavChip,
  UploadScreen, EditorScreen, EditorScreenInner,
  ColorSheetScreen, FontSheetScreen, LayoutSheetScreen, TextEditScreen,
  ExportScreen, GalleryScreen,
});
