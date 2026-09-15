/**
 * OKami24 — TH/ZH translations of the Finder tool's 6 questions / 24 options (owner quality
 * review, 2026-09-02).
 *
 * This OVERRIDES an earlier, explicit decision (see FinderTool.tsx's original comment) to leave
 * this content English-only, on the reasoning that translating real product-fit questions without
 * an owner-reviewed glossary risked subtly mis-describing them. The owner's fresh review named
 * Finder directly as still-broken localization ("the content in the middle of the page... remains
 * English"), which supersedes that earlier caution. The actual risk that comment worried about —
 * technical vocabulary (MTL/DTL/RDL, mAh, W) being mistranslated — is addressed by keeping every
 * such term exactly as-is below, translating only the plain descriptive sentences around them.
 *
 * Keyed by [questionKey][optionValue] for options, and [questionKey] for the question title.
 * English in FinderTool.tsx's own QUESTIONS array stays canonical/untouched; this REPLACES it
 * per-locale when a translation exists, falling back to English otherwise.
 */

export interface FinderOptionCopy {
  label: string;
  description: string;
}

export interface FinderQuestionCopy {
  title: string;
  options: Record<string, FinderOptionCopy>;
}

export const FINDER_COPY_TH: Record<string, FinderQuestionCopy> = {
  format: {
    title: "กำลังหาพอตแบบไหนอยู่",
    options: {
      "open-pod": { label: "Open-system pod", description: "เติมน้ำยาเองและเปลี่ยนหัวคอยล์ได้" },
      "pod-kit": { label: "Pod kit / pod mod", description: "ต้องการวัตต์มากขึ้น ตัวเครื่องใช้ซ้ำได้ เปลี่ยนแค่หัวพอตหรือคอยล์" },
      disposable: { label: "Disposable", description: "มีน้ำยาในตัวแล้ว ไม่ต้องเติมหรือเปลี่ยนคอยล์" },
      "no-preference": { label: "ยังไม่แน่ใจ", description: "แนะนำตัวที่เหมาะที่สุดมาเลย ไม่จำกัดแบบ" },
    },
  },
  portability: {
    title: "ขนาดที่กะทัดรัดสำคัญแค่ไหน",
    options: {
      "ultra-compact": { label: "ยิ่งเล็กยิ่งดี", description: "พกง่ายสำคัญที่สุด" },
      compact: { label: "กะทัดรัดก็พอ", description: "ไม่ต้องเล็กที่สุดก็ได้" },
      "no-preference": { label: "ไม่สำคัญ", description: "ขนาดไหนก็ได้" },
    },
  },
  screen: {
    title: "อยากได้จอแบบไหน",
    options: {
      none: { label: "ไม่มีจอ", description: "แค่ดูดหรือกดปุ่ม ไม่ต้องมีอะไรให้ดู" },
      basic: { label: "จอแสดงผลแบบง่าย", description: "เหลือบดูก็เห็นแบต วัตต์ และโหมด" },
      full: { label: "จอทัชเต็มจอ", description: "เข้าเมนูและสลับโหมดได้ครบบนจอ" },
      "no-preference": { label: "แบบไหนก็ได้", description: "มีจอหรือไม่มีก็ได้" },
    },
  },
  battery: {
    title: "อายุแบตเตอรี่สำคัญแค่ไหน",
    options: {
      critical: { label: "สำคัญมาก", description: "ชาร์จทีหนึ่ง อยากให้อยู่ได้นานที่สุด" },
      somewhat: { label: "สำคัญพอสมควร", description: "ยังไงก็ต้องชาร์จเป็นประจำอยู่แล้ว" },
      "not-priority": { label: "ไม่ค่อยสำคัญ", description: "ชาร์จบ่อยหน่อยก็ไม่เป็นไร" },
    },
  },
  output: {
    title: "ชอบการสูบและวัตต์แบบไหน",
    options: {
      low: { label: "แน่น MTL วัตต์ต่ำ", description: "ใกล้เคียงการสูบบุหรี่มวน" },
      flexible: { label: "ยืดหยุ่น / กลาง ๆ", description: "สลับไปมาระหว่างการสูบแน่นและโล่ง" },
      high: { label: "โล่ง DTL วัตต์สูง", description: "เอาแรงขึ้น สูบโล่งขึ้น" },
    },
  },
  experience: {
    title: "เคยใช้พอตมาก่อนไหม",
    options: {
      beginner: { label: "เพิ่งเริ่มสูบพอต", description: "ขอแบบง่าย ๆ ใช้ผิดนิดหน่อยก็ไม่เป็นไร" },
      experienced: { label: "มีประสบการณ์แล้ว", description: "ปรับตั้งค่าเองได้สบาย" },
    },
  },
};

export const FINDER_COPY_ZH: Record<string, FinderQuestionCopy> = {
  format: {
    title: "您想找哪种类型的设备？",
    options: {
      "open-pod": { label: "开放式换弹烟弹", description: "自己加注烟油，并更换雾化芯烟弹。" },
      "pod-kit": { label: "换弹主机 / Pod Mod", description: "想要更高输出和可更换阻值的平台。" },
      disposable: { label: "一次性电子烟", description: "已预填烟油，无需加油或更换雾化芯。" },
      "no-preference": { label: "还不确定", description: "不限形态，直接推荐最匹配的选项。" },
    },
  },
  portability: {
    title: "机身小巧对您有多重要？",
    options: {
      "ultra-compact": { label: "越小越好", description: "便携性是首要考虑因素。" },
      compact: { label: "小巧即可，无需最小", description: "不需要是最小的那款。" },
      "no-preference": { label: "无所谓", description: "尺寸不是我的决定因素。" },
    },
  },
  screen: {
    title: "您想要哪种界面？",
    options: {
      none: { label: "无屏幕", description: "只需抽吸或按键，无需查看任何显示。" },
      basic: { label: "简单显示屏", description: "一眼看到电量、功率和模式。" },
      full: { label: "全触控屏", description: "完整的菜单与模式控制。" },
      "no-preference": { label: "没有偏好", description: "屏幕不是我的决定因素。" },
    },
  },
  battery: {
    title: "电池续航对您有多重要？",
    options: {
      critical: { label: "非常重要", description: "希望两次充电之间的续航时间最长。" },
      somewhat: { label: "比较重要", description: "反正都会经常充电。" },
      "not-priority": { label: "不是重点", description: "不介意经常充电。" },
    },
  },
  output: {
    title: "您偏好哪种吸入方式与输出？",
    options: {
      low: { label: "紧口 MTL，较低功率", description: "更接近传统香烟的吸感。" },
      flexible: { label: "灵活 / 介于两者之间", description: "会在紧口和松口吸法之间切换。" },
      high: { label: "松口 DTL，较高功率", description: "想要更大动力和更松的吸感。" },
    },
  },
  experience: {
    title: "您如何描述自己的使用经验？",
    options: {
      beginner: { label: "刚接触电子烟", description: "想要简单、容错率高的设备。" },
      experienced: { label: "有经验", description: "熟悉更进阶的操控方式。" },
    },
  },
};
