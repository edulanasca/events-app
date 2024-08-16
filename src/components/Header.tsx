import { useRouter } from "next/navigation";
import UserMenu from "./UserMenu";

export default function Header() {
    const router = useRouter();

    return (
        <header className="w-full flex justify-between items-center mb-8">
            <button className="text-3xl font-bold" onClick={() => router.push("/")}>
                Events App
            </button>
            <div className="flex items-center gap-4">
                <button onClick={() => router.push("/event/my-events")}>My Events</button>
                <button onClick={() => router.push("/event/create")}>Create an Event</button>
            </div>
            <UserMenu />
        </header>
    );
}