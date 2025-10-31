import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * 解析 txt 檔案中的 YAML front matter
 * @param {string} filePath - 檔案路徑
 * @returns {object|null} - 解析後的 front matter 物件
 */
function parseFrontMatter(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = matter(content);
    
    if (!parsed.data || !parsed.data.titleShort) {
      console.warn(`檔案 ${filePath} 缺少 titleShort 欄位`);
      return null;
    }
    
    return parsed.data;
  } catch (error) {
    console.error(`解析檔案 ${filePath} 時發生錯誤:`, error.message);
    return null;
  }
}

/**
 * 掃描 public/regulations 目錄，取得所有法規資訊
 * @returns {Array} - 法規陣列 [[id, titleShort], ...]
 */
function scanRegulations() {
  const regulationsDir = path.join(process.cwd(), 'public', 'regulations');
  const lawList = [];
  
  if (!fs.existsSync(regulationsDir)) {
    console.error('public/regulations 目錄不存在');
    return lawList;
  }
  
  try {
    const files = fs.readdirSync(regulationsDir);
    
    // 篩選出 .txt 檔案且檔名為4位數字
    const txtFiles = files.filter(file => {
      return file.endsWith('.txt') && /^\d{4}\.txt$/.test(file);
    });
    
    for (const file of txtFiles) {
      const filePath = path.join(regulationsDir, file);
      const lawId = parseInt(file.replace('.txt', ''), 10);
      
      const frontMatter = parseFrontMatter(filePath);
      if (frontMatter && frontMatter.titleShort) {
        lawList.push([lawId, frontMatter.titleShort]);
      } else {
        console.warn(`檔案 ${file} 缺少 titleShort 欄位`);
      }
    }
    
    // 按 ID 排序
    lawList.sort((a, b) => a[0] - b[0]);
    
    return lawList;
  } catch (error) {
    console.error('掃描法規目錄時發生錯誤:', error.message);
    return lawList;
  }
}

/**
 * 更新 pages/regulation/index.vue 中的 lawList 陣列
 * @param {Array} newLawList - 新的法規陣列
 */
function updateIndexVue(newLawList) {
  const indexPath = path.join(process.cwd(), 'pages', 'index.vue');
  
  if (!fs.existsSync(indexPath)) {
    console.error('pages/regulation/index.vue 檔案不存在');
    return false;
  }
  
  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // 建立新的 lawList 字串
    const newLawListStr = `const lawList = [\n${newLawList.map(law => 
      `  [${law[0]},'${law[1]}'],`
    ).join('\n')}\n];`;
    
    // 使用正規表達式找到並替換 lawList 定義
    const lawListRegex = /const\s+lawList\s*=\s*\[[\s\S]*?\];/;
    
    if (lawListRegex.test(content)) {
      content = content.replace(lawListRegex, newLawListStr);
      fs.writeFileSync(indexPath, content, 'utf8');
      console.log('✅ 成功更新 pages/regulation/index.vue 中的 lawList');
      return true;
    } else {
      console.error('❌ 在 pages/regulation/index.vue 中找不到 lawList 定義');
      return false;
    }
  } catch (error) {
    console.error('更新 pages/regulation/index.vue 時發生錯誤:', error.message);
    return false;
  }
}

/**
 * 主要執行函數
 */
function main() {
  console.log('🔍 開始掃描法規檔案...');
  
  const lawList = scanRegulations();
  
  console.log(`📊 找到 ${lawList.length} 個法規檔案:`);
  lawList.forEach(law => {
    console.log(`   - ID: ${law[0]}, 簡稱: ${law[1]}`);
  });
  
  if (lawList.length > 0) {
    console.log('📝 更新 lawList 陣列...');
    const success = updateIndexVue(lawList);
    
    if (success) {
      console.log('✨ 法規列表更新完成！');
      process.exit(0);
    } else {
      console.log('❌ 法規列表更新失敗！');
      process.exit(1);
    }
  } else {
    console.log('⚠️  沒有找到有效的法規檔案');
    process.exit(1);
  }
}

// 如果直接執行此檔案，則執行主要函數
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  parseFrontMatter,
  scanRegulations,
  updateIndexVue,
  main
};