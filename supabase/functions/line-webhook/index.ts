import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const json = JSON.parse(body)
    const event = json.events[0]
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (event.type === 'follow') {
      // 初期値: 毎日20:00
      // const now = new Date()
      // now.setHours(20, 0, 0, 0)
      // if (now <= new Date()) {
      //   now.setDate(now.getDate() + 1)
      // }

      // await supabaseClient
      //   .from('profiles')
      //   .upsert({
      //     line_user_id: event.source.userId,
      //     delivery_freq: 'daily',
      //     delivery_time: '20:00',
      //     next_scheduled_at: now.toISOString(),
      //   })

      // ウェルカムメッセージのみ送信
      await fetch('https://api.line.me/v2/bot/message/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')}`,
        },
        body: JSON.stringify({
          replyToken: event.replyToken,
          messages: [
            {
              type: 'text',
              text: '「まいコー」まいにち広告部は、すぐれた広告を1日1本お届けするサービスです！お楽しみに！',
            },
          ],
        }),
      })
    }

    // if (event.type === 'postback') {
    //   // console.log('postback data:', event.postback.data)
    //   const postbackData = new URLSearchParams(event.postback.data)
    //   const action = postbackData.get('action')
    //   const freq = postbackData.get('freq')
    //   const weekday = postbackData.get('weekday')
    //   const time = postbackData.get('time')
    //   const page = parseInt(postbackData.get('page') || '0', 10)

    //   if (freq) {
    //     await supabaseClient
    //       .from('profiles')
    //       .update({
    //         delivery_freq: freq,
    //         ...(weekday ? { weekday: Number(weekday) } : {}),
    //       })
    //       .eq('line_user_id', event.source.userId)

    //     // 30分刻みの時刻リスト
    //     const timeOptions = []
    //     for (let h = 0; h < 24; h++) {
    //       for (let m = 0; m < 60; m += 30) {
    //         const label = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
    //         timeOptions.push({
    //           type: 'action',
    //           action: {
    //             type: 'postback',
    //             label,
    //             data: `time=${label}`,
    //           },
    //         })
    //       }
    //     }
    //     // ページング（13個ずつ）
    //     const pageSize = 13
    //     const pagedOptions = timeOptions.slice(page * pageSize, (page + 1) * pageSize)
    //     if ((page + 1) * pageSize < timeOptions.length) {
    //       pagedOptions.push({
    //         type: 'action',
    //         action: {
    //           type: 'postback',
    //           label: '次へ',
    //           data: `freq=${freq}${weekday ? `&weekday=${weekday}` : ''}&page=${page + 1}`,
    //         },
    //       })
    //     }
    //     await fetch('https://api.line.me/v2/bot/message/reply', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')}`,
    //       },
    //       body: JSON.stringify({
    //         replyToken: event.replyToken,
    //         messages: [
    //           {
    //             type: 'text',
    //             text: '配信時刻を選択してください（30分刻み）',
    //             quickReply: {
    //               items: pagedOptions,
    //             },
    //           },
    //         ],
    //       }),
    //     })
    //   }

    //   if (time) {
    //     const now = new Date()
    //     const [hours, minutes] = time.split(':').map(Number)
    //     const nextScheduled = new Date(now)
    //     nextScheduled.setHours(hours, minutes, 0, 0)
    //     if (nextScheduled <= now) {
    //       nextScheduled.setDate(nextScheduled.getDate() + 1)
    //     }

    //     await supabaseClient
    //       .from('profiles')
    //       .update({
    //         delivery_time: time,
    //         next_scheduled_at: nextScheduled.toISOString(),
    //       })
    //       .eq('line_user_id', event.source.userId)

    //     await fetch('https://api.line.me/v2/bot/message/reply', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')}`,
    //       },
    //       body: JSON.stringify({
    //         replyToken: event.replyToken,
    //         messages: [
    //           {
    //             type: 'text',
    //             text: '設定が完了しました！\nコピーをお楽しみに。',
    //           },
    //         ],
    //       }),
    //     })
    //   }
    // }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  }
})