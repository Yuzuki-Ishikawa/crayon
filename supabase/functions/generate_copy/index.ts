import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const PROMPT = `あなたは、「コンセプトの教科書」を書いた細田高広氏です。日本の実際のコピー1つとそのキービジュアルを1-5枚選んでください。そのコピーについて、以下の2種類のフォーマットで文章を書いてください。
・問題編: コピーを隠し、クライアントからオリエンを受けたと仮定して出題をしてください。ヒントは出さないでください。
・解説編: 作者や年、クライアント名、広告主名、受賞歴などの基本情報や、概要、コピーができた背景や狙いを載せてください。段落分けをせずに、wiki調の散文で書いてください。

コピーは以下の基準で選定してください。上に書いた要件ほど優先度が高いです。
・コピーがつくられた背景や狙いがインタビュー記事などから取得でき、その議論の質が高く、読み手の学びになるもの（最優先。これが満たされていれば、有名なコピーでもよいし、古くてもよい。ただし、知名度が80%を超えるものは選んではいけない）。
・読み手が「おおっ」となる面白いもの。
・TCC（Tokyo Copywriters Club）などの賞関連のホームページに掲載されている事例。
・コンセプト（その事例やクライアントを貫く設計図）が明確なもの。その場合は、コンセプトについても説明する。
・クライアントから出されたオリエンの内容があるもの（その場合、問題編のオリエン文章作成に活用する。）
・知名度が比較的低く、広告代理店の社員に聞いたら認知率が30%以下と考えられるもの。
・新しい事例

以下の注意点を守ってください。
・ひとつの事例に対して複数コピーがある場合はひとつピックアップして、残りは本文で言及すること。
・必ず、正しい、現在アクセス可能な出典（タイトルとURLのペア）を複数載せること。
・忙しい時間に読んでもらうことを想定しているので、問題編、解説編ともに10-60秒程度で読めるものにすること。
・長くなっても構わないので、読みやすい文章にすること。「コンセプトの教科書」を書いた細田高広氏の文体に近づけること。
・簡単で読みやすい文章にすること。あまり一般的でない言い回しや長すぎる文を入れないこと。
・体言止めを多用しないこと。

読者層は大手広告代理店の新入社員とします。
+
+# 出力フォーマット
+以下の JSON オブジェクトだけを返してください。Markdown や説明文は不要です。
+{
+  "headline": string,            // 問題編の見出し (copy_entries.headline)
+  "problem_body": string,        // 問題編の本文 (copy_entries.problem_body)
+  "copy_text": string,           // 隠していたコピーそのもの (copy_entries.copy_text)
+  "key_visual_urls": string[],   // 1〜5 件の画像 URL (copy_entries.key_visual_urls)
+  "explanation": string,         // 解説編 (copy_entries.explanation)
+  "sources": Array<{title: string, url: string}>, // 参考情報の配列 (copy_entries.source)
+  "copywriter": string,          // コピーライター名 (copy_entries.copywriter)
+  "advertiser": string,          // 広告主名 (copy_entries.advertiser)
+  "awards": string,              // 受賞歴 (copy_entries.awards)
+  "year_created": number,        // 制作年 (copy_entries.year_created)
+  "tags":   string[]             // クライアントの業界 (copy_entries.industry_tags)
+}
`

serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  )
  const openaiKey = Deno.env.get('OPENAI_API_KEY')
  if (!openaiKey) return new Response('No OpenAI API key', { status: 500 })

  // OpenAI APIリクエスト
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: 'o3-2025-04-16',
      messages: [{ role: 'user', content: PROMPT }],
      response_format: { type: 'json_object' }
    }),
  })
  const data = await res.json()
  if (!data.choices?.[0]?.message?.content) {
    return new Response('No content', { status: 500 })
  }

  // JSONパース
  let copyJson
  try {
    copyJson = JSON.parse(data.choices[0].message.content)
  } catch (e) {
    return new Response('Invalid JSON', { status: 500 })
  }

  // copy_entriesにスキーマに合わせて保存
  const { error } = await supabase
    .from('copy_entries')
    .insert([{
      headline: copyJson.headline,
      problem_body: copyJson.problem_body,
      copy_text: copyJson.copy_text,
      key_visual_urls: copyJson.key_visual_urls,
      explanation: copyJson.explanation,
      source: copyJson.sources,
      copywriter: copyJson.copywriter,
      advertiser: copyJson.advertiser,
      awards: copyJson.awards,
      year_created: copyJson.year_created,
      tags: copyJson.tags,
      status: 'draft',
      publish_at: new Date().toISOString()
    }])
  if (error) return new Response(error.message, { status: 500 })

  return new Response(JSON.stringify({ success: true }), { status: 200 })
}) 