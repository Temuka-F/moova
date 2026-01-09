
import { redirect } from 'next/navigation'

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CarsPage({ searchParams }: Props) {
    const params = await searchParams
    const urlParams = new URLSearchParams()

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (typeof value === 'string') {
                urlParams.set(key, value)
            } else if (Array.isArray(value)) {
                value.forEach(v => urlParams.append(key, v))
            }
        })
    }

    // Force list view if not specified
    if (!urlParams.has('view')) {
        urlParams.set('view', 'list')
    }

    // Redirect to home with params
    redirect(`/?${urlParams.toString()}`)
}
