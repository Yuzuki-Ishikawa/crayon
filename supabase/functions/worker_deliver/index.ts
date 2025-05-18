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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get users who should receive copy now
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
      .lte('next_scheduled_at', new Date().toISOString())
      .eq('delivery_freq', 'daily')

    if (profilesError) throw profilesError

    // Get today's copy
    const { data: copy, error: copyError } = await supabaseClient
      .from('copy_entries')
      .select('*')
      .eq('status', 'published')
      .order('publish_at', { ascending: false })
      .limit(1)
      .single()

    if (copyError) throw copyError

    // Send copy to each user
    for (const profile of profiles) {
      const response = await fetch('https://api.line.me/v2/bot/message/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')}`,
        },
        body: JSON.stringify({
          to: profile.line_user_id,
          messages: [
            {
              type: 'flex',
              altText: copy.headline,
              contents: {
                type: 'bubble',
                header: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: copy.headline,
                      weight: 'bold',
                      size: 'xl',
                    },
                  ],
                },
                body: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: copy.copy_text,
                      wrap: true,
                    },
                    {
                      type: 'text',
                      text: copy.explanation,
                      wrap: true,
                      margin: 'md',
                    },
                  ],
                },
                footer: {
                  type: 'box',
                  layout: 'vertical',
                  contents: [
                    {
                      type: 'text',
                      text: `出典: ${copy.source}`,
                      size: 'xs',
                      color: '#aaaaaa',
                    },
                  ],
                },
              },
            },
          ],
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      // Update next scheduled time
      const nextScheduled = new Date()
      nextScheduled.setDate(nextScheduled.getDate() + 1)
      nextScheduled.setHours(
        parseInt(profile.delivery_time.split(':')[0]),
        parseInt(profile.delivery_time.split(':')[1]),
        0,
        0
      )

      const { error: updateError } = await supabaseClient
        .from('profiles')
        .update({ next_scheduled_at: nextScheduled.toISOString() })
        .eq('id', profile.id)

      if (updateError) throw updateError
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}) 