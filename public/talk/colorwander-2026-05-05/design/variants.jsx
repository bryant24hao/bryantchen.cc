// variants.jsx — the ten Color Walk layout variants.
//
// Every renderer takes the same props so they're swappable:
//   { photo, color, font, caption, split, size }
//   - photo:   one of PHOTOS  (we read photo.url, .palette, .place, .time)
//   - color:   hex string used for the color block
//   - font:    one of FONTS
//   - caption: string to render
//   - split:   0..1, share of canvas given to the color region
//   - size:    { w, h }  — pixel dimensions of the card
//
// All cards render at exact `size`. The design canvas + iOS frame both
// pass small sizes (240×320) for thumbnails, larger for hero previews.

const VariantBase = ({ children, size, bg = '#FAFAF7' }) => (
  <div style={{
    width: size.w, height: size.h, position: 'relative', overflow: 'hidden',
    background: bg, borderRadius: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
  }}>{children}</div>
);

// helper — derives a readable text color (cream or ink) given a hex bg
function textOn(hex) {
  if (!hex) return '#1A1A1A';
  const h = hex.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  const lum = 0.299 * r + 0.587 * g + 0.114 * b;
  return lum > 0.55 ? '#1A1A1A' : '#F0EEE9';
}

// Standard caption block — used by most layouts.
function Caption({ font, color, text, align = 'center', size = 13, place, time, dim }) {
  const fg = textOn(color);
  return (
    <div style={{
      color: fg, textAlign: align, padding: '0 14px',
      fontFamily: font.cssFamily, fontWeight: font.weight,
      fontStyle: font.italic ? 'italic' : 'normal',
    }}>
      <div style={{ fontSize: size, lineHeight: 1.25, letterSpacing: font.id === 'editorial' ? '0.01em' : 0 }}>
        {text}
      </div>
      {(place || time) && (
        <div style={{
          marginTop: 6, fontSize: size * 0.55, opacity: dim ?? 0.55,
          fontFamily: '"Inter", -apple-system, sans-serif', fontStyle: 'normal',
          letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 400,
        }}>
          {place}{place && time ? ' · ' : ''}{time}
        </div>
      )}
    </div>
  );
}

// 1. CLASSIC — color top, photo bottom
function VariantClassic({ photo, color, font, caption, split = 0.5, size }) {
  return (
    <VariantBase size={size}>
      <div style={{
        position: 'absolute', inset: 0, height: `${split * 100}%`,
        background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Caption font={font} color={color} text={caption} place={photo.place} time={photo.time} size={size.w * 0.062} />
      </div>
      <img src={photo.url} alt="" style={{
        position: 'absolute', left: 0, right: 0, top: `${split * 100}%`, bottom: 0,
        width: '100%', height: `${(1 - split) * 100}%`, objectFit: 'cover',
      }} />
    </VariantBase>
  );
}

// 2. GRADIENT — color fades into photo
function VariantGradient({ photo, color, font, caption, split = 0.5, size }) {
  return (
    <VariantBase size={size}>
      <img src={photo.url} alt="" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `linear-gradient(to bottom, ${color} 0%, ${color} ${split * 60}%, transparent ${split * 100 + 10}%)`,
      }} />
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${split * 100}%`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Caption font={font} color={color} text={caption} place={photo.place} time={photo.time} size={size.w * 0.062} />
      </div>
    </VariantBase>
  );
}

// 3. PALETTE — color band + 6-stripe palette + photo
function VariantPalette({ photo, color, font, caption, split = 0.46, size }) {
  const stripH = size.h * 0.04;
  return (
    <VariantBase size={size}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: `${split * 100}%`, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Caption font={font} color={color} text={caption} place={photo.place} time={photo.time} size={size.w * 0.058} />
      </div>
      <div style={{
        position: 'absolute', left: 0, right: 0, top: `${split * 100}%`,
        height: stripH, display: 'flex',
      }}>
        {photo.palette.map((c, i) => (
          <div key={i} style={{ flex: 1, background: c }} />
        ))}
      </div>
      <img src={photo.url} alt="" style={{
        position: 'absolute', left: 0, right: 0, top: `calc(${split * 100}% + ${stripH}px)`,
        bottom: 0, width: '100%', objectFit: 'cover',
      }} />
    </VariantBase>
  );
}

// 4. POLAROID — tilted card with caption footer
function VariantPolaroid({ photo, color, font, caption, size }) {
  const cardW = size.w * 0.82;
  const cardH = size.h * 0.86;
  return (
    <VariantBase size={size} bg={color}>
      <div style={{
        position: 'absolute',
        left: (size.w - cardW) / 2, top: (size.h - cardH) / 2,
        width: cardW, height: cardH, background: '#fff',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
        transform: 'rotate(-2.5deg)', transformOrigin: 'center',
        padding: cardW * 0.04,
        display: 'flex', flexDirection: 'column',
      }}>
        <img src={photo.url} alt="" style={{
          width: '100%', flex: 1, objectFit: 'cover', minHeight: 0,
        }} />
        <div style={{ height: cardW * 0.22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Caption font={font} color="#fff" text={caption} place={photo.place} time={photo.time} size={cardW * 0.07} dim={0.5} />
        </div>
      </div>
    </VariantBase>
  );
}

// 5. MAGAZINE — vertical typography on left, photo right
function VariantMagazine({ photo, color, font, caption, size }) {
  const fg = textOn(color);
  return (
    <VariantBase size={size}>
      <div style={{ position: 'absolute', inset: 0, background: color }} />
      <img src={photo.url} alt="" style={{
        position: 'absolute', right: 0, top: '8%', bottom: '8%', width: '62%', objectFit: 'cover',
      }} />
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '38%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: fg,
      }}>
        <div style={{
          writingMode: 'vertical-rl', textOrientation: 'upright',
          fontFamily: font.cssFamily, fontSize: size.w * 0.07, fontWeight: font.weight,
          fontStyle: font.italic ? 'italic' : 'normal',
          letterSpacing: '0.18em',
        }}>
          {caption}
        </div>
        <div style={{
          position: 'absolute', left: 10, bottom: 12,
          fontFamily: '"Inter", sans-serif', fontSize: size.w * 0.028,
          textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.55, color: fg,
        }}>{photo.place}</div>
      </div>
    </VariantBase>
  );
}

// 6. WINDOW — round porthole
function VariantWindow({ photo, color, font, caption, size }) {
  const dia = Math.min(size.w * 0.78, size.h * 0.62);
  return (
    <VariantBase size={size} bg={color}>
      <div style={{
        position: 'absolute', top: size.h * 0.08, left: 0, right: 0,
        textAlign: 'center', padding: '0 16px',
      }}>
        <Caption font={font} color={color} text={caption} place={photo.place} time={photo.time} size={size.w * 0.058} />
      </div>
      <div style={{
        position: 'absolute', left: (size.w - dia) / 2, top: size.h * 0.32,
        width: dia, height: dia, borderRadius: '50%', overflow: 'hidden',
        boxShadow: 'inset 0 4px 18px rgba(0,0,0,0.12)',
      }}>
        <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </VariantBase>
  );
}

// 7. SPLIT V — color left (vertical text), photo right
function VariantSplitV({ photo, color, font, caption, split = 0.42, size }) {
  const fg = textOn(color);
  return (
    <VariantBase size={size}>
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: `${split * 100}%`, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: fg,
      }}>
        <div style={{
          writingMode: 'vertical-rl', transform: 'rotate(180deg)',
          fontFamily: font.cssFamily, fontSize: size.w * 0.06,
          fontStyle: font.italic ? 'italic' : 'normal', fontWeight: font.weight,
          letterSpacing: '0.04em',
        }}>
          {caption}
        </div>
      </div>
      <img src={photo.url} alt="" style={{
        position: 'absolute', left: `${split * 100}%`, top: 0, bottom: 0, right: 0,
        width: `${(1 - split) * 100}%`, height: '100%', objectFit: 'cover',
      }} />
    </VariantBase>
  );
}

// 8. TAPE — washi-taped photo on color background
function VariantTape({ photo, color, font, caption, size }) {
  const photoW = size.w * 0.78;
  const photoH = size.h * 0.55;
  return (
    <VariantBase size={size} bg={color}>
      <div style={{
        position: 'absolute', top: size.h * 0.08, left: 0, right: 0, textAlign: 'center',
      }}>
        <Caption font={font} color={color} text={caption} size={size.w * 0.058} />
      </div>
      <div style={{
        position: 'absolute', left: (size.w - photoW) / 2, top: size.h * 0.30,
        width: photoW, height: photoH, background: '#fff', padding: 4,
        boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
      }}>
        <img src={photo.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {/* tape pieces */}
        <div style={{
          position: 'absolute', top: -8, left: -10, width: 50, height: 16,
          background: 'rgba(254,244,168,0.82)', transform: 'rotate(-22deg)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }} />
        <div style={{
          position: 'absolute', top: -8, right: -10, width: 50, height: 16,
          background: 'rgba(254,244,168,0.82)', transform: 'rotate(22deg)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
        }} />
      </div>
      <div style={{
        position: 'absolute', bottom: size.h * 0.05, left: 0, right: 0, textAlign: 'center',
        color: textOn(color), fontFamily: '"Inter", sans-serif',
        fontSize: size.w * 0.028, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.55,
      }}>{photo.place}</div>
    </VariantBase>
  );
}

// 9. COLOR STORY — palette strip on right of photo + caption header
function VariantColorStory({ photo, color, font, caption, size }) {
  return (
    <VariantBase size={size} bg={color}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '15%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Caption font={font} color={color} text={caption} size={size.w * 0.05} />
      </div>
      <div style={{
        position: 'absolute', left: '4%', right: '4%', top: '15%', bottom: '5%',
        display: 'flex', gap: size.w * 0.028,
      }}>
        <img src={photo.url} alt="" style={{ flex: 1, height: '100%', objectFit: 'cover' }} />
        <div style={{ width: size.w * 0.05, display: 'flex', flexDirection: 'column' }}>
          {photo.palette.map((c, i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>
      </div>
    </VariantBase>
  );
}

// 10. FILM — 35mm film strip with sprockets
function VariantFilm({ photo, color, font, caption, size }) {
  const perfRow = size.h * 0.04;
  const padY = size.h * 0.022;
  const gap = size.h * 0.008;
  const available = size.h - 2 * padY - 2 * perfRow - gap;
  const colorH = available * (1 / 2.4);
  const imageH = available * (1.4 / 2.4);
  const sideInset = size.w * 0.04;
  const sprockets = (y) => {
    const items = [];
    const count = 9;
    for (let i = 0; i < count; i++) {
      items.push(
        <div key={i} style={{
          width: size.w * 0.045, height: perfRow * 0.55,
          background: '#FAFAF7', borderRadius: 1.5,
        }} />
      );
    }
    return (
      <div style={{
        position: 'absolute', left: sideInset, right: sideInset, top: y, height: perfRow,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>{items}</div>
    );
  };
  return (
    <VariantBase size={size} bg="#1A1A1A">
      {sprockets(padY)}
      <div style={{
        position: 'absolute', left: sideInset, right: sideInset,
        top: padY + perfRow, height: colorH, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Caption font={font} color={color} text={caption} size={size.w * 0.058} />
      </div>
      <img src={photo.url} alt="" style={{
        position: 'absolute', left: sideInset, right: sideInset,
        top: padY + perfRow + colorH + gap, height: imageH,
        width: `calc(100% - ${sideInset * 2}px)`, objectFit: 'cover',
      }} />
      {sprockets(size.h - padY - perfRow)}
    </VariantBase>
  );
}

const VARIANTS = {
  classic: VariantClassic,
  gradient: VariantGradient,
  palette: VariantPalette,
  polaroid: VariantPolaroid,
  magazine: VariantMagazine,
  window: VariantWindow,
  splitV: VariantSplitV,
  tape: VariantTape,
  colorstory: VariantColorStory,
  film: VariantFilm,
};

function CWCard({ variant, ...props }) {
  const C = VARIANTS[variant] || VariantClassic;
  return <C {...props} />;
}

Object.assign(window, { VARIANTS, CWCard, textOn });
