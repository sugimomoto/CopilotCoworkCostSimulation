# Copilot Cowork コスト試算

Microsoft Copilot の Cowork（Copilot Credits）利用コストを試算する React アプリです。

公開URL: https://sugimomoto.github.io/CopilotCoworkCostSimulation/

## 免責事項

本ツールは**非公式**の試算ツールです。算出される金額・クレジット数はあくまで概算であり、その正確性・完全性について一切保証せず、本ツールの利用により生じたいかなる損害についても作者は責任を負いません。正式な情報・価格については必ず公式情報をご確認ください。

## 出典

価格・モデル・利用前提などの正式な情報は、Microsoft の公式発表を正とします。

- [Copilot Cowork が一般提供開始（Microsoft News）](https://news.microsoft.com/source/asia/features/copilot-cowork-is-now-generally-available/?lang=ja)

一般提供時点で Copilot Cowork は Anthropic のモデル（Opus 4.8 および Sonnet 4.6 を含む）上で動作します。Frontier プログラムでは GPT 5.5 を利用でき、Cowork 1 も近日提供予定です。本試算は Anthropic Opus 4.8 の使用を前提としています。

## ローカル開発

```bash
npm install
npm run dev      # 開発サーバー起動
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果をプレビュー
```

## デプロイ

`main` ブランチへの push で GitHub Actions が自動的に GitHub Pages へデプロイします
（`.github/workflows/deploy.yml`）。

## ライセンス

本ツールはオープンソース（[MIT License](LICENSE)）として公開されています。
