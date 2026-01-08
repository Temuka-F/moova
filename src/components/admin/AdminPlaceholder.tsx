
import { Construction } from 'lucide-react'

export function AdminPlaceholder({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center p-8">
            <div className="bg-muted/30 p-6 rounded-full mb-6">
                <Construction className="w-12 h-12 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-2">{title}</h2>
            <p className="text-muted-foreground max-w-[500px] mb-8">
                This administrative module is currently under development.
                It will be available in upcoming updates.
            </p>
        </div>
    )
}
