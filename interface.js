(() => {
  'use strict';
  const key = 'fieldnotes-language';
  function preference() {
    try { return localStorage.getItem(key) === 'zh-HK' ? 'zh-HK' : 'en'; }
    catch { return 'en'; }
  }
  let locale = preference();
  document.documentElement.lang = locale;
  function activate(next) {
    if (next === locale) return;
    locale = next;
    document.documentElement.lang = next;
    window.dispatchEvent(new CustomEvent('field:locale', {detail:{locale:next}}));
  }
  window.FieldLocale = {
    get: () => locale,
    set(next) {
      if (next !== 'en' && next !== 'zh-HK') return;
      try { localStorage.setItem(key, next); } catch { /* Keep the choice for this visit. */ }
      activate(next);
    }
  };
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) activate(preference());
  });
  window.FIELD_UI = {
    en: {
      site: 'Workbench', siteHome: 'Workbench home', skip: 'Skip to content',
      description: 'Workbench brings together study notes, projects and tools for automotive engineering, robotics, DSE M2 and mechanical engineering.',
      hero: 'What are you studying?', searchLabel: 'Search notes, projects and tools',
      placeholder: 'Search notes, projects, tools…', search: 'Search', quick: 'Quick searches',
      suggestions: ['Gear ratio', 'Vectors', 'Robotics'], nav: 'Main navigation',
      library: 'Library', projects: 'Projects', tools: 'Tools', bookmarks: 'Bookmarks',
      directory: 'Topics', featured: 'Study notes', all: 'All notes', notes: 'Notes', resources: 'Resources',
      topic: 'Topic', bookmark: 'Bookmark', bookmarked: 'Bookmarked', saveError: 'Could not save bookmark',
      related: 'Related notes', openTool: 'Open tool', github: 'View on GitHub',
      active: 'In progress', complete: 'Completed', searchResults: 'Search results',
      noResults: 'No matches. Try a topic, an abbreviation or the name of a tool.',
      emptySaved: 'Your bookmarks will appear here. Open a note and select Bookmark to save it.',
      notFound: 'Page not found', returnHome: 'Back to topics', units: 'Engineering unit converter', vectors: '3D vector calculator',
      count: n => n === 1 ? '1 note' : n + ' notes',
      results: (q, n) => '“' + q + '” · ' + n + (n === 1 ? ' result' : ' results')
    },
    'zh-HK': {
      site: '工作枱', siteHome: '工作枱首頁', skip: '跳至內容',
      description: '工作枱收錄車輛工程、機械人、DSE M2 和機械工程的研習筆記、專案及工具。',
      hero: '你想找甚麼？', searchLabel: '搜尋筆記、專案和小工具',
      placeholder: '搜尋筆記、專案、小工具…', search: '搜尋', quick: '快速搜尋',
      suggestions: ['齒輪比', '向量', '機械人'], nav: '主要導覽',
      library: '知識庫', projects: '專案', tools: '小工具', bookmarks: '書籤',
      directory: '主題目錄', featured: '研習筆記', all: '全部筆記', notes: '筆記', resources: '參考資料',
      topic: '主題', bookmark: '加入書籤', bookmarked: '已加入書籤', saveError: '無法儲存書籤',
      related: '相關筆記', openTool: '開啟工具', github: '查看 GitHub',
      active: '進行中', complete: '已完成', searchResults: '搜尋結果',
      noResults: '沒有相符結果。試試課題名、英文縮寫或工具名稱。',
      emptySaved: '尚未收藏筆記。在筆記內選「加入書籤」，便可在這裏重讀。',
      notFound: '找不到這一頁', returnHome: '回到主題目錄', units: '工程單位換算', vectors: '三維向量計算',
      count: n => n + ' 篇', results: (q, n) => '「' + q + '」 · ' + n + ' 項'
    }
  };
})();
