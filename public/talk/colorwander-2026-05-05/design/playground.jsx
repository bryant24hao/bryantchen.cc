// playground.jsx — Interactive playground (Section 2 of canvas).
// A live iPhone preview + tweak controls beside it. Lets the reviewer
// flip photo / variant / color / font / split / caption.

const { useState: usePlayState } = React;

function Playground() {
  const [photoIdx, setPhotoIdx] = usePlayState(0);
  const [variant, setVariant] = usePlayState('classic');
  const [colorIdx, setColorIdx] = usePlayState(0);
  const [fontIdx, setFontIdx] = usePlayState(1);
  const [split, setSplit] = usePlayState(0.5);
  const [caption, setCaption] = usePlayState('a photo, a color, a day');

  const photo = PHOTOS[photoIdx];
  const color = photo.palette[colorIdx % photo.palette.length];
  const font = FONTS[fontIdx];

  return (
    <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
      {/* Live phone */}
      <div style={{ flex: '0 0 auto' }}>
        <div style={{
          width: 320, height: 656, borderRadius: 50, padding: 9, background: '#1a1a1a',
          boxShadow: '0 18px 50px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <div style={{ width: '100%', height: '100%', borderRadius: 42, overflow: 'hidden', background: CW.bg }}>
            <EditorScreen photo={photo} color={color} font={font} caption={caption} variant={variant} activeTool="layout" />
          </div>
        </div>
      </div>

      {/* Tweak panel */}
      <div style={{
        flex: '0 0 380px', background: '#fff', borderRadius: 14,
        padding: '18px 18px 22px', border: `1px solid ${CW.hairline}`,
        boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        fontFamily: CW.sans, fontSize: 13,
      }}>
        <div style={{
          fontFamily: CW.display, fontStyle: 'italic', fontSize: 22, marginBottom: 4,
        }}>Tweaks</div>
        <div style={{ fontSize: 12, color: CW.secondary, marginBottom: 18 }}>
          Live-edit any input. The phone updates immediately.
        </div>

        <TweakLabel>Photo</TweakLabel>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
          {PHOTOS.map((p, i) => (
            <div key={p.id} onClick={() => { setPhotoIdx(i); setColorIdx(0); }} style={{
              width: 44, height: 44, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
              border: photoIdx === i ? `2px solid ${CW.ink}` : '1.5px solid transparent',
              boxShadow: photoIdx === i ? '0 2px 6px rgba(0,0,0,0.18)' : 'none',
            }}>
              <img src={p.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>

        <TweakLabel>Layout</TweakLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
          {LAYOUTS.map(l => (
            <div key={l.id} onClick={() => setVariant(l.id)} style={{
              padding: '6px 10px', borderRadius: 8, fontSize: 11, fontWeight: 500, cursor: 'pointer',
              background: variant === l.id ? CW.ink : 'transparent',
              color: variant === l.id ? CW.bg : CW.ink,
              border: variant === l.id ? 'none' : `1px solid ${CW.hairline}`,
            }}>{l.name}</div>
          ))}
        </div>

        <TweakLabel>Color (from photo)</TweakLabel>
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {photo.palette.map((c, i) => (
            <div key={i} onClick={() => setColorIdx(i)} style={{
              width: 36, height: 36, borderRadius: 8, background: c, cursor: 'pointer',
              border: colorIdx === i ? `2px solid ${CW.ink}` : '1.5px solid rgba(0,0,0,0.08)',
              boxShadow: colorIdx === i ? '0 2px 6px rgba(0,0,0,0.16)' : 'none',
            }} />
          ))}
        </div>

        <TweakLabel>Font</TweakLabel>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
          {FONTS.map((f, i) => (
            <div key={f.id} onClick={() => setFontIdx(i)} style={{
              padding: '6px 10px', borderRadius: 8, fontSize: 12, cursor: 'pointer',
              fontFamily: f.cssFamily, fontStyle: f.italic ? 'italic' : 'normal',
              fontWeight: f.weight,
              background: fontIdx === i ? CW.ink : '#fff',
              color: fontIdx === i ? CW.bg : CW.ink,
              border: `1px solid ${fontIdx === i ? CW.ink : CW.hairline}`,
            }}>{f.name}</div>
          ))}
        </div>

        <TweakLabel>Split · {Math.round(split * 100)}%</TweakLabel>
        <input type="range" min={20} max={80} value={split * 100} onChange={(e) => setSplit(+e.target.value / 100)}
               style={{ width: '100%', marginBottom: 16, accentColor: CW.ink }} />

        <TweakLabel>Caption</TweakLabel>
        <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} style={{
          width: '100%', padding: '10px 12px', borderRadius: 8,
          border: `1px solid ${CW.hairline}`, background: '#fff',
          fontFamily: CW.sans, fontSize: 13, color: CW.ink, boxSizing: 'border-box',
        }} />
      </div>
    </div>
  );
}

function TweakLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 600, color: CW.inkSoft,
      letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8,
    }}>{children}</div>
  );
}

Object.assign(window, { Playground });
