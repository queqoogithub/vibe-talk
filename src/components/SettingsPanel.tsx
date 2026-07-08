"use client";

import { useState, useEffect } from "react";
import { getApiKey, setApiKey, hasApiKey } from "@/lib/deepseek";
import { Key, CheckCircle2, ExternalLink, AlertCircle } from "lucide-react";

export default function SettingsPanel() {
  const [key, setKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setKey(getApiKey());
  }, []);

  const handleSave = () => {
    setApiKey(key.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-5">
      {/* API Key Section */}
      <div className="bg-white rounded-2xl border border-pastel-border p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-xl bg-pastel-pink-light flex items-center justify-center">
            <Key size={18} className="text-pastel-pink-dark" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-pastel-text">
              DeepSeek API Key
            </h3>
            <p className="text-xs text-pastel-text-light">
              ใส่ API Key เพื่อเชื่อมต่อกับ DeepSeek AI
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type={showKey ? "text" : "password"}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-xxxxxxxxxxxxxxxx"
              className="w-full px-4 py-2.5 rounded-xl border border-pastel-border bg-pastel-cream/50 text-sm text-pastel-text placeholder-pastel-text-light/40 outline-none focus:border-pastel-pink focus:ring-2 focus:ring-pastel-pink/20 transition-all"
            />
            <button
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-pastel-text-light hover:text-pastel-text"
            >
              {showKey ? "Hide" : "Show"}
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={!key.trim()}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              saved
                ? "bg-pastel-green text-white"
                : "bg-pastel-pink text-white hover:bg-pastel-pink-dark disabled:opacity-40"
            }`}
          >
            {saved ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 size={16} />
                Saved
              </span>
            ) : (
              "Save"
            )}
          </button>
        </div>

        {hasApiKey() && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-pastel-green">
            <CheckCircle2 size={13} />
            API key is configured
          </div>
        )}
      </div>

      {/* How to get API Key */}
      <div className="bg-white rounded-2xl border border-pastel-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-pastel-text mb-3">
          วิธีขอ API Key
        </h3>
        <ol className="space-y-2.5 text-xs text-pastel-text-light leading-relaxed">
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pastel-pink-light text-pastel-pink-dark flex items-center justify-center text-[10px] font-bold">
              1
            </span>
            ไปที่{" "}
            <a
              href="https://platform.deepseek.com/api_keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pastel-blue-dark underline inline-flex items-center gap-0.5"
            >
              platform.deepseek.com <ExternalLink size={10} />
            </a>
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pastel-blue-light text-pastel-blue-dark flex items-center justify-center text-[10px] font-bold">
              2
            </span>
            สมัครสมาชิกหรือเข้าสู่ระบบ
          </li>
          <li className="flex gap-2">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-pastel-purple-light text-pastel-purple-dark flex items-center justify-center text-[10px] font-bold">
              3
            </span>
            สร้าง API Key ใหม่ แล้วคัดลอกมาวางด้านบน
          </li>
        </ol>
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl border border-pastel-border p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-pastel-text mb-2">
          เกี่ยวกับ Vibe Talk
        </h3>
        <p className="text-xs text-pastel-text-light leading-relaxed">
          แอปสำหรับฝึกสนทนาภาษาอังกฤษกับ AI Agent ในสถานการณ์จำลองต่างๆ
          พร้อมระบบตรวจแกรมม่า ติดตามจุดที่ควรพัฒนา
          และโหมดฝึกคำศัพท์อ้างอิง Oxford 3000
        </p>
        <div className="flex items-center gap-1.5 mt-3 text-xs text-pastel-text-light/60">
          <AlertCircle size={12} />
          ใช้ DeepSeek AI Model
        </div>
      </div>
    </div>
  );
}
