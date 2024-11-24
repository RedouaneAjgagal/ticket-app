import { ICurrentUser } from "@/pages/_app"
import Link from "next/link"


const Navigation = (props: React.PropsWithoutRef<ICurrentUser>) => {
    const links = [
        { href: "/auth/signin", label: "Sign In", isVisible: !props.user },
        { href: "/auth/signup", label: "Sign Up", isVisible: !props.user },
        { href: "/orders", label: "Orders", isVisible: props.user },
        { href: "/auth/signout", label: "Sign Out", isVisible: props.user }
    ]


    const VisibleLinks = links
        .filter(link => link.isVisible)
        .map((link, index) => (
            <li key={index}>
                <Link href={link.href}>
                    {link.label}
                </Link>
            </li>
        ));

    return (
        <nav className="bg-gray-300/30 py-4 px-8">
            <div className="flex justify-between">
                <div>
                    <Link href={"/"} className="font-medium text-2xl text-slate-900">Ticket Application</Link>
                </div>
                <ul className="flex items-center gap-4 font-medium text-blue-600">
                    {VisibleLinks}
                </ul>
            </div>
        </nav>
    )
}

export default Navigation