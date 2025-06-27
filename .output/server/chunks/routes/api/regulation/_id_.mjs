import { c as defineEventHandler, e as sendError, f as createError } from '../../../_/nitro.mjs';
import { readFile } from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';

function formatDate(dateString) {
  if (!dateString || dateString === "(\u539F\u59CB\u8CC7\u6599\u672A\u8A3B\u8A18\u6700\u8FD1\u7570\u52D5\u65E5\u671F)") return dateString;
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}\u5E74${parseInt(month)}\u6708${parseInt(day)}\u65E5`;
}
function formatToHtml(lawContent) {
  const lines = lawContent.split("\n");
  let outputHtml = '<div class="regulation-content">\n';
  let inTiao = false;
  lines.forEach((line) => {
    if (line.startsWith("\u3000")) {
      line = "\u2295" + line.slice(1);
    }
    line = line.trim();
    if (line === "") outputHtml += "\n<!-- \u7A7A\u884C -->\n";
    if (/^第[一二三四五六七八九十百千萬零]+[編章節款項目]/.test(line)) {
      if (inTiao) {
        outputHtml += "	</div>\n	<!-- end \u689D -->\n";
        inTiao = false;
      }
      const headingClass = {
        "\u7DE8": "law-division",
        "\u7AE0": "law-chapter",
        "\u7BC0": "law-section",
        "\u6B3E": "law-hsubsection",
        "\u9805": "law-hxiang",
        "\u76EE": "law-hitem"
      };
      const headingType = line.match(/第[一二三四五六七八九十百千萬零]+([編章節款項目])/)[1];
      outputHtml += `	<div class="zhangJie">
		<p class="${headingClass[headingType]}">${line}</p>
	</div>
`;
    } else if (/^第\s*\d+\s*條/.test(line) || /^第[一二三四五六七八九十百]+條/.test(line)) {
      if (inTiao) {
        outputHtml += "	</div>\n";
      }
      let [tiaoTitle, ...rest] = line.split("\uFF08");
      tiaoTitle = tiaoTitle.trim();
      let title = rest.length ? "\uFF08" + rest.join("\uFF08") : "";
      outputHtml += `	<div class="law-article">
		<div class="jfpc"><p class="law-art-num">${tiaoTitle}${title}</p></div>
`;
      inTiao = true;
    } else if (/^⊕/.test(line)) {
      line = line.slice(1);
      if (!inTiao) {
        outputHtml += `	<div class="preamble">
`;
        outputHtml += `		<p class="xiang">${line}</p>
`;
        outputHtml += "	</div>\n";
      } else {
        outputHtml += `		<p class="xiang">${line}</p>
`;
      }
    } else if (/^[一二三四五六七八九十]+、/.test(line)) {
      outputHtml += `		<div class="jfpc"><p class="kuan">${line}</p></div>
`;
    } else if (/^（[一二三四五六七八九十]+）/.test(line)) {
      outputHtml += `		<div class="jfpc"><p class="mu">${line}</p></div>
`;
    } else {
      outputHtml += `		${line}
`;
    }
  });
  if (inTiao) {
    outputHtml += "	</div>\n	<!--end single article-->\n";
  }
  outputHtml += "</div> <!-- end regulation content --> \n";
  return outputHtml;
}
const _id_ = defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const paddedId = id.toString().padStart(4, "0");
  const filePath = path.resolve("public/regulations", `${paddedId}.txt`);
  try {
    const raw = await readFile(filePath, "utf-8");
    const parsed = matter(raw);
    return {
      titleFull: parsed.data.titleFull || "(\u539F\u59CB\u8CC7\u6599\u672A\u8A3B\u8A18\u6A19\u984C)",
      modifiedType: parsed.data.modifiedType || "\u7570\u52D5",
      modifiedDate: formatDate(parsed.data.modifiedDate) || "(\u539F\u59CB\u8CC7\u6599\u672A\u8A3B\u8A18\u6700\u8FD1\u7570\u52D5\u65E5\u671F)",
      status: parsed.data.status || "(\u539F\u59CB\u8CC7\u6599\u672A\u8A3B\u8A18\u65BD\u884C\u72C0\u614B)",
      history: parsed.data.history || "(\u539F\u59CB\u8CC7\u6599\u672A\u8A3B\u8A18\u6B77\u53F2\u6CBF\u9769)",
      fullText: formatToHtml(parsed.content.trim()) || "NO CONTENT!"
    };
  } catch (err) {
    console.error("\u8B80\u53D6\u932F\u8AA4\uFF1A", err);
    return sendError(event, createError({ statusCode: 404, statusMessage: "\u627E\u4E0D\u5230\u6CD5\u898F\u6A94\u6848" }));
  }
});

export { _id_ as default };
//# sourceMappingURL=_id_.mjs.map
