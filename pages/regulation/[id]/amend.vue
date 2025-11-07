<template>
  <div class="container mx-auto p-4">
    <div v-if="pending" class="text-center">
      <p>正在載入法規資料...</p>
    </div>

    <div v-else-if="error || !regulationData" class="text-center text-red-600">
      <p>載入法規資料失敗。您可能輸入了錯誤的法規 ID，如有疑問，請將下列錯誤訊息回報給會網維護小組的同學。</p>
      <pre v-if="error">{{ error.message }}</pre>
    </div>

    <div v-else>
      
        
    
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
        <NuxtLink to="/" class="text-blue-600 dark:text-blue-400 hover:underline">首頁</NuxtLink>
        <span class="text-gray-400 dark:text-gray-600 mx-1">/</span>
        <NuxtLink to="/regulation" class="text-blue-600 dark:text-blue-400 hover:underline">法規系統</NuxtLink>
        <span class="text-gray-400 dark:text-gray-600 mx-1">/</span>
        空白對照表
      </p>
      
      <h1 class="text-3xl font-bold mb-4">
        產生修正條文對照表（含總說明）
      </h1>

      <p class="mb-4 text-lg">
        《{{ regulationData.titleFull }}》
      </p>
      
      <p class="mb-4">
        本頁面提供學生自治會內部同學使用。當您要提案修正此法規時，可點擊下方的按鈕，產生修正條文對照表（含總說明）的 Microsoft Word (.docx) 檔案，作為提案附件。
      </p>

      <p class="mb-4">
        文件格式是依據三峽校區學生議會推薦的提案規格，法規內文使用法規系統格式。如果需要中央法規標準法格式，建議您改成在修正完畢後，經由法規系統的列印功能，自動產生。
      </p>

      <p class="mb-4 text-red-600 dark:text-red-400">
        平均分配欄寬功能還沒辦法自動達成，您需要手動完善：下載 .docx 檔案後開啟 -> 全選表格 -> 表格版面配置 -> 平均分配欄寬。
      </p>

      <p class="mb-4">
        文件自動抓取所有條文。沒有要修正的條文，可以手動整列刪除。
      </p>

      <button 
        @click="downloadDocument"
        class="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors"
      >
        下載「{{ regulationData.titleShort || '法規' }}」空白對照表 Word 檔
      </button>

      <div class="mt-8 border border-gray-300 p-4 rounded-lg">
        <h2 class="text-2xl font-semibold border-b pb-2 mb-4">
          文件內容預覽
        </h2>

        <h3 class="text-xl font-semibold mt-4">總說明</h3>
        <div class="prose mt-2 p-4 bg-gray-50 border rounded">
          <p>「有些人常調侃學生自治是一群政治咖在玩的扮家家酒，掛牌一個議座、法官、什麼什麼部長自嗨而已。惟學生自治會實際上擁有的預算超過百萬，對學校各級會議都有一定的表決權利，甚至在學生權益遭受侵害而向學校申訴時，也有學生代表的身影在其中。如果說這是一個扮家家酒組織，那也是在玩一個非常有錢的扮家家酒，而每一分錢都是同學們納的稅跟繳納的學生會費，如果沒有完善的法規規劃以及分權制衡機關，我們不僅是對不起全校同學，更對不起全國納稅義務人。」</p><p>陳泓霖（第22-23屆學生法官），〈是死灰復生的鳳凰，抑或是曇花一現的煙花——學生法官陳泓霖卸任感言〉，2023年10月20日</p>
        </div>

        <h3 class="text-xl font-semibold mt-6">條文對照表</h3>
        <div class="overflow-x-auto mt-2">
          
         <table class="min-w-full border-collapse border border-orange-800">
            <thead class="bg-gray-100">
              <tr>
                <th class="border border-orange-800 p-2 w-1/3">修正條文</th>
                <th class="border border-orange-800 p-2 w-1/3">現行條文</th>
                <th class="border border-orange-800 p-2 w-1/3">說明</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="border border-orange-800 p-2"></td>
                <td class="border border-orange-800 p-2 font-bold">{{ regulationData.titleFull }}</td>
                <td class="border border-orange-800 p-2"></td>
              </tr>
              <tr v-for="(line, index) in regulationData.bodyLines" :key="index">
                <td class="border border-orange-800 p-2"></td>
                
                <td 
                  class="border border-orange-800 p-2" 
                  :class="{ 'font-bold': isChapter(line) }" 
                  style="white-space: pre-line;"
                >
                  {{ line }}
                </td>
                
                <td class="border border-orange-800 p-2"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// --- 1. 匯入 (Imports) ---
import { computed } from 'vue';
import { useRoute, useAsyncData } from '#app';
import { 
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, 
  HeadingLevel, WidthType, AlignmentType, VerticalAlign, BorderStyle,
  Header, Footer, PageNumber
} from 'docx';
import { saveAs } from 'file-saver';

// --- 2. 型別定義 (Type Definitions) ---

/** API 回應的結構 (原始) */
interface ApiRegulationResponse {
  titleFull: string;
  titleShort: string;
  fullText: string;
}

/** 組件內部使用的結構 (已解析) */
interface ParsedRegulationData {
  titleFull: string;
  titleShort: string;
  bodyLines: string[];
}

// --- 3. 常數 (Constants) ---

/** 總說明欄位的預設文字 (用於 Word) */
const DEFAULT_AMEND_TEXT = [
  "請您在此撰寫修正總說明。",
  "", // 空行
  "依照〈中央行政機關法制作業應注意事項〉，修正法規的時候應當附上「總說明」。在序言中，彙總說明法規制（訂）定或修正的沿革、本次必須修正的理由；如果法規名稱有變更，也加以說明。接著，逐點簡要列明本次各修正的要點。最後，說明執行所需員額及經費的預估。"
];

// --- 4. HTML 解析與日期函式 ---

/**
 * 解析 API 回傳的 `fullText` HTML 字串
 */
function parseHtmlToBodyLines(html: string): string[] {
  const allLines: string[] = []; // 最終的儲存格陣列
  if (!html) return allLines;

  const pRegex = /<p class="([^"]+)">(.*?)<\/p>/g;
  const stripHtmlTags = (str: string) => str.replace(/<[^>]+>/g, '');
  
  let currentArticleParts: string[] = []; // 暫存一個儲存格的內容
  let pMatch;

  // 1. 遍歷所有 <p> 標籤
  while ((pMatch = pRegex.exec(html)) !== null) {
    const classList = pMatch[1]; 
    let text = stripHtmlTags(pMatch[2]);

    // 2. 檢查是否為新儲存格的開頭 (章/條)
    if (classList.includes('law-chapter') || classList.includes('law-art-num')) {
      // 3. 推入前一個儲存格
      if (currentArticleParts.length > 0) {
        allLines.push(currentArticleParts.join('\n'));
      }
      // 4. 開始一個新的儲存格
      currentArticleParts = [text]; 
    } 
    // 5. 附加到 *目前* 的儲存格
    else if (classList.includes('xiang')) {
      currentArticleParts.push('　' + text); 
    } else if (classList.includes('kuan') || classList.includes('mu')) {
      currentArticleParts.push(text);
    }
  }
  
  // 6. 推入 *最後一個* 儲存格
  if (currentArticleParts.length > 0) {
    allLines.push(currentArticleParts.join('\n'));
  }

  return allLines;
}

/**
 * 獲取民國年月日七碼字串 (e.g., 1141107)
 */
function getRocDateString(): string {
  const date = new Date();
  const rocYear = date.getFullYear() - 1911;
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${rocYear}${month}${day}`; 
}

// --- 5. 資料擷取 (Data Fetching) ---

const route = useRoute();
const regulationId = computed(() => route.params.id as string);

/**
 * 使用 `useAsyncData` 從 API 獲取並轉換資料
 */
const { data: regulationData, pending, error } = await useAsyncData<ParsedRegulationData>(
  `regulation-amend-${regulationId.value}`, 
  async () => {
    const apiResponse = await $fetch<ApiRegulationResponse>(`/api/regulation/${regulationId.value}`);
    const bodyLines = parseHtmlToBodyLines(apiResponse.fullText);
    return {
      titleFull: apiResponse.titleFull,
      titleShort: apiResponse.titleShort,
      bodyLines: bodyLines,
    };
  },
  {
    watch: [regulationId] 
  }
);

// --- 6. 預覽頁面輔助函式 (Preview Helpers) ---

/** 判斷是否為章節標題 (用於預覽加粗) */
function isChapter(text: string): boolean {
  return /^(第.+章)/.test(text.trim());
}

// --- 7. 產生 Word 文件 ---

/**
 * 主函式：當使用者點擊下載按鈕時觸發
 */
async function downloadDocument() {
  if (!regulationData.value) return; 

  // (*** 傳入 regulationData 以供頁首/Metadata 使用 ***)
  const doc = createDocx(regulationData.value);
  const blob = await Packer.toBlob(doc);
  
  const rocDate = getRocDateString();
  const filename = `${regulationData.value.titleShort || '法規'}修正案_${rocDate}.docx`;
  
  saveAs(blob, filename);
}

/**
 * 核心：建立 `docx.Document` 物件
 */
function createDocx(data: ParsedRegulationData): Document {
  
  const margins = { top: 1417, right: 1417, bottom: 1417, left: 1417 };
  const defaultFont = {
    size: 22, // 11pt
    font: { ascii: "Times New Roman", eastAsia: "標楷體" },
  };
  
  // (*** 頁首/頁尾的 9pt 字型設定 ***)
  const smallFont = {
    size: 18, // 9pt
    font: { ascii: "Times New Roman", eastAsia: "標楷體" }
  };

  const doc = new Document({
    
    creator: "NTPU學生會法規系統",
    title: `${data.titleShort}修正提案附件`,

    // 樣式
    styles: {
      default: { document: { run: defaultFont } },
      paragraphStyles: [
        { id: "defaultStyle", name: "Default", basedOn: "Normal", next: "Normal", run: defaultFont },
        { 
          id: "tablePara", name: "Table", basedOn: "Normal", next: "Normal",
          run: defaultFont,
          paragraph: { spacing: { before: 0, after: 0 } }
        }
      ]
    },
    // 頁面設定
    sections: [{
      properties: {
        page: { margin: margins, size: { width: 11909, height: 16834 } }, // A4
      },
      // 頁首
      headers: {
        default: new Header({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({
                  text: `${data.titleShort}修正草案　第 `,
                  ...smallFont
                }),
                new TextRun({
                  children: [PageNumber.CURRENT],
                  ...smallFont
                }),
                new TextRun({
                  text: " 頁，共 ",
                  ...smallFont
                }),
                new TextRun({
                  children: [PageNumber.TOTAL_PAGES],
                  ...smallFont
                }),
                new TextRun({
                  text: " 頁",
                  ...smallFont
                }),
              ],
            }),
          ],
        }),
      },
      // 頁尾
      footers: {
        default: new Footer({
          children: [
            new Paragraph({
              alignment: AlignmentType.RIGHT,
              children: [
                new TextRun({
                  children: [PageNumber.CURRENT],
                  ...smallFont
                }),
              ],
            }),
          ],
        }),
      },
      // 頁面主要內容
      children: [
        // 1. 文件標題
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 240 },
          children: [
            new TextRun({
              text: `「${data.titleFull}」第某條修正草案`,
              bold: true,
              size: 32, // 16pt
              color: "000000",
              font: { ascii: "Times New Roman", eastAsia: "標楷體" }
            })
          ]
        }),
        
        // 2. 總說明
        new Paragraph({
          spacing: { after: 120 },
          children: [
            new TextRun({
              text: "一、總說明",
              bold: true,
              size: 28, // 14pt
              color: "000000",
              font: { ascii: "Times New Roman", eastAsia: "標楷體" }
            })
          ]
        }),
        
        // 總說明 - 假文
        ...DEFAULT_AMEND_TEXT.map(text => 
          new Paragraph({
            text: text,
            style: "defaultStyle",
            spacing: { after: text === "" ? 0 : 120 }
          })
        ),
        
        // 3. 條文對照表
        new Paragraph({
          spacing: { after: 120, before: 120 },
          children: [
            new TextRun({
              text: "二、條文對照表",
              bold: true,
              size: 28, // 14pt
              color: "000000",
              font: { ascii: "Times New Roman", eastAsia: "標楷體" }
            })
          ]
        }),

        // 4. 表格
        createAmendmentTable(data),
      ],
    }],
  });
  return doc;
}

/**
 * 建立條文對照表
 */
function createAmendmentTable(data: ParsedRegulationData): Table {
  
  // (*** 1. 平均分配欄寬 ***)
  // A4 寬 (11909) - 左右邊距 (1417*2 = 2834) = 9075
  // 9075 / 3 = 3025
  const columnWidths = [3025, 3025, 3025];
  const tableStyle = "tablePara"; 

  // 表格標題列
  const headerRow = new TableRow({
    tableHeader: true, // 跨頁重複
    children: [
      createHeaderCell("修正條文"),
      createHeaderCell("現行條文"),
      createHeaderCell("說明"),
    ],
  });

  // 建立內容列
  const contentRows: TableRow[] = [];

  // 法規標題
  contentRows.push(new TableRow({
    children: [
      createEmptyCell(tableStyle), 
      createDataCell(data.titleFull, tableStyle, true), // 粗體
      createEmptyCell(tableStyle), 
    ]
  }));
  
  // 遍歷法規內文
  data.bodyLines.forEach(line => {
    const isChap = isChapter(line); 
    contentRows.push(
      new TableRow({
        children: [
          createEmptyCell(tableStyle), 
          createDataCell(line, tableStyle, isChap), // 傳入多行字串
          createEmptyCell(tableStyle), 
        ]
      })
    );
  });

  // 回傳表格 (含所有框線)
  return new Table({
    rows: [headerRow, ...contentRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: columnWidths, // (*** 應用平均欄寬 ***)
    borders: {
      top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
      insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
    }
  });
}

// --- 8. 表格輔助函式 (Table Cell Helpers) ---

/** 建立「表格標題」儲存格 */
function createHeaderCell(text: string): TableCell {
  return new TableCell({
    children: [ new Paragraph({ text: text, alignment: AlignmentType.CENTER, style: "tablePara" }) ],
    verticalAlign: VerticalAlign.CENTER,
    shading: { fill: "F2F2F2" }
  });
}

/**
 * 建立「表格內文」儲存格 (亦即：從資料庫獲取現行條文，並逐列輸出之)
 */
function createDataCell(text: string, styleId: string, isBold: boolean = false): TableCell {
  
  const lines = text.split('\n'); // e.g., ["第 1 條", "　內容"]
  
  // 1. 將 `lines` 陣列 轉譯 (map) 成 `Paragraph` 陣列
  const paragraphs: Paragraph[] = lines.map((line, index) => {
    
    let lineIsBold = isBold; // 預設 (用於章節)
    
    // 2. 自動將條號 (多行文字的第一行) 加粗
    if (!isBold && index === 0 && /^(第.+條)/.test(line.trim())) {
      lineIsBold = true;
    }

    // 3. 為 *每一行* 建立一個 *新的 Paragraph*
    return new Paragraph({
      children: [
        new TextRun({
          text: line,
          bold: lineIsBold
        })
      ],
      style: styleId // 應用 "tablePara" 樣式 (無段距)
    });
  });

  // 4. 回傳包含 Paragraph 陣列的 TableCell
  return new TableCell({
    children: paragraphs,
    verticalAlign: VerticalAlign.TOP,
  });
}

/** 建立「空白」儲存格 */
function createEmptyCell(styleId: string): TableCell {
  return new TableCell({
    // 空白儲存格也需要一個空的 Paragraph
    children: [ new Paragraph({ text: "", style: styleId }) ],
    verticalAlign: VerticalAlign.TOP,
  });
}

</script>

<style>
/* 讓 Tailwind 'prose' (用於總說明預覽) 
  能正確應用，而不是被外層寬度限制 
*/
.prose {
  max-width: none;
}
</style>