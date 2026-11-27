window.FIELD_CATALOG = {
  topics: [
    { id: "auto", name: "車輛工程", en: "Automotive Engineering", description: "從傳動比和車輪轉速，計算扭矩與車速。" },
    { id: "robot", name: "機械人", en: "Robotics", description: "用編碼器讀數和左右輪速度，推算機械人的移動。" },
    { id: "m2", name: "DSE M2", en: "Algebra and Calculus", description: "透過向量和定積分的算例，練習代數與微積分。" },
    { id: "mech", name: "HKU ME", en: "Mechanical Engineering", description: "重溫機械工程的基礎模型，從受力圖算到構件變形。" }
  ],
  notes: [
    {
      id: "gear-ratio", topic: "auto", title: "齒輪比怎樣影響轉速與扭矩？",
      summary: "一對 20 齒和 60 齒的齒輪，可以用來推算輸出軸每分鐘轉多少圈、傳出多少扭矩。",
      sections: [
        { heading: "從齒數讀出轉速比", text: "兩個外齒輪直接嚙合時，接觸點在同一時間通過相同齒數。若 20 齒齒輪主動、60 齒齒輪從動，輸入軸每轉三圈，輸出軸便反向轉一圈。這裏把減速比定義為輸入轉速除以輸出轉速，所以減速比為 3。" },
        { heading: "計入傳動損耗", text: "若輸入為 900 rpm、10 N·m，輸出轉速為 300 rpm。理想情況下，功率 P = Tω 守恆，輸出扭矩為 30 N·m。若此齒輪組的效率為 90%，輸出扭矩便是 10 × 3 × 0.90 = 27 N·m。用公式計功率時，ω 要以 rad/s 表示。" }
      ],
      related: ["wheel-speed"]
    },
    {
      id: "wheel-speed", topic: "auto", title: "由車輪轉速換算車速",
      summary: "車輪每分鐘轉 450 圈，車速是多少？先找出車輪每轉一圈前進的距離。",
      sections: [
        { heading: "先算每圈走多遠", text: "假設車輪純滾動，有效滾動半徑 r 為 0.30 m。每圈前進 2πr，約 1.885 m。若車輪每分鐘轉 450 圈，每秒就是 450 ÷ 60 = 7.5 圈。" },
        { heading: "換算並核對單位", text: "車速為 1.885 × 7.5 ≈ 14.1 m/s，即約 50.9 km/h。若儀器量度的是馬達轉速，須先按完整傳動比求出車輪轉速。輪胎打滑時，輪速推算的車速和實際地面速度會有差異。" }
      ],
      related: ["gear-ratio", "encoder-distance"]
    },
    {
      id: "encoder-distance", topic: "robot", title: "由編碼器計數估算行程",
      summary: "把一段時間內的計數變化換成轉數，再換成輪面走過的距離。",
      sections: [
        { heading: "確認一圈有多少個計數", text: "將車輪標記對準起點，轉動一整圈，記下控制器讀數的變化。編碼器若裝在馬達軸，減速比會影響車輪每圈的計數；控制器的解碼方式亦會影響讀數。直接量度車輪一圈，可把兩者一併核對。" },
        { heading: "把計數差換成距離", text: "假設車輪每圈為 1,440 個計數，直徑 0.080 m。讀數由 100 升至 460，差值 360 相當於四分之一圈。純滾動時，該輪前進距離為 (360 ÷ 1,440) × π × 0.080 ≈ 0.0628 m。保留差值正負號，就能按設定的正方向區分前進和後退。" }
      ],
      related: ["differential-drive", "wheel-speed"]
    },
    {
      id: "differential-drive", topic: "robot", title: "由左右輪速度判斷轉向",
      summary: "差速底盤可以靠兩輪速度差轉彎。車身中心的速度和角速度各有一條簡單公式。",
      sections: [
        { heading: "先約定正方向", text: "從上方看，約定車頭向前為輪速正方向，逆時針左轉為正角速度。設左右輪接地點的橫向距離為 b，左右輪線速度為 vL 和 vR。兩輪純滾動且沒有側滑時，車軸中點速度 v = (vR + vL) ÷ 2，車身角速度 ω = (vR − vL) ÷ b。" },
        { heading: "用兩個輪速試算", text: "若 b = 0.40 m，左輪 0.20 m/s、右輪 0.40 m/s，中點會以 0.30 m/s 前進，並以 0.50 rad/s 向左轉。中點的轉彎半徑為 v ÷ ω = 0.60 m。把兩輪改成等速同向，ω 便會變為零，底盤沿直線行走。" }
      ],
      related: ["encoder-distance"]
    },
    {
      id: "dot-product", topic: "m2", title: "用純量積求兩個向量的夾角",
      summary: "由兩個向量的分量計算純量積，再用它判斷夾角。",
      sections: [
        { heading: "把分量和角度連起來", text: "在直角坐標系中，兩個向量的純量積等於對應分量相乘後的總和。另一方面，a · b = |a||b| cos θ，其中 θ 為兩個非零向量之間介乎 0° 與 180° 的夾角。" },
        { heading: "從答案的正負號驗算", text: "取 a = (1, 2, 0)、b = (2, 0, 1)。純量積為 2，兩個向量的長度均為 √5，所以 cos θ = 2/5，θ ≈ 66.4°。純量積為正，答案應是銳角。若題目要求角度，記得把計算機設為度數模式。" }
      ],
      related: ["signed-area"]
    },
    {
      id: "signed-area", topic: "m2", title: "曲線跨過 x 軸時怎樣計面積？",
      summary: "同一段曲線的定積分和幾何面積可以不同。先找零點，才決定要分成幾段。",
      sections: [
        { heading: "用零點劃分區間", text: "考慮 y = x − 1，在 0 ≤ x ≤ 3 的區間內，曲線於 x = 1 穿過 x 軸。由 0 至 1 的部分在軸下，由 1 至 3 的部分在軸上。求曲線與 x 軸之間的總面積時，兩段均要貢獻正數。" },
        { heading: "用三角形面積核對", text: "原函數可取 F(x) = x²/2 − x。全段定積分為 F(3) − F(0) = 1.5。軸下部分的幾何面積為 0.5，軸上部分為 2，所以總面積為 2.5 平方單位。畫圖後亦可用兩個直角三角形的底乘高除以二核對。" }
      ],
      related: ["dot-product"]
    },
    {
      id: "beam-reactions", topic: "mech", title: "用力矩平衡求簡支樑的反力",
      summary: "把整條樑從支座中獨立畫出，以其中一端為力矩中心，可以先求另一端的反力。",
      sections: [
        { heading: "在受力圖標明距離", text: "一條水平簡支樑長 3 m，左端 A 為鉸支座，右端 B 為放在水平面上的滾動支座。距 A 點 1 m 有一道向下的 600 N 集中力。忽略樑的自重，將 A、B 兩端的垂直反力暫定向上。由於沒有水平外力，A 的水平反力為零。" },
        { heading: "先取力矩，再核對垂直力", text: "以 A 點取力矩，逆時針為正。平衡條件為 RB × 3 − 600 × 1 = 0，得 RB = 200 N。再由 RA + RB − 600 = 0，得 RA = 400 N。載荷較靠近 A，算出的 A 端反力也較大。" }
      ],
      related: ["axial-strain"]
    },
    {
      id: "axial-strain", topic: "mech", title: "由軸向拉力估算桿件伸長",
      summary: "從拉力求正應力，再由應變估算伸長量。計算時要特別留意面積和彈性模量的單位。",
      sections: [
        { heading: "先檢查模型適用條件", text: "考慮一條等截面直桿，沿中心軸受拉，材料處於線彈性範圍。對均勻受力的桿段，平均正應力 σ = F/A，軸向應變 ε = σ/E，伸長量 ΔL = εL，其中 E 是楊氏模量，L 是原長。" },
        { heading: "用 N 和 mm 完成計算", text: "設拉力 F = 1,000 N、面積 A = 50 mm²、原長 L = 500 mm，材料的 E = 200 GPa。由於 1 N/mm² = 1 MPa，應力為 20 MPa，E 相當於 200,000 MPa。應變為 0.0001，伸長量為 0.0001 × 500 = 0.05 mm。" }
      ],
      related: ["beam-reactions"]
    }
  ],
  projects: [
    {
      id: "fieldnotes", name: "工作枱工程筆記站", status: "active",
      description: "整理車輛、機械人、數學與機械工程的短篇筆記，把公式放回有數值、有單位的算例。",
      sections: [
        { heading: "沿着同一個問題讀下去", text: "齒輪的輸出轉速，可以接到車輪的行駛速度；車輪每轉一圈的距離，又可以用來解讀機械人的編碼器。每篇筆記附有相關條目，方便沿着這些關係重溫。" }
      ]
    },
    {
      id: "unit-converter", name: "工程單位換算器", status: "complete", url: "#tools",
      description: "在站內工具頁轉換工程單位，核對算例中數值的尺度。",
      sections: [
        { heading: "用已知關係核對換算", text: "選擇同一物理量的起始單位和目標單位，再輸入數值。驗算時可先用已知關係，例如 1 m = 1,000 mm，再把單位對調，檢查結果是否回到原來的數值。" }
      ]
    }
  ]
};
