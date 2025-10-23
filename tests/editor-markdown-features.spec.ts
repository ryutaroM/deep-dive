// spec: test-plan-editor-localstorage-chat.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('マークダウン記法とエディタ機能', () => {
  test('マークダウン記法の入力と表示', async ({ page }) => {
    // アプリケーションにアクセス
    await page.goto('http://localhost:5173');

    // LocalStorageをクリア
    await page.evaluate(() => { localStorage.clear(); });

    const editorTextbox = page.locator('textarea');

    // 1. マークダウン記法の入力と表示
    // マークダウン記法を入力
    await editorTextbox.fill('# 見出し1\n## 見出し2\n\n**太字テキスト**\n*イタリック*\n\n- リスト項目1\n- リスト項目2');

    // プレビューペインに見出し1が表示されていることを確認
    await expect(page.getByRole('heading', { name: '見出し1' })).toBeVisible();

    // プレビューペインに見出し2が表示されていることを確認
    await expect(page.getByRole('heading', { name: '見出し2' })).toBeVisible();

    // 太字テキストが表示されていることを確認（プレビューペインのstrongタグ内）
    await expect(page.locator('strong').filter({ hasText: '太字テキスト' })).toBeVisible();

    // イタリックテキストが表示されていることを確認（プレビューペインのemタグ内）
    await expect(page.locator('em').filter({ hasText: 'イタリック' })).toBeVisible();
  });

  test('コードブロックとシンタックスハイライト', async ({ page }) => {
    // アプリケーションにアクセス
    await page.goto('http://localhost:5173');

    // LocalStorageをクリア
    await page.evaluate(() => { localStorage.clear(); });

    // リロード完了を待つ
    await new Promise(f => setTimeout(f, 1 * 1000));

    const editorTextbox = page.locator('textarea');

    // 2. コードブロックとシンタックスハイライト
    // JavaScriptコードブロックのみを入力
    await editorTextbox.fill('```javascript\nfunction hello() {\n  console.log("Hello, World!");\n}\n```');

    // プレビューでコードブロックが表示されることを確認
    // （コードブロック内のテキストが表示されていることで確認）
    await expect(page.getByText('function hello()')).toBeVisible();
  });

  test('マークダウン形式データのLocalStorage保存と復元', async ({ page }) => {
    // アプリケーションにアクセス
    await page.goto('http://localhost:5173');

    // LocalStorageをクリア
    await page.evaluate(() => { localStorage.clear(); });

    const editorTextbox = page.locator('textarea');

    // 3. LocalStorageの詳細テスト
    // マークダウン形式のテキストを入力
    await editorTextbox.fill('# タイトル\n- 項目1\n- 項目2\n\n**重要な内容**');

    // 自動保存のために600ms待機
    await new Promise(f => setTimeout(f, 0.6 * 1000));

    // ページをリロード
    await page.goto('http://localhost:5173');

    // エディタの初期化を待つ
    await new Promise(f => setTimeout(f, 0.5 * 1000));

    // 「重要な内容」が復元されていることを確認（プレビューペインのstrongタグ内）
    await expect(page.locator('strong').filter({ hasText: '重要な内容' })).toBeVisible();

    // タイトルも復元されていることを確認
    await expect(page.getByRole('heading', { name: 'タイトル' })).toBeVisible();

    // リスト項目も復元されていることを確認
    await expect(page.getByRole('listitem').filter({ hasText: '項目1' })).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: '項目2' })).toBeVisible();
  });
});
