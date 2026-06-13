import { Pizza } from 'lucide-react'
import Link from 'next/link'

const Logo = () => {
    return (
        <div className="shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
                <Pizza className="h-7 w-7 text-emerald-600 dark:text-emerald-500 transform group-hover:rotate-45 transition-transform duration-300" />
                <span className="text-2xl font-black tracking-tight font-sans">
                    Pizza<span className="text-emerald-600 dark:text-emerald-500">Craft</span>
                </span>
            </Link>
        </div>
    )
}

export default Logo