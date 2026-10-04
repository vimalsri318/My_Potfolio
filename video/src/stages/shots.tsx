import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { C, ease, F, lerp } from "../theme";
import { BrowserWindow, PhoneFrame, Shot, StageBg, useEnter } from "../ui";

// Stages built from real screenshots of the live products. Every stage is
// laid out on a 1280×800 canvas.

const WebAndPhone: React.FC<{
  accent: string;
  url: string;
  web: string;
  phone?: string;
  dark?: boolean;
  pan?: number;
}> = ({ accent, url, web, phone, dark, pan = 0 }) => {
  const frame = useCurrentFrame();
  const win = useEnter(0);
  const p = ease(frame, 14, 44);
  return (
    <AbsoluteFill>
      <StageBg accent={accent} dark={dark} />
      <div style={{ position: "absolute", left: 96, top: 92, ...win }}>
        <BrowserWindow url={url} width={1040} height={760} dark={dark}>
          <Shot src={web} pan={pan} />
        </BrowserWindow>
      </div>
      {phone && (
        <div
          style={{
            position: "absolute",
            right: 70,
            top: 210,
            opacity: p,
            translate: `${lerp(p, 80, 0)}px ${lerp(p, 30, 0)}px`,
            rotate: `${lerp(p, 6, 0)}deg`,
          }}
        >
          <PhoneFrame width={236}>
            <Shot src={phone} pan={160} from={20} />
          </PhoneFrame>
        </div>
      )}
    </AbsoluteFill>
  );
};

export const InflunetStage = () => (
  <WebAndPhone accent="#E5197D" url="influnet.io/business" web="shots/influnet-biz.jpg" phone="shots/influnet-biz-m.jpg" />
);

export const BuzinessStage = () => (
  <WebAndPhone accent="#0F766E" url="buziness365.up.railway.app" web="shots/buziness.jpg" phone="shots/buziness-m.jpg" />
);

export const AmretriStage = () => (
  <WebAndPhone accent="#0D9488" url="amretrihealthcare.com" web="shots/amretri.jpg" />
);

export const JaiSathyaStage = () => (
  <WebAndPhone accent="#D97706" url="jaisathya.com" web="shots/jaisathya.jpg" />
);

// TCC: the owner dashboard plus the keyboard shortcuts agents work with.
export const TccStage = () => {
  const frame = useCurrentFrame();
  const win = useEnter(0);
  const keys: [string, string][] = [
    ["1–5", "Status"],
    ["Q–I", "Outcome"],
    ["↵", "Save"],
    ["T", "Ticket"],
  ];
  return (
    <AbsoluteFill>
      <StageBg accent="#2B8CC4" />
      <div style={{ position: "absolute", left: 96, top: 92, ...win }}>
        <BrowserWindow url="tcc.tecstellar.com" width={1040} height={760}>
          <Shot src="shots/tcc-owner.jpg" />
        </BrowserWindow>
      </div>
      <div
        style={{
          position: "absolute",
          right: 60,
          top: 150,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {keys.map(([k, label], i) => {
          const t = ease(frame, 30 + i * 9, 56 + i * 9);
          return (
            <div
              key={k}
              style={{
                opacity: t,
                translate: `${lerp(t, 40, 0)}px 0px`,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 18px 12px 12px",
                background: C.white,
                borderRadius: 14,
                boxShadow: "0 18px 40px rgba(12,12,12,0.16)",
              }}
            >
              <span
                style={{
                  minWidth: 64,
                  textAlign: "center",
                  padding: "8px 10px",
                  borderRadius: 9,
                  background: "#2B8CC4",
                  color: C.white,
                  fontFamily: F.mono,
                  fontWeight: 700,
                  fontSize: 20,
                }}
              >
                {k}
              </span>
              <span style={{ fontFamily: F.body, fontWeight: 600, fontSize: 20, color: C.ink }}>{label}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

