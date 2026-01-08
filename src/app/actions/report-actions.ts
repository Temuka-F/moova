'use server'

import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { ReportType } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export type CreateReportInput = {
    reportedId: string
    type: 'USER' | 'CAR' | 'BOOKING' // Using string literal as fallback if enum not generated
    reason: string
}

export async function createReport(data: CreateReportInput) {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return { error: 'Unauthorized' }
    }

    try {
        const report = await prisma.report.create({
            data: {
                reporterId: user.id,
                reportedId: data.reportedId,
                type: data.type as ReportType,
                reason: data.reason,
            },
        })

        return { success: true, data: report }
    } catch (error) {
        console.error('Error creating report:', error)
        return { error: 'Failed to create report' }
    }
}
