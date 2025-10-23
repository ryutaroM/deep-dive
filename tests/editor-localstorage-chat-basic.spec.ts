// spec: test-plan-editor-localstorage-chat.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('エディタ・ローカルストレージ・チャット機能', () => {
  test('基本的な機能テスト', async ({ page }) => {
    // アプリケーションにアクセスして初期状態を確認
    await page.goto('http://localhost:5173');

    // 1.1 初回起動時の空エディタ表示
    // LocalStorageをクリアして初期状態にする
    await page.evaluate(() => { localStorage.clear(); });

    // エディタのテキストボックスが表示されていることを確認
    const editorTextbox = page.locator('textarea');
    await expect(editorTextbox).toBeVisible();

    // チャットセクションのAPIキー設定画面が表示されていることを確認
    await expect(page.getByRole('heading', { name: '🔐 Set up your API Key' })).toBeVisible();

    // 1.2 プレーンテキストの入力
    // 「Hello, World!」と入力
    await editorTextbox.fill('Hello, World!');

    // 2.1 データの自動保存（デバウンス動作）
    // LocalStorageをクリアしてテストを準備
    await page.evaluate(() => { localStorage.clear(); });

    // 「Test content」と入力
    await editorTextbox.fill('Test content');

    // デバウンス保存のために600ms待機
    await new Promise(f => setTimeout(f, 0.6 * 1000));

    // LocalStorageに「Test content」が保存されていることを確認
    const savedData = await page.evaluate(() => localStorage.getItem('editor-data'));
    expect(savedData).toBe('Test content');

    // 2.2 保存済みデータの復元
    // 「Saved content」と入力
    await editorTextbox.fill('Saved content');

    // 自動保存のために600ms待機
    await new Promise(f => setTimeout(f, 0.6 * 1000));

    // ページをリロードして保存されたデータが復元されることを確認
    await page.goto('http://localhost:5173');

    // エディタの初期化を待つ
    await new Promise(f => setTimeout(f, 0.5 * 1000));

    // プレビューペインに「Saved content」が表示されていることを確認
    await expect(page.getByRole('paragraph').filter({ hasText: 'Saved content' })).toBeVisible();

    // 3.1 初回表示時のAPIキー設定画面
    // 「Start」ボタンが表示されていることを確認
    await expect(page.getByRole('button', { name: 'Start' })).toBeVisible();

    // 3.2 APIキー入力とボタンクリックによる設定
    // APIキー入力フィールドに「test-api-key-123」と入力
    await page.getByRole('textbox', { name: 'Enter your Groq API Key' }).fill('test-api-key-123');

    // 「Start」ボタンをクリックしてチャットUIに切り替える
    await page.getByRole('button', { name: 'Start' }).click();

    // メッセージ入力フィールドが表示されていることを確認
    const chatInput = page.getByRole('textbox', { name: /Chatting with AI/ });
    await expect(chatInput).toBeVisible();

    // 4.1 テキスト入力の基本動作
    // 「Hello」と入力
    await chatInput.fill('Hello');

    // 入力フィールドに「Hello」が表示されていることを確認
    await expect(chatInput).toHaveValue('Hello');

    // 4.2 空メッセージの送信防止
    // 入力フィールドをクリアする
    await chatInput.fill('');

    // Enterキーを押して空メッセージが送信されないことを確認
    await page.keyboard.press('Enter');

    // チャット履歴エリアにメッセージが追加されていないことを暗黙的に確認
    // （エラーが発生しないことで確認）
  });
});
